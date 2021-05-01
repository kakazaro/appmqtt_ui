import axios from './axios';
import randomstring from 'randomstring';

class SiteService {
    constructor() {
        this.handler = {};
        this.start = {};
    }

    loopGetSiteData(type, id, handler, query, uid, duration = 5000) {
        (async () => {
            if (this.start[uid]) {
                try {
                    let url = '/site/' + type + '?id=' + encodeURIComponent(id);
                    if (query) {
                        Object.keys(query).forEach(key => {
                            url += `&${key}=${encodeURIComponent(query[key])}`;
                        });
                    }
                    const response = await axios.get(url);
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
                    this.loopGetSiteData(type, id, handler, query, uid, duration);
                }, duration);
            }
        })();
    }

    registerSiteData(id, type, handler, query, duration) {
        const uid = randomstring.generate();
        this.start[uid] = true;
        this.loopGetSiteData(type, id, handler, query, uid, duration);
        return uid;
    }

    unRegisterSiteData(uid) {
        clearTimeout(typeof this.start[uid] === 'number' ? this.start[uid] : 0);
        this.start[uid] = false;
    }
}

export default new SiteService();