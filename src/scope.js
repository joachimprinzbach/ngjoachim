export class Scope {

    constructor() {
        this.$$watchers = [];
    }

    $watch(watchFunc, listenerFunc) {
        var defaultListener = () => {};
        let watcher = {
            watchFunc: watchFunc,
            listenerFunc: listenerFunc || defaultListener,
            lastValue: this.initialWatchValue
        };
        this.$$watchers.push(watcher);
    }

    $digest() {
        let isDirty;
        do {
            isDirty = this.$$digestOnce();
        }  while(isDirty);
    }

    $$digestOnce() {
        let oldValue;
        let newValue;
        let isDirty = false;
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
                isDirty = true;
            }
        });
        return isDirty;
    }

    initialWatchValue() {
    }
}