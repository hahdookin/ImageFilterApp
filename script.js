import { vsSource } from './src/shaders/vertex.js';
import { fsSource } from './src/shaders/fragment.js';

// Document elements that are needed
const fileUploadBtn = document.getElementById('uploaded-file');
const applyFilterBtn = document.getElementById('apply-button');
const resetFilterBtn = document.getElementById('reset-button');
const canvas = document.querySelector('canvas');

// Info pertaining to a loaded image
let width, height;
let originalImage;
let workingImage;

// Initialize THREE.js rendering context
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true
});
// const context = renderer.domElement.getContext('experimental-webgl', {
//     preserveDrawingBuffer: true
// });
renderer.setSize(0, 0);

// Helper function to load image as a Promise
function loadTexture(url) {
    return new Promise(resolve => {
        new THREE.TextureLoader().load(url, resolve)
    })
}

// Creates a plane mesh with a texture from an image
function createTexturedPlane(texture, w, h, filter) {
    const resolution = new THREE.Vector2(w, h);
    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uFilter: { type: 'int', value: filter },
            texture1: { type: 't', value: texture },
            resolution: { type: 'vec2', value: resolution }
        },
        vertexShader: vsSource,
        fragmentShader: fsSource
    })

    return new THREE.Mesh(geometry, material);
}

async function drawFilteredImage(image, filter) {
    // Clear the scene of previous planes
    scene.clear();

    // Add the image to the plane and draw it
    const texture = await loadTexture(image.src);
    const plane = await createTexturedPlane(
        texture,
        image.width,
        image.height,
        filter
    );
    scene.add(plane);
    renderer.render(scene, camera);

    // Store image with filter applied as current working image
    workingImage.src = renderer.domElement.toDataURL();
}

// Callback for when a fresh image is uploaded via
// the upload file button.
async function onImageLoad() {
    // Manipulate the renderer
    width = originalImage.width;
    height = originalImage.height;
    renderer.setSize(width, height);

    await drawFilteredImage(originalImage, filterEnum.IDENTITY);
}

fileUploadBtn.addEventListener('input', async function(e) {
    // Store an original copy and a working copy
    // of the image.
    originalImage = new Image();
    workingImage = new Image();

    // Read the file and set the images' sources.
    const fr = new FileReader();

    // Callback for when FileReader has read the files.
    fr.onload = () => {
        originalImage.src = fr.result;
        workingImage.src = fr.result;
    }

    // Callback for when the Images have completely loaded.
    // This is where things happen.
    originalImage.onload = onImageLoad;

    fr.readAsDataURL(this.files[0]);
});

const filterEnum = {
    IDENTITY: 0,
    BOX_BLUR: 1,
    GAUSSIAN_BLUR: 2,
    PIXELATE: 3,
    GREYSCALE: 4,
    EMBOSS: 5,
    SHARPEN: 6,
    RIDGE: 7,
    MONOCHROME: 8,
};

applyFilterBtn.addEventListener('click', function(e) {
    // Apply button shouldn't work if no image is uploaded
    if (originalImage === undefined) return;

    const fieldSet = this.parentElement.parentElement;
    fieldSet.querySelectorAll('input').forEach(async (el) => {
        if (!el.checked) return;

        let filter;
        switch (el.value) {
            case "normal":
                filter = filterEnum.IDENTITY;
                break;
            case "box-blur":
                filter = filterEnum.BOX_BLUR;
                break;
            case "gaussian-blur":
                filter = filterEnum.GAUSSIAN_BLUR;
                break;
            case "pixelated":
                filter = filterEnum.PIXELATE;
                break;
            case "greyscale":
                filter = filterEnum.GREYSCALE;
                break;
            case "emboss":
                filter = filterEnum.EMBOSS;
                break;
            case "sharpen":
                filter = filterEnum.SHARPEN;
                break;
            case "ridge":
                filter = filterEnum.RIDGE;
                break;
            case "monochrome":
                filter = filterEnum.MONOCHROME;
                break;
        }

        await drawFilteredImage(workingImage, filter);
    });
});

resetFilterBtn.addEventListener('click', async function(e) {
    // Apply button shouldn't work if no image is uploaded
    if (originalImage === undefined) return;

    await drawFilteredImage(originalImage, filterEnum.IDENTITY);
})
