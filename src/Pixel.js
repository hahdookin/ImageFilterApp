/**
 * Wrapper class for RGB pixel
 */
export default class Pixel {
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
    avg() {
        const avg = Math.floor((this.r + this.g + this.b) / 3);
        return new Pixel(avg, avg, avg);
    }
    invert() {
        return new Pixel(255 - this.r, 255 - this.g, 255 - this.b);
    }
    static white() {
        return new Pixel(255, 255, 255);
    }
    static black() {
        return new Pixel(0, 0, 0);
    }
    clone() {
        return new Pixel(this.r, this.g, this.b);
    }
}
