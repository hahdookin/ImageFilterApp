function isByteWhiteSpace(byte) {
    return ['\n', ' ', '\t'].map(c => c.charCodeAt(0)).includes(byte);
}

/**
 * Holds an array of data and keeps track
 * of the current position for reading.
 */
export default class DataScanner {
    constructor(data) {
        this.data = data;
        this.pos = 0;
    }

    // Returns the byte at the current cursor position
    atCursor() {
        return this.data[this.pos];
    }

    // Returns a subarray from the current cursor position
    // to the end
    toEnd() {
        return this.data.subarray(this.pos);
    }

    // Reads bytes until a whitespace byte is found and returns
    // the bytes read, excluding the whitespace
    readUntilWhiteSpace() {
        // Skip whitespace before
        while (isByteWhiteSpace(this.atCursor())) {
            this.pos++;
        }

        // Store the current position and read until whitespace
        const start = this.pos;
        while (!isByteWhiteSpace(this.atCursor())) {
            this.pos++;
        }
        return this.data.subarray(start, this.pos);
    }
}
