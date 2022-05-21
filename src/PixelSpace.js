import Pixel from './Pixel.js';

function clamp(n, min, max) {
    return Math.min(Math.max(min, n), max);
}

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

    // Set the pixel at (col, row)
    set(row, col, pixel) {
        this.pixels[this.w * row + col] = pixel;
    }

    // Creates a clone of a pixel space
    // Useful for applying kernels and storing original.
    clone() {
        const res = new PixelSpace(this.w, this.h);
        for (const pixel of this.pixels) {
            res.pushPixel(pixel.clone());
        }
        return res;
    }

    // Draws the PixelSpace to a specified canvas
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

    // Convolve a kernel to the entire PixelSpace
    // https://en.wikipedia.org/wiki/Kernel_(image_processing)
    convolve(kernel) {
        // Keep a copy of the original image to apply kernel to
        const original = this.clone();

        // TODO: Handle edge cases
        for (let row = 1; row < this.h - 1; row++) {
            for (let col = 1; col < this.w - 1; col++) {
                this.set(row, col, original.applyKernel(row, col, kernel));
            }
        }
    }

    // Maps 0-9 to an offset from the kernel's origin (center location)
    kernelPos(i) {
        const d = (dx, dy) => { return {drow: dy, dcol: dx}; }
        return [
            d(-1, -1), d(-1, 0), d(-1, 1),
            d(0, -1), d(0, 0), d(0, 1),
            d(1, -1), d(1, 0), d(1, 1)
        ][i]
    }

    // Apply a kernel to a single pixel at (col, row)
    applyKernel(row, col, kernel) {
        const res = this.get(row, col).clone();
        const o = kernel.origin();
        for (const channel of "rgb") {
            let accum = 0;
            for (let i = 0; i < 9; i++) {
                const { drow, dcol } = this.kernelPos(i);
                const color = this.get(row + drow, col + dcol)[channel];
                accum += kernel.m[o.row + drow][o.col + dcol] * color;
            }
            // res[channel] = Math.floor(Math.min(Math.max(0, accum), 255));
            res[channel] = Math.floor(clamp(accum, 0, 255));
        }

        return res;
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
