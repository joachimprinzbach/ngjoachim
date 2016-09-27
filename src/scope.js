export class Scope {

    constructor() {
        this.$$watchers = [];
    }

    $watch(watchFunc, listenerFunc) {
        let watcher = {
            watchFunc: watchFunc,
            listenerFunc: listenerFunc,
            lastValue: this.initialWatchValue
        };
        this.$$watchers.push(watcher);
    }

    $digest() {
        let oldValue;
        let newValue;
        this.$$watchers.forEach(watcher => {
            newValue = watcher.watchFunc(this);
            oldValue = watcher.lastValue;
            if (newValue !== oldValue) {
                watcher.lastValue = newValue;
                if (oldValue == this.initialWatchValue) {
                    watcher.listenerFunc(newValue, newValue, this);
                } else {
                    watcher.listenerFunc(newValue, oldValue, this);
                }
            }
        });
    }

    initialWatchValue() {
    }
}