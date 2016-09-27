'use strict';

describe('scope', () => {

    it('can be constructed and used as an object', () => {
        var scope = new Scope();
        scope.someProp = 11;

        ecpect(scope.someProp).toEqual(11);
    });
});