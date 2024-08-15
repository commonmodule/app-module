export default class View {
    closed = false;
    container;
    changeParams(params) { }
    close() {
        this.container?.remove();
        this.closed = true;
    }
}
//# sourceMappingURL=View.js.map