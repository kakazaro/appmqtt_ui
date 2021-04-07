import axios from './axios';

class SiteService {
    constructor() {
        this.handler = {};
        this.start = false;
    }

    loop() {
        this.start = true;
        (async () => {
            const ids = Object.keys(this.handler);
            for (let i = 0; i < ids.length; i++) {
                if (!this.handler[ids[i]]) {
                    return;
                }

                try {
                    const response = await axios.get('/site?id=' + encodeURIComponent(ids[i]));
                    this.pushEvent(ids[i], response.data);
                } catch (err) {
                    console.error(err);
                }
            }
            setTimeout(() => {
                this.loop();
            }, 5000);
        })();
    }

    pushEvent(dataId, data) {
        Object.keys(this.handler).forEach(id => {
            if ((id + '') === (dataId + '')) {
                this.handler[id](data);
            }
        });
    }

    registerId(id, handler) {
        this.handler[id + ''] = handler;

        if (!this.start) {
            this.loop();
        }
    }

    unRegister(id) {
        delete this.handler[id + ''];
    }
}

export default new SiteService();