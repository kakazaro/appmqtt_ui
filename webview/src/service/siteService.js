import axios from './axios';

class SiteService {
    constructor() {
        this.handler = {};
        this.start = {};
    }

    loopGetSiteData(type, id, duration = 5000) {
        (async () => {
            if (!this.handler[type][id + '']) {
                return;
            }
            try {
                const response = await axios.get('/site/' + type + '?id=' + encodeURIComponent(id));
                this.pushEvent(id, response.data, type);
            } catch (err) {
                console.error(err);
            }
            if (!this.handler[type][id + ''] || !this.start[type][id + '']) {
                this.start[type][id + ''] = 0;
            } else {
                this.start[type][id + ''] = setTimeout(() => {
                    this.loopGetSiteData(type, id, duration);
                }, duration);
            }
        })();
    }

    pushEvent(id, data, type) {
        if (this.handler[type][id + '']) {
            this.handler[type][id + ''](data);
        }
    }

    registerSiteData(id, type, handler, duration) {
        if (!this.handler[type]) {
            this.handler[type] = {};
        }
        this.handler[type][id + ''] = handler;

        if (!this.start[type]) {
            this.start[type] = {};
        }
        if (!this.start[type][id + '']) {
            this.start[type][id + ''] = true;
            this.loopGetSiteData(type, id, duration);
        }
    }

    unRegisterSiteData(id, type) {
        this.handler[type][id + ''] = undefined;
        clearTimeout(typeof this.start[type][id + ''] === 'number' ? this.start[type][id + ''] : 0);
        this.start[type][id + ''] = 0;
    }
}

export default new SiteService();