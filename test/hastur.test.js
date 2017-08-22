const assert = require('assert');

const {renderServerComponent, renderStaticServerComponent} = require('../hastur');

describe('Render a component', function() {
    describe('Different renderers', function() {
        it('should be able to return a html representation of a reactcomponent', function() {
            let component = renderServerComponent(process.cwd() + '/test/ReactComponent', {});
            assert.ok(component.indexOf('data-reactid="1"') !== -1);
        });

        it('should be able to return a static html representation of a reactcomponent', function() {
            let component = renderStaticServerComponent(process.cwd() + '/test/ReactComponent', {});
            assert.ok(component.indexOf('data-reactid="1"') === -1);
        });

        it('should be able to return a html representation of a reactcomponent with props', function() {
            let component = renderServerComponent(process.cwd() + '/test/ReactComponent', {"title": "hejhej"});
            assert.ok(component.indexOf('hejhej') !== -1);
        });
    });
});
