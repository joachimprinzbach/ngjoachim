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
        this.$$watchers.forEach(watcher => watcher.listenerFunc());
    }
}