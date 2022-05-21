import Pixel from './Pixel.js';

export default class PixelSpace {
    constructor(w, h) {
        this.pixels = [];
        this.w = w;
        this.h = h;
    }
    pushPixel(pixel) {
        this.pixels.push(pixel);
    }

    // Return the pixel at (x, y) or (col, row)
    get(row, col) {
        return this.pixels[this.w * row + col];
    }

    set(row, col, pixel) {
        this.pixels[this.w * row + col] = pixel;
    }

    clone() {
        const res = new PixelSpace(this.w, this.h);
        for (const pixel of this.pixels) {
            res.pushPixel(Object.assign({}, pixel));
        }
        return res;
    }

    // Draws the PPM to a specified canvas
    draw(canvas) {
        canvas.width = this.w;
        canvas.height = this.h;
        const ctx = canvas.getContext('2d');

        for (let row = 0; row < this.h; row++) {
            for (let col = 0; col < this.w; col++) {
                ctx.fillStyle = '' + this.get(row, col);
                ctx.fillRect(col, row, 1, 1);
            }
        }
    }

    // Apply greyscale filter
    greyscale() {
        for (let row = 0; row < this.h; row++) {
            for (let col = 0; col < this.w; col++) {
                const avg = this.get(row, col).avg();
                this.set(row, col, avg);
            }
        }
    }

    // Apply monochrome filter
    monochrome() {
        for (let row = 0; row < this.h; row++) {
            for (let col = 0; col < this.w; col++) {
                const avg = this.get(row, col).avg();
                this.set(row, col, avg.r > 122 ? Pixel.white() : Pixel.black());
            }
        }
    }

    // Apply invert filter
    invert() {
        for (let row = 0; row < this.h; row++) {
            for (let col = 0; col < this.w; col++) {
                const original = this.get(row, col);
                this.set(row, col, original.invert());
            }
        }
    }
}
