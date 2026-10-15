const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
for (const folder of ['models', 'draco']) {
  const source = path.join(root, '..', 'public', folder);
  const destination = path.join(root, 'public', folder);
  if (!fs.existsSync(source)) throw new Error(`Missing website assets: ${source}`);
  fs.cpSync(source, destination, {recursive:true});
}
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content.json'), 'utf8'));
const wav = path.join(root, 'public', manifest.soundtrack);
const mp3 = wav.replace(/\.wav$/i, '.mp3');
if (!fs.existsSync(wav) && fs.existsSync(mp3)) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', mp3, '-ar', '48000', '-ac', '2', wav], {stdio:'inherit'});
}
if (!fs.existsSync(wav)) throw new Error(`Missing soundtrack: ${wav}`);
console.log('Synced model, local Draco decoders, and soundtrack assets.');
