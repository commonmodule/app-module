export default class ImageOptimizer {
    static MAGIC_NUMBERS = {
        GIF: [0x47, 0x49, 0x46],
        GRAPHIC_CONTROL_EXTENSION: [0x21, 0xF9, 0x04],
    };
    static DEFAULT_OPTIONS = {
        contentType: "image/jpeg",
        extension: "jpg",
        quality: 0.8,
    };
    static readFileAsBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result));
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsArrayBuffer(file);
        });
    }
    static readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
    }
    static loadImage(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = dataUrl;
        });
    }
    static isGifFormat(buffer) {
        return this.MAGIC_NUMBERS.GIF.every((byte, index) => buffer[index] === byte);
    }
    static containsMultipleFrames(buffer) {
        let frameCount = 0;
        for (let i = 0; i < buffer.length - this.MAGIC_NUMBERS.GRAPHIC_CONTROL_EXTENSION.length; i++) {
            const isFrameMarker = this.MAGIC_NUMBERS.GRAPHIC_CONTROL_EXTENSION.every((byte, offset) => buffer[i + offset] === byte);
            if (isFrameMarker) {
                frameCount++;
                if (frameCount > 1)
                    return true;
            }
        }
        return false;
    }
    static async isAnimatedGif(file) {
        try {
            const buffer = await this.readFileAsBuffer(file);
            if (!this.isGifFormat(buffer)) {
                throw new Error("Invalid GIF format");
            }
            return this.containsMultipleFrames(buffer);
        }
        catch (error) {
            throw new Error(`Failed to analyze GIF: ${error.message}`);
        }
    }
    static calculateOptimalDimensions(originalDimensions, targetDimensions) {
        const { width: origWidth, height: origHeight } = originalDimensions;
        const { width: targetWidth, height: targetHeight } = targetDimensions;
        if (origWidth <= targetWidth && origHeight <= targetHeight) {
            return { width: origWidth, height: origHeight };
        }
        const scaleFactor = Math.min(targetWidth / origWidth, targetHeight / origHeight);
        return {
            width: Math.round(origWidth * scaleFactor),
            height: Math.round(origHeight * scaleFactor),
        };
    }
    static async optimizeImageUsingCanvas(image, dimensions) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Failed to get canvas context");
        }
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob)
                    resolve(blob);
                else
                    reject(new Error("Canvas to Blob conversion failed"));
            }, this.DEFAULT_OPTIONS.contentType, this.DEFAULT_OPTIONS.quality);
        });
    }
    static async optimizeImage(file, maxWidth, maxHeight) {
        if (!file.type.startsWith("image/")) {
            throw new Error("The provided file is not an image.");
        }
        if (file.type === "image/gif") {
            const isAnimated = await this.isAnimatedGif(file);
            if (isAnimated) {
                throw new Error("Animated GIFs are not compressed.");
            }
        }
        const dataUrl = await this.readFileAsDataURL(file);
        const image = await this.loadImage(dataUrl);
        const optimalDimensions = this.calculateOptimalDimensions({ width: image.width, height: image.height }, { width: maxWidth, height: maxHeight });
        const optimizedBlob = await this.optimizeImageUsingCanvas(image, optimalDimensions);
        if (optimizedBlob.size >= file.size) {
            return file;
        }
        const newFileName = file.name.replace(/\.[^.]+$/, `.${this.DEFAULT_OPTIONS.extension}`);
        return new File([optimizedBlob], newFileName, {
            type: this.DEFAULT_OPTIONS.contentType,
        });
    }
}
//# sourceMappingURL=ImageOptimizer.js.map