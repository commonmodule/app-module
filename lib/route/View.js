export default class View {
    closed = false;
    container;
    changeParams(params) { }
    close() {
        this.container?.delete();
        this.closed = true;
    }
}
//# sourceMappingURL=View.js.map