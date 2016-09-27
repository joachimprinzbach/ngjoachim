export class Scope {

    constructor() {
        this.$$watchers = [];
    }

    $watch(watchFunc, listenerFunc) {
        let watcher = {
            watchFunc: watchFunc,
            listenerFunc: listenerFunc
        };
        this.$$watchers.push(watcher);
    }

    $digest() {
        let oldValue;
        let newValue;
        this.$$watchers.forEach(watcher => {
            newValue = watcher.watchFunc(this);
            oldValue = watcher.lastValue;
            if(newValue !== oldValue) {
                watcher.lastValue = newValue;
                watcher.listenerFunc(newValue, oldValue, this);
            }
        });
    }
}