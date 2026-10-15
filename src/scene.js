import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const presets = [
  { position: [2.925, 1.726, 4.81], target: [0, .53, 0], offset: .15, vertical: .13, fov: 26 },
  { position: [1.37, .983, 2.5625], target: [.02, .47, 0], offset: .22, vertical: .05, fov: 26 },
  { position: [-1.46, 1.784, 2.665], target: [-.12, .77, 0], offset: -.20, vertical: .12, fov: 25 },
  { position: [0, 1.082, 5.525], target: [-.03, .51, 0], offset: .16, vertical: .08, fov: 27 },
  { position: [-3.375, 1.6175, 4.4375], target: [0, .53, 0], offset: 0, vertical: .12, fov: 27 },
];
const mobileScales = [1.2, 1.38, 1.2, 1.4, 1.4];

export function createExperience(canvas, callbacks) {
  const state = { ready: false, explore: false, progress: 0, spin: false, lost: false };
  let renderer, scene, camera, controls, model, frame, pmremTarget;
  let currentOffset = .14;
  let currentVertical = .13, mobileVertical = .04;
  let last = performance.now();
  let frames = 0, sampledFPS = 0, fpsStart = last;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desiredPosition = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3();
  const temp = new THREE.Vector3();
  const look = new THREE.Vector3(0, .53, 0);
  const dimensions = () => ({ width: innerWidth, height: innerHeight, mobile: innerWidth <= 760 });
  const api = {
    get ready() { return state.ready && !state.lost; },
    setProgress(value) { state.progress = value; },
    setExplore(value) {
      if (!controls) return;
      state.explore = value;
      controls.enabled = value;
      controls.enableZoom = value;
      canvas.style.touchAction = value ? 'none' : 'pan-y';
      if (value) {
        controls.target.copy(look);
        // Preserve the current composition; no jump when taking control.
        controls.update();
      }
    },
    setSpin(value) { state.spin = value; if (controls) controls.autoRotate = value; },
    focus(view) {
      const preset = view === 'profile' ? presets[3] : presets[1];
      const mobile = dimensions().mobile;
      look.fromArray(preset.target); controls.target.copy(look);
      camera.position.fromArray(preset.position);
      if (mobile) camera.position.sub(look).multiplyScalar(view === 'profile' ? 1.4 : 1.38).add(look);
      currentOffset = mobile ? 0 : preset.offset;
      currentVertical = preset.vertical; mobileVertical = .04;
      camera.fov = mobile ? 42 : preset.fov;
      projection(); camera.lookAt(look); controls.update();
    },
    capture() {
      renderer.setClearAlpha(1);
      renderer.render(scene, camera);
      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (!blob) { reject(new Error('Image capture failed')); return; }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = 'Chief-Vintage-Sturgis.png'; link.href = url;
          document.body.append(link); link.click(); link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 60000);
          resolve();
        }, 'image/png');
        renderer.setClearAlpha(0);
      });
    },
    getMetrics() {
      return { ready: state.ready, fps: Math.round(sampledFPS), calls: renderer?.info.render.calls, triangles: renderer?.info.render.triangles, pixelRatio: renderer?.getPixelRatio(), modelMeshes: model ? countMeshes(model) : 0, webgl: Boolean(renderer), camera: camera?.position.toArray(), target: look.toArray(), progress: state.progress, cameraSettled: !state.explore && camera?.position.distanceTo(desiredPosition) < .002 };
    },
  };

  function projection() {
    const { width, height, mobile } = dimensions();
    camera.aspect = width / height;
    camera.setViewOffset(width, height, -width * (mobile ? 0 : currentOffset), -height * (mobile ? mobileVertical : currentVertical), width, height);
    camera.updateProjectionMatrix();
  }
  function resize() {
    const { width, height, mobile } = dimensions();
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    projection();
  }
  function setCamera(delta, immediate = false) {
    const a = Math.floor(state.progress);
    const b = Math.min(a + 1, presets.length - 1);
    const raw = state.progress - a;
    const t = raw * raw * (3 - 2 * raw);
    const first = presets[a], second = presets[b];
    desiredPosition.fromArray(first.position).lerp(temp.fromArray(second.position), t);
    desiredTarget.fromArray(first.target).lerp(temp.fromArray(second.target), t);
    const mobile = dimensions().mobile;
    const engineWeight = Math.max(0, 1 - Math.abs(state.progress - 1));
    if (mobile) {
      const fit = Math.max(1, .462 / camera.aspect);
      const scale = (mobileScales[a] + (mobileScales[b] - mobileScales[a]) * t) * fit;
      desiredPosition.sub(desiredTarget).multiplyScalar(scale).add(desiredTarget);
    }
    const alpha = immediate || reduced.matches ? 1 : 1 - Math.exp(-delta * 7);
    camera.position.lerp(desiredPosition, alpha); look.lerp(desiredTarget, alpha);
    currentOffset = THREE.MathUtils.lerp(currentOffset, first.offset + (second.offset - first.offset) * t, alpha);
    currentVertical = THREE.MathUtils.lerp(currentVertical, first.vertical + (second.vertical - first.vertical) * t, alpha);
    mobileVertical = THREE.MathUtils.lerp(mobileVertical, .04 + engineWeight * .055, alpha);
    camera.fov = THREE.MathUtils.lerp(camera.fov, mobile ? 42 : first.fov + (second.fov - first.fov) * t, alpha);
    projection();
    camera.lookAt(look);
  }
  function animate(now) {
    frame = requestAnimationFrame(animate);
    if (document.hidden || state.lost) { last = now; return; }
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (state.explore) {
      controls.update(dt); look.copy(controls.target);
    } else {
      controls.autoRotate = false;
      setCamera(dt);
    }
    renderer.render(scene, camera);
    frames++;
    if (now - fpsStart > 1500) { sampledFPS = frames * 1000 / (now - fpsStart); frames = 0; fpsStart = now; }
  }
  function fail(error) {
    if (frame) cancelAnimationFrame(frame);
    callbacks.onError(error instanceof Error ? error.message : String(error));
  }

  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .98;
    renderer.setClearColor(0x111110, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x111110, .075);
    camera = new THREE.PerspectiveCamera(26, innerWidth / innerHeight, .02, 80);
    camera.position.fromArray(presets[0].position);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = new RoomEnvironment();
    pmremTarget = pmrem.fromScene(env, .04);
    scene.environment = pmremTarget.texture;
    scene.environmentIntensity = .8;
    env.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xe6ebf2, 0x2b1914, .8));
    const key = new THREE.DirectionalLight(0xffecd3, 2.8);
    key.position.set(1.8, 4, 3.4);
    key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -2.1, right: 2.1, top: 2.1, bottom: -2.1, near: .2, far: 12 });
    key.shadow.bias = -.0001; key.shadow.normalBias = .015; key.shadow.radius = 3;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb8ccdf, 2.5);
    rim.position.set(-2, 2.6, -2.1); scene.add(rim);
    const front = new THREE.DirectionalLight(0xffd8b6, 1.5);
    front.position.set(2.8, 1.1, -1.5); scene.add(front);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.ShadowMaterial({ opacity: .42 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -.002;
    floor.receiveShadow = true; scene.add(floor);
    // Soft contact shadow grounds the model, including devices with weak shadows.
    const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = 256; shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(128, 128, 8, 128, 128, 125);
    gradient.addColorStop(0, 'rgba(0,0,0,.6)'); gradient.addColorStop(.5, 'rgba(0,0,0,.3)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 256, 256);
    const contact = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false, opacity: .8 }));
    contact.rotation.x = -Math.PI / 2; contact.position.y = -.001; scene.add(contact);

    // Desktop can take over by dragging; touch remains page scroll until opted in.
    canvas.addEventListener('pointerdown', event => {
      if (state.ready && event.pointerType === 'mouse' && event.button === 0) callbacks.onInteract();
    });
    controls = new OrbitControls(camera, canvas);
    controls.enabled = false; controls.enablePan = false; controls.enableZoom = false;
    canvas.style.touchAction = 'pan-y';
    controls.enableDamping = true; controls.dampingFactor = .075;
    controls.minDistance = .8; controls.maxDistance = 8;
    controls.minPolarAngle = .24; controls.maxPolarAngle = Math.PI / 2 - .03;
    controls.autoRotateSpeed = .6;
    controls.target.copy(look);
    resize(); setCamera(1, true);
    window.addEventListener('resize', resize);
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); state.lost = true; fail('WebGL context lost'); });
    canvas.addEventListener('webglcontextrestored', () => location.reload());

    const draco = new DRACOLoader(); draco.setDecoderPath('/draco/'); draco.setWorkerLimit(2);
    const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
    loader.load('/models/chief-vintage.glb', gltf => {
      model = gltf.scene;
      model.traverse(object => {
        if (!object.isMesh) return;
        object.castShadow = true; object.receiveShadow = false;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          material.envMapIntensity = 1;
          if (material.map) material.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          if (/Decal|Emblem|Photograph/i.test(material.name)) { material.depthWrite = false; material.polygonOffset = true; material.polygonOffsetFactor = -1; }
        }
      });
      scene.add(model);
      renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, camera);
      state.ready = true; draco.dispose();
      callbacks.onProgress(100); callbacks.onReady();
    }, progress => {
      callbacks.onProgress(progress.total ? Math.min(96, progress.loaded / progress.total * 96) : 40);
    }, fail);
    frame = requestAnimationFrame(animate);
  } catch (error) { queueMicrotask(() => fail(error)); }
  return api;
}

function countMeshes(model) { let n = 0; model.traverse(o => { if (o.isMesh) n++; }); return n; }
