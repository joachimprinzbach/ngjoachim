import {Scope} from './scope';

describe('scope', function () {
    it('should be constructable as an object', function () {
        var scope = new Scope();
        scope.prop = 12;

        expect(scope.prop).toEqual(12);
    })
});