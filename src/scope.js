import 'lodash';

export class Scope {

    constructor() {
        this.$$watchers = [];
        this.$$lastDetectedDirtyWatcher = null;
        this.$$asyncQueue = [];
    }

    $watch(watchFunc, listenerFunc, compareValues) {
        var defaultListener = () => {
        };
        let watcher = {
            watchFunc: watchFunc,
            listenerFunc: listenerFunc || defaultListener,
            compareValues: !!compareValues,
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
            while(this.$$asyncQueue.length) {
                let asyncTask = this.$$asyncQueue.shift();
                asyncTask.scope.$eval(asyncTask.expression);
            }
            isDirty = this.$$digestOnce();
            timeToLive--;
            if (isDirty && timeToLive <= 0) {
                throw "Too many digest iterations! Please check your watchers."
            }
        } while (isDirty);
    }

    $eval(funcExpr, params) {
        return funcExpr(this, params);
    }

    $evalAsync(funcExpr) {
        this.$$asyncQueue.push({
            scope: this,
            expression: funcExpr
        })
    }

    $apply(expression) {
        try {
            return this.$eval(expression);
        } finally {
            this.$digest();
        }
    }

    $$digestOnce() {
        let oldValue;
        let newValue;
        let isDirty = false;
        this.$$watchers.some(watcher => {
            newValue = watcher.watchFunc(this);
            oldValue = watcher.lastValue;
            if (!this.$$areEqual(newValue, oldValue, watcher.compareValues)) {
                this.$$lastDetectedDirtyWatcher = watcher;
                if (watcher.compareValues) {
                    watcher.lastValue = _.cloneDeep(newValue);
                } else {
                    watcher.lastValue = newValue;
                }
                if (oldValue == this.initialWatchValue) {
                    watcher.listenerFunc(newValue, newValue, this);
                } else {
                    watcher.listenerFunc(newValue, oldValue, this);
                }
                isDirty = true;
            } else if (this.$$lastDetectedDirtyWatcher === watcher) {
                return true;
            }
        });
        return isDirty;
    }

    $$areEqual(newValue, oldValue, compareValues) {
        if (compareValues) {
            return _.isEqual(newValue, oldValue);
        } else {
            return newValue === oldValue || this.bothAreNaN(newValue, oldValue);
        }
    }

    bothAreNaN(value1, value2) {
        return typeof value1 === 'number' && typeof  value2 === 'number'
            && isNaN(value1) && isNaN(value2);
    }

    initialWatchValue() {
    }
}