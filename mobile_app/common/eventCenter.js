class EventCenter {
    constructor() {
        this.events = {};
        this.eventNames = {
            updateSitePrice: 'updateSitePrice',
            updateSiteName: 'updateSiteName',
            updateUserRole: 'updateUserRole',

            updateDeleteUserSite: 'updateDeleteUserSite',
            updateAddUserSite: 'updateAddUserSite',
        };
    }

    register(eventName, handler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(handler);
    }

    unRegister(eventName, handler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName] = this.events[eventName].filter(h => h !== handler);
    }

    push(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(h => h(eventName, data));
        }
    }
}

export default new EventCenter();
