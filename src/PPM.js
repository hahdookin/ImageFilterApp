import DataScanner from './DataScanner.js';

/**
 * Wrapper class for RGB pixel
 */
class Pixel {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    rgb() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`
    }
    toString() {
        return this.rgb();
    }
}

// PPM file format: https://en.wikipedia.org/wiki/Netpbm
export default class PPM {
    constructor(data) {
        const scanner = new DataScanner(new Uint8Array(data));

        // Grab header info (type, width, height, range of pixel values)
        this.type = String.fromCharCode(...scanner.readUntilWhiteSpace());
        this.w = parseInt(String.fromCharCode(...scanner.readUntilWhiteSpace()));
        this.h = parseInt(String.fromCharCode(...scanner.readUntilWhiteSpace()));
        this.max = parseInt(String.fromCharCode(...scanner.readUntilWhiteSpace()));

        // Read whitespace byte after header
        scanner.pos++;

        // Rest of the bytes are pixel data
        this.imageData = scanner.toEnd();
        this.pixels = [];

        // Convert tuples of 3 bytes to a single pixel (rbg) value
        for (let i = 0; i < this.imageData.byteLength; i += 3) {
            this.pixels.push(new Pixel(
                this.imageData[i + 0],
                this.imageData[i + 1],
                this.imageData[i + 2],
            ));
        }
    }

    static async fromFile(file) {
        const data = await file.arrayBuffer();
        return new PPM(data);
    }

    // Return the pixel at (x, y) or (col, row)
    at(row, col) {
        return this.pixels[this.w * row + col];
    }

    // Draws the PPM to a specified canvas
    draw(canvas) {
        canvas.width = this.w;
        canvas.height = this.h;

        const ctx = canvas.getContext('2d');

        for (let row = 0; row < this.h; row++) {
            for (let col = 0; col < this.w; col++) {
                ctx.fillStyle = '' + this.at(row, col);
                ctx.fillRect(col, row, 1, 1);
            }
        }
    }
}
