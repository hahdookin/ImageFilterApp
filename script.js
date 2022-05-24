import { vsSource } from './src/shaders/vertex.js';
import { fsSource } from './src/shaders/fragment.js';

// Document elements that are needed
const fileUploadBtn = document.getElementById('uploaded-file');
const applyFilterBtn = document.getElementById('apply-button');
const canvas = document.querySelector('canvas');

// Info pertaining to a loaded image
let width, height;
let originalImage;
let workingImage;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(0, 0);

// Helper function to load image as a Promise
function loadTexture(url) {
    return new Promise(resolve => {
        new THREE.TextureLoader().load(url, resolve)
    })
}

// Creates a plane mesh with a texture from an image
function createTexturedPlane(texture, w, h) {
    const resolution = new THREE.Vector2(w, h);
    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            texture1: { type: 't', value: texture },
            resolution: { type: 'vec2', value: resolution }
        },
        vertexShader: vsSource,
        fragmentShader: fsSource
    })

    return new THREE.Mesh(geometry, material);
}

async function onImageLoad() {
    // Manipulate the renderer
    width = originalImage.width;
    height = originalImage.height;
    renderer.setSize(width, height);

    // Clear the scene of previous planes
    scene.clear();

    // Add the image to the plane and draw it
    const texture = await loadTexture(originalImage.src);
    const plane = await createTexturedPlane(texture, width, height);
    scene.add( plane );
    renderer.render( scene, camera );
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

applyFilterBtn.addEventListener('click', function(e) {
    const fieldSet = this.parentElement.parentElement;
    fieldSet.querySelectorAll('input').forEach((el) => {
        if (!el.checked) return;

        switch (el.value) {
            case "normal":
                break;
            case "box-blur":
                break;
            case "gaussian-blur":
                break;
            case "pixelated":
                break;
            case "greyscale":
                break;
            case "emboss":
                break;
            case "sharpen":
                break;
            case "ridge":
                break;
        }
    });
});
