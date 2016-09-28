export class Scope {

    constructor() {
        this.$$watchers = [];
        this.$$lastDetectedDirtyWatcher = null;
    }

    $watch(watchFunc, listenerFunc) {
        var defaultListener = () => {};
        let watcher = {
            watchFunc: watchFunc,
            listenerFunc: listenerFunc || defaultListener,
            lastValue: this.initialWatchValue
        };
        this.$$watchers.push(watcher);
        this.$$lastDetectedDirtyWatcher = null;
    }

    $digest() {
        let timeToLive = 10;
        let isDirty;
        this.$$lastDetectedDirtyWatcher = null;
        do {
            isDirty = this.$$digestOnce();
            timeToLive--;
            if(isDirty && timeToLive <= 0) {
                throw "Too many digest iterations! Please check your watchers."
            }
        }  while(isDirty);
    }

    $$digestOnce() {
        let oldValue;
        let newValue;
        let isDirty = false;
        this.$$watchers.some(watcher => {
            newValue = watcher.watchFunc(this);
            oldValue = watcher.lastValue;
            if (newValue !== oldValue) {
                this.$$lastDetectedDirtyWatcher = watcher;
                watcher.lastValue = newValue;
                if (oldValue == this.initialWatchValue) {
                    watcher.listenerFunc(newValue, newValue, this);
                } else {
                    watcher.listenerFunc(newValue, oldValue, this);
                }
                isDirty = true;
            } else if(this.$$lastDetectedDirtyWatcher === watcher) {
                return true;
            }
        });
        return isDirty;
    }

    initialWatchValue() {
    }
}