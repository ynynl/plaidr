import nj from 'numjs';
import { createCanvas } from 'canvas';

class Plaid {
    constructor(colors, pivots, size, twill) {
        if (size % 4 !== 0) {
            throw new Error('Tartan size must be multiples of four.');
        }
        if (colors.length !== pivots.length + 1) {
            throw new Error('num of colors must be one more than the num of pivots (background).');
        }
        this.colors = nj.array(colors);
        this.pivots = nj.array(pivots);
        this.size = size;
        this.twill = twill;
        this.array = this.__generate();
    }

    __patterns = {
        'tartan': nj.array([
            [1, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [1, 1, 0, 0]
        ]).astype('bool'),

        'madras': nj.array([
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 1, 1],
            [0, 0, 1, 1]
        ]).astype('bool'),

        'net': nj.array([
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [1, 0, 1, 0],
            [0, 1, 0, 1]
        ]).astype('bool'),
    }

    get_png(width = null, height = null) {
        if (!width) {
            width = this.size;
        }
        if (!height) {
            height = this.size;
        }
        const resized = this.__resize(width, height);
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);
        imageData.data.set(resized.flatten().tolist());
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }

    show(width = null, height = null) {
        if (!width) {
            width = this.size;
        }
        if (!height) {
            height= this.size;
        }
        const resized = this.__resize(width, height);
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);
        imageData.data.set(resized.flatten().tolist());
        ctx.putImageData(imageData, 0, 0);
        const img = new Image();
        img.src = canvas.toDataURL();
        document.body.appendChild(img);
    }

    __resize(width, height) {
        const col = Math.ceil(width / this.size);
        const row = Math.ceil(height / this.size);
        let resized = nj.tile(this.array, [col, row, 1]);
        resized = nj.delete(resized, nj.s_[height:], 0);
        resized = nj.delete(resized, nj.s_[width:], 1);
        return resized;
    }

    __generate() {
        const num_of_band = this.colors.shape[0];
        const sett = nj.zeros([1, this.size, 3], 'int32');
        sett.set(this.colors.get(-1, nj.arange(3)), nj.s_[0, nj.NIL, nj.NIL]); // use the last color as the background
        for (let i = 0; i < num_of_band - 1; i++) { // add bands
            const threads = nj.round((sett.shape[1] - 1) * this.pivots.get(i)).astype('int32');  // Transfer the float arrary into two int numbers
            sett.set(this.colors.get(i, nj.arange(3)), nj.s_[0, nj.arange(threads.get(0), threads.get(1)), nj.NIL]);
        }
        let wrap = nj.tile(sett, [this.size, 1, 1]); // expand sett pattern to NxN shape
        const selected_pattern = this.__patterns[this.twill];
        const num_tile = Math.floor(this.size / selected_pattern.shape[0]);
        let mask = nj.tile(selected_pattern, [num_tile, num_tile]);
        wrap[mask] = nj.rot90(wrap)[mask]; // apply twill
        return wrap;
    }
}
