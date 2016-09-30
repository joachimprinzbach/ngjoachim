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

        it('should also call the listenerFunc when watch value is undefined', () => {
            scope.val = undefined;
            scope.counter = 0;
            let watchFunc = (scope) => scope.val;
            let listenerFunc = (newValue, oldValue, scope) => scope.counter++;
            scope.$watch(watchFunc, listenerFunc);

            scope.$digest();
            expect(scope.counter).toBe(1);
        });

        it('should use the newValue as oldValue when calling the listener for the first time', () => {
            scope.val = "Home sweet home";
            let oldValueStart = undefined;

            let watchFunc = (scope) => scope.val;
            let listenerFunc = (newValue, oldValue) => {
                oldValueStart = oldValue;
            };
            scope.$watch(watchFunc, listenerFunc);

            scope.$digest();
            expect(oldValueStart).toBe("Home sweet home");
        });

        it('should allow to leave the listenerFunc out', () => {
            let watchFunc = jasmine.createSpy().and.returnValue("Alabama");
            scope.$watch(watchFunc);

            scope.$digest();

            expect(watchFunc).toHaveBeenCalled();
        });

        it('should run as a loop and support watchers changing watched properties', () => {
            scope.value = 'NaNaNaNaNaNa Batman!';
            let watchFunc = (scope) => scope.valueInUpperCase;
            let listenerFunc = (newValue) => {
                if (newValue)
                    scope.firstLetter = newValue.substring(0, 1);
            };
            scope.$watch(watchFunc, listenerFunc);

            let secondWatchFunc = (scope) => scope.value;
            let secondListenerFunc = (newValue) => {
                if (newValue) {
                    scope.valueInUpperCase = newValue.toUpperCase();
                }
            };
            scope.$watch(secondWatchFunc, secondListenerFunc);

            scope.$digest();
            expect(scope.firstLetter).toBe('N');

            scope.value = 'Trude';
            scope.$digest();
            expect(scope.firstLetter).toBe('T');
        });

        it('should throw an error if two watchers depend on each others results', () => {
            scope.valueA = 0;
            scope.valueB = 0;
            let watchFunc = (scope) => scope.valueA;
            let listenerFunc = () => scope.valueB++;
            scope.$watch(watchFunc, listenerFunc);

            let secondWatchFunc = (scope) => scope.valueB;
            let secondListenerFunc = () => scope.valueB++;
            scope.$watch(secondWatchFunc, secondListenerFunc);

            let digestExecution = () => scope.$digest();
            expect(digestExecution).toThrow();
        });

        it('should stop digesting when all watchers have been checked in a row and are not dirty', () => {
            scope.values = [];
            for (let i = 0; i < 100; i++) {
                scope.values.push(i);
            }
            let digestCycleCount = 0;

            for (let i = 0; i < 100; i++) {
                let watchFunc = (scope) => {
                    digestCycleCount++;
                    return scope.values[i];
                };
                scope.$watch(watchFunc, () => {
                });
            }

            scope.$digest();
            expect(digestCycleCount).toBe(200);

            scope.values[0] = 666;
            scope.$digest();
            expect(digestCycleCount).toBe(301);
        });

        it('should continue digesting when new watches are being created during digest call', () => {
            scope.value = 'Harry';
            scope.counter = 0;

            let watchFunc = (scope) => scope.value;
            let listenerFunc = (newValue, oldValue, scope) => {
                scope.$watch(
                    (scope) => scope.value,
                    (newValue, oldValue, scope) => scope.counter++
                )
            };
            scope.$watch(watchFunc, listenerFunc);

            scope.$digest();
            expect(scope.counter).toBe(1);
        });

        it('should be able to do value comparison', () => {
            let enableValueComparison = true;
            scope.value = [1, 2, 3, 4];
            scope.counter = 0;
            let watchFunc = (scope) => scope.value;
            let listenerFunc = (newValue, oldValue, scope) => scope.counter++;
            scope.$watch(watchFunc, listenerFunc, enableValueComparison);

            scope.$digest();
            expect(scope.counter).toBe(1);

            scope.value.push(5);
            scope.$digest();
            expect(scope.counter).toBe(2);
        });

        it('should handle NaN values', () => {
            scope.value = 0 / 0;
            scope.counter = 0;
            let watchFunc = (scope) => scope.value;
            let listenerFunc = (newValue, oldValue, scope) => scope.counter++;
            scope.$watch(watchFunc, listenerFunc);

            scope.$digest();
            expect(scope.counter).toBe(1);

            scope.$digest();
            expect(scope.counter).toBe(1);
        });

        it('should be able to execute a function via $eval', () => {
            scope.value = "Fred";

            let func = (scope) => scope.value;
            var evalResult = scope.$eval(func);

            expect(evalResult).toBe("Fred");
        });

        it('should be able to pass a second argument to $eval', () => {
            scope.value = 47;

            let func = (scope, val) => scope.value + val;
            var evalResult = scope.$eval(func, 3);

            expect(evalResult).toBe(50);
        })
    });
});