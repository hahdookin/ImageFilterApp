function isByteWhiteSpace(byte) {
    return ['\n', ' ', '\t'].map(c => c.charCodeAt(0)).includes(byte);
}

const fileUpload = document.getElementById('uploaded-file')

class DataScanner {
    constructor(data) {
        this.data = data;
        this.pos = 0;
    }
    atCursor() {
        return this.data[this.pos];
    }
    toEnd() {
        return this.data.subarray(this.pos);
    }
}

class Pixel {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

function readUntilWhiteSpace(dataScanner) {
    // Skip whitespace before
    while (isByteWhiteSpace(dataScanner.atCursor())) {
        dataScanner.pos++;
    }
    const start = dataScanner.pos;
    while (!isByteWhiteSpace(dataScanner.atCursor())) {
        dataScanner.pos++;
    }
    return dataScanner.data.subarray(start, dataScanner.pos);
}

fileUpload.addEventListener('input', async function(e) {
    const ppm = this.files[0];
    const data = await ppm.arrayBuffer();
    const scanner = new DataScanner(new Uint8Array(data));

    // Parse out header info
    const type = String.fromCharCode(...readUntilWhiteSpace(scanner));
    const w = parseInt(String.fromCharCode(...readUntilWhiteSpace(scanner)));
    const h = parseInt(String.fromCharCode(...readUntilWhiteSpace(scanner)));
    const max = parseInt(String.fromCharCode(...readUntilWhiteSpace(scanner)));

    // Read whitespace byte after header
    scanner.pos++;

    const pixels = scanner.toEnd();

    //console.log(type, w, h, max, pixels);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    document.querySelector('body').appendChild(canvas);
    const ctx = canvas.getContext('2d');
    // const id = ctx.createImageData(1, 1);
    // const d = id.data;

    for (let row = 0; row < h; row++) {
        for (let col = 0; col < w * 3; col += 3) {
            // d[0] = 255;//pixels[w * row + col + 0]
            // d[1] = 255;//pixels[w * row + col + 1]
            // d[2] = 0;//pixels[w * row + col + 2]
            // d[3] = 1;
            // ctx.putImageData(id, row, col);
            const r = pixels[w * 3 * row + col + 0]
            const g = pixels[w * 3 * row + col + 1]
            const b = pixels[w * 3 * row + col + 2]
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(Math.floor(col / 3), row, 1, 1);
        }
    }

})
