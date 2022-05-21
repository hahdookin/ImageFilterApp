import PPM from './src/PPM.js';
import Kernel from './src/Kernel.js';

const fileUploadBtn = document.getElementById('uploaded-file');
const applyFilterBtn = document.getElementById('apply-button');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.querySelector('body').appendChild(canvas);

fileUploadBtn.addEventListener('input', async function(e) {
    const ppm = await PPM.fromFile(this.files[0]);
    const pixels = ppm.pixels;

    // pixels.greyscale();
    pixels.convolve(Kernel.Sharpen());

    pixels.draw(canvas);
});

applyFilterBtn.addEventListener('click', function(e) {

});
