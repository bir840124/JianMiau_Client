export class NotificationSingleton {

    private eventList = {};
    //static Instance: NotificationSingleton = null;
    private Instance: NotificationSingleton = null;

    on(type, callback, target) {
        if (typeof type !== "string" || typeof callback !== "function" || typeof target === "undefined") {
            console.error("GLOBAL_DEF.js: Notify method 'on' param error!");
            return;
        }
        if (typeof this.eventList[type] === "undefined") {
            this.eventList[type] = [];
        }
        this.eventList[type].push({ callback: callback, target: target });
    }


    once(type, callback, target) {
        if (typeof type !== "string" || typeof callback !== "function" || typeof target === "undefined") {
            console.error("GLOBAL_DEF.js: Notify method 'on' param error!");
            return;
        }
        if (typeof this.eventList[type] === "undefined") {
            this.eventList[type] = [];
        }
        this.eventList[type].push({ callback: callback, target: target, once: true });
    }

    emit(type, ...data) {
        if (typeof type !== "string") {
            console.error("GLOBAL_DEF.js: Notify method 'emit' param error!");
            return;
        }
        var list = this.eventList[type];
        if (typeof list !== "undefined") {
            for (var i = 0; i < list.length; i++) {
                var event = list[i];
                if (event) {
                    event.callback.call(event.target, ...data);
                    if (event.once) {
                        Notify.Instance.off(type, event.callback, event.target);
                    }
                }
            }
        }
    }

    off(type, callback, target) {
        if (typeof type !== "string" || typeof callback !== "function" || typeof target === "undefined") {
            console.error("GLOBAL_DEF.js: Notify method 'off' param error!");
            return;
        }
        var list = this.eventList[type];
        if (typeof list !== "undefined") {
            for (var i = 0; i < list.length; i++) {
                var event = list[i];
                if (event && event.callback === callback && event.target === target) {
                    list.splice(i, 1);
                    break;
                }
            }
        }
    }

    offByType(type) {
        if (typeof type !== "string") {
            console.error("GLOBAL_DEF.js: Notify method 'offByType' param error!");
            return;
        }
        while (this.eventList[type].length > 1) {
            this.eventList[type].shift();
        }
        this.eventList[type] = undefined;
    }

    offByTarget(target) {
        if (typeof target === "undefined") {
            console.error("GLOBAL_DEF.js: Notify method 'offByTarget' param error!");
            return;
        }
        for (var key in this.eventList) {
            if (this.eventList[key]) {
                for (var i = 0; i < this.eventList[key].length; i++) {
                    if (this.eventList[key][i].target === target) {
                        this.eventList[key].splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    getByType(type) {
        if (typeof type !== "string") {
            console.error("GLOBAL_DEF.js: Notify method 'offByType' param error!");
            return;
        }

        return this.eventList[type];
    }

    public GetInstane() {
        if (Notify.Instance == null) {
            Notify.Instance = new NotificationSingleton();
            // console.log('Notify.Instance have new one.');
        }
        return Notify.Instance;
    }

    //return {on: on, once: once, emit: emit, off: off, offByType: offByType, offByTarget: offByTarget};

}

export const Notify = new NotificationSingleton();
