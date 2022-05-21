export default class Kernel {
    constructor(matrix, bias=1) {
        this.m = matrix;
        this.b = bias;
        for (let row = 0; row < 3; row++)
            for (let col = 0; col < 3; col++)
                this.m[row][col] *= this.b;

    }
    origin() {
        return { row: 1, col: 1 }
    }

    static Identity() {
        return new Kernel([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ]);
    }
    static Ridge() {
        return new Kernel([
            [-1, -1, -1],
            [-1,  4, -1],
            [-1, -1, -1],
        ]);
    }
    static Sharpen() {
        return new Kernel([
            [ 0, -1,  0],
            [-1,  5, -1],
            [ 0, -1,  0],
        ]);
    }
    static BoxBlur() {
        return new Kernel([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ], 1/9);
    }
    static GaussianBlur() {
        return new Kernel([
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1],
        ], 1/16);
    }
    static Emboss() {
        return new Kernel([
            [-2, -1, 0],
            [-1, 1, 1],
            [0, 1, 2],
        ]);
    }
}
