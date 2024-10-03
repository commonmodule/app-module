class AppInitializer {
    initializers = [];
    addInitializer(initializer) {
        this.initializers.push(initializer);
    }
    initialize(config) {
        for (const initializer of this.initializers) {
            initializer(config);
        }
    }
}
export default new AppInitializer();
//# sourceMappingURL=AppInitializer.js.map