import DataScanner from './DataScanner.js';
import PixelSpace from './PixelSpace.js';
import Pixel from './Pixel.js';

/*
 * PPM file format: https://en.wikipedia.org/wiki/Netpbm
 * Wrapper class for a PPM file. Parses the PPM file
 * and creates a pixelspace from it.
 */
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
        this.pixels = new PixelSpace(this.w, this.h);

        // Convert tuples of 3 bytes to a single pixel (rbg) value
        for (let i = 0; i < this.imageData.byteLength; i += 3) {
            this.pixels.pushPixel(new Pixel(
                this.imageData[i + 0],
                this.imageData[i + 1],
                this.imageData[i + 2],
            ));
        }
    }

    // Construct a PPM object from a File
    static async fromFile(file) {
        const data = await file.arrayBuffer();
        return new PPM(data);
    }

    // Draws the PPM to a specified canvas
    // draw(canvas) {
    //     canvas.width = this.w;
    //     canvas.height = this.h;

    //     const ctx = canvas.getContext('2d');

    //     this.invert();
    //     this.greyscale();

    //     for (let row = 0; row < this.h; row++) {
    //         for (let col = 0; col < this.w; col++) {
    //             ctx.fillStyle = '' + this.pixels.get(row, col);
    //             ctx.fillRect(col, row, 1, 1);
    //         }
    //     }
    // }

    // // Apply greyscale filter
    // greyscale() {
    //     for (let row = 0; row < this.h; row++) {
    //         for (let col = 0; col < this.w; col++) {
    //             const avg = this.pixels.get(row, col).avg();
    //             this.pixels.set(row, col, avg);
    //         }
    //     }
    // }

    // // Apply monochrome filter
    // monochrome() {
    //     for (let row = 0; row < this.h; row++) {
    //         for (let col = 0; col < this.w; col++) {
    //             const avg = this.pixels.get(row, col).avg();
    //             this.pixels.set(row, col, avg.r > 122 ? Pixel.white() : Pixel.black());
    //         }
    //     }
    // }

    // // Apply invert filter
    // invert() {
    //     for (let row = 0; row < this.h; row++) {
    //         for (let col = 0; col < this.w; col++) {
    //             const original = this.pixels.get(row, col);
    //             this.pixels.set(row, col, original.invert());
    //         }
    //     }
    // }


}
