"use strict";

/*
 * Returns the next array of bytes representing a character bitmap and that character's offset
 * within the character rom.
 */
export class CharRomIter {

    constructor(charRom) {
        this.pos = 0;
        this.charRom = charRom;
    }
    next() {
        if (this.pos >= this.charRom._romImage.length / this.charRom.height) {
            return {done: true};
        }
        let value = {
            value: {value: this.charRom.charAt(this.pos), pos: this.pos*this.charRom.height},
            done: false
        };
        this.pos++;
        return value;
    }
}

/*
 * Object representing a Commodore CHAR ROM dump
 */
export class CharacterRom {

    constructor(romImage, height = 8) {
        this._romImage = romImage;
        this._height = height;      // number of bytes constituting a character
    }

    [Symbol.iterator]() {
        return new CharRomIter(this);
    }

    get height() {
        return this._height;
    }

    charAt(pos) {
        return this._romImage.slice(pos * this._height, pos * this._height + this._height);
    }

    static toGlyph(char, glyph = "#") {
        for (let byte of char) {
            let mask = 0b10000000;
            let lineOut = "";
            for (let shift = 0; shift<8; shift++) {
                if ((byte & mask) > 0) {
                    lineOut += glyph;
                }
                else {
                    lineOut += " ";
                }
                mask = mask >> 1;
            }
            console.log(lineOut);
        }
    }

    static toBanner(charrom, posarray, glyph = "#") {
        let chars = [];
        for (let pos of posarray) {
            chars.push(charrom.charAt(pos))
        }
        for (let line=0; line<charrom.height; line++){
            let lineOut = "";
            for (let char of chars) {

                let byte = char[line];
                let mask = 0b10000000;
                for (let shift = 0; shift<8; shift++) {
                    if ((byte & mask) > 0) {
                        lineOut += glyph;
                    }
                    else {
                        lineOut += " ";
                    }
                    mask = mask >> 1;
                }
            }
            console.log(lineOut);
        }
    }

}

export function asciiToChar(c) {

    if (c>=64) {
        return ((c-64));
    } else {
        return (c);
    }
}

export function strToChar(str) {
    let charpos = [];
    for (let c of str) {
        charpos.push(asciiToChar(c.charCodeAt(0)))
    }

    return charpos;
}