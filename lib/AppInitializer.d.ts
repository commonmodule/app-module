type InitializerFunction = (config: any) => void;
declare class AppInitializer {
    private initializers;
    addInitializer(initializer: InitializerFunction): void;
    initialize<T>(config: T): void;
}
declare const _default: AppInitializer;
export default _default;
//# sourceMappingURL=AppInitializer.d.ts.map