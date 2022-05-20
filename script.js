import PPM from './src/PPM.js';

const fileUploadBtn = document.getElementById('uploaded-file');
const applyFilterBtn = document.getElementById('apply-button');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.querySelector('body').appendChild(canvas);

fileUploadBtn.addEventListener('input', async function(e) {
    const ppm = await PPM.fromFile(this.files[0]);

    ppm.draw(canvas);

    // Set dimensions of the canvas
    // canvas.width = ppm.w;
    // canvas.height = ppm.h;

    // for (let row = 0; row < ppm.h; row++) {
    //     for (let col = 0; col < ppm.w; col++) {
    //         const {r, g, b} = ppm.at(row, col);
    //         ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    //         ctx.fillRect(col, row, 1, 1);
    //     }
    // }

})
