import {Scope} from './scope';

describe('scope', () => {
    it('should be constructable as an object', () => {
        let scope = new Scope();
        scope.prop = 12;

        expect(scope.prop).toEqual(12);
    });

    describe('digest', () => {
        let scope;

        beforeEach(() => {
            scope = new Scope();
        });

        it('should call the listener function of watch', () => {
            let watchFunc = () => 'watch';
            let listenerFunc = jasmine.createSpy();
            scope.$watch(watchFunc, listenerFunc);

            scope.$digest();

            expect(listenerFunc).toHaveBeenCalled();
        });

        it('should call watch with the scope', () => {
            let watchFunc = jasmine.createSpy();
            let listenerFunc = () => {
            };
            scope.$watch(watchFunc, listenerFunc);

            scope.$digest();

            expect(watchFunc).toHaveBeenCalledWith(scope);
        });

        it('should call the listenerFunc once a watched value changes', () => {
            scope.val = 'val';
            scope.counter = 0;

            let watchFunc = (scope) => scope.val;
            let listenerFunc = (newValue, oldValue, scope) => scope.counter++;
            scope.$watch(watchFunc, listenerFunc);

            expect(scope.counter).toBe(0);

            scope.$digest();
            expect(scope.counter).toBe(1);

            scope.val = 'new val';
            expect(scope.counter).toBe(1);

            scope.$digest();
            expect(scope.counter).toBe(2);

        });
    });
});