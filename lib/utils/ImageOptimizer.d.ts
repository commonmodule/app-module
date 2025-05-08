declare class ImageOptimizer {
    private readonly MAGIC_NUMBERS;
    private readonly DEFAULT_OPTIONS;
    private readFileAsBuffer;
    private readFileAsDataURL;
    private loadImage;
    private isGifFormat;
    private containsMultipleFrames;
    private isAnimatedGif;
    private calculateOptimalDimensions;
    private optimizeImageUsingCanvas;
    optimizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File>;
}
declare const _default: ImageOptimizer;
export default _default;
//# sourceMappingURL=ImageOptimizer.d.ts.map