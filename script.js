import PPM from './src/PPM.js';
import Kernel from './src/Kernel.js';

const fileUploadBtn = document.getElementById('uploaded-file');
const applyFilterBtn = document.getElementById('apply-button');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.querySelector('body').appendChild(canvas);

let originalImage;
let workingImage;

fileUploadBtn.addEventListener('input', async function(e) {
    const ppm = await PPM.fromFile(this.files[0]);
    originalImage = ppm.pixels;
    workingImage = ppm.pixels.clone();

    workingImage.draw(canvas);
});

applyFilterBtn.addEventListener('click', function(e) {
    const fieldSet = this.parentElement.parentElement;
    fieldSet.querySelectorAll('input').forEach((el) => {
        if (!el.checked) return;

        switch (el.value) {
            case "normal":
                workingImage = originalImage.clone();
                break;
            case "box-blur":
                workingImage.convolve(Kernel.BoxBlur());
                break;
            case "gaussian-blur":
                workingImage.convolve(Kernel.GaussianBlur());
                break;
            case "pixelated":
                break;
            case "greyscale":
                workingImage.greyscale();
                break;
            case "emboss":
                workingImage.convolve(Kernel.Emboss());
                break;
            case "sharpen":
                workingImage.convolve(Kernel.Sharpen());
                break;
            case "ridge":
                workingImage.convolve(Kernel.Ridge());
                break;
        }

        workingImage.draw(canvas);
    });
});
