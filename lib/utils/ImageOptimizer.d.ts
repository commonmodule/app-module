export default class ImageOptimizer {
    private static readonly MAGIC_NUMBERS;
    private static readonly DEFAULT_OPTIONS;
    private static readFileAsBuffer;
    private static readFileAsDataURL;
    private static loadImage;
    private static isGifFormat;
    private static containsMultipleFrames;
    private static isAnimatedGif;
    private static calculateOptimalDimensions;
    private static optimizeImageUsingCanvas;
    static optimizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File>;
}
//# sourceMappingURL=ImageOptimizer.d.ts.map