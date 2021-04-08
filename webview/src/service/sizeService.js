class SizeService {
    constructor() {
        this.handler = {};
        this.width = 200;
    }

    sizeChange(width) {
        this.width = width;
        Object.keys(this.handler).forEach(key => this.handler[key](width));
    }

    register(id, handler) {
        this.handler[id] = handler;
        handler(this.width);
    }

    unregister(id) {
        delete this.handler[id];
    }
}

export default new SizeService();
