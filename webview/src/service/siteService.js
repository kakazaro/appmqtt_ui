import axios from './axios';
import randomstring from 'randomstring';

class SiteService {
    constructor() {
        this.handler = {};
        this.start = {};
    }

    loopGetSiteData(type, id, handler, uid, duration = 5000) {
        (async () => {
            if (this.start[uid]) {
                try {
                    const response = await axios.get('/site/' + type + '?id=' + encodeURIComponent(id));
                    if (this.start[uid]) {
                        handler(response.data);
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            if (!this.start[uid]) {
                this.start[uid] = 0;
            } else {
                this.start[uid] = setTimeout(() => {
                    this.loopGetSiteData(type, id, handler, uid, duration);
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
        const uid = randomstring.generate();
        this.start[uid] = true;
        this.loopGetSiteData(type, id, handler, uid, duration);
        return uid;
    }

    unRegisterSiteData(uid) {
        clearTimeout(typeof this.start[uid] === 'number' ? this.start[uid] : 0);
        this.start[uid] = false;
    }
}

export default new SiteService();