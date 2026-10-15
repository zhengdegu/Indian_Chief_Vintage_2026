# Third-party components and assets

## Three.js

- Source: <https://github.com/mrdoob/three.js>
- Package: `three` 0.180.0, pinned by `package-lock.json`.
- Copyright © 2010–2025 three.js authors.
- License: MIT. Full text: [public/licenses/three-LICENSE.txt](public/licenses/three-LICENSE.txt).

## Draco

- Source: <https://github.com/google/draco>
- The three decoder files in `public/draco/` were copied unchanged from `three@0.180.0/examples/jsm/libs/draco/gltf/`.
- Copyright Google Inc., Draco authors.
- License: Apache License 2.0. Full upstream text: [public/draco/LICENSE](public/draco/LICENSE).
- The binaries decode the `KHR_draco_mesh_compression` extension used by the included GLB. They run locally; no remote decoder service is used.

## Remotion video tooling

- The `video/` project uses Remotion and its Three.js, media, captions and CLI packages, pinned by `video/package-lock.json`.
- Source and license: <https://github.com/remotion-dev/remotion>, <https://github.com/remotion-dev/remotion/blob/main/LICENSE.md>.
- `video/src/basic-captions.tsx` is copied from the Remotion [Basic Captions element](https://www.remotion.dev/elements/captions/basic-captions); project-specific styling is in `video/src/style.css`.
- React, React DOM and React Three Fiber retain the license notices shipped with their packages.

## Vehicle images and graphics

The vehicle model and rendered webpage images were produced for this project. The Indian Motorcycle name, marks and photographic decal sources remain their owners' material. Component software licenses do not license these marks, photographs or derivative artwork. See [ASSET_NOTES.md](ASSET_NOTES.md) and [texture provenance](docs/TEXTURE_PROVENANCE.md).

Other npm dependencies retain the notices and licenses distributed in their respective packages.
