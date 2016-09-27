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
    });
});