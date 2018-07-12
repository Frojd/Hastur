const {
    getComponentElement,
    renderServerComponent,
    renderStaticServerComponent,
} = require('./render');

describe('Render a component', function() {
    it('should return a react element', () => {
        const element = getComponentElement(`${process.cwd()}/test/ReactComponent`, {});
        expect(element).toMatchSnapshot();
    })

    it('should be able to return a html representation of a reactcomponent', function() {
        const component = renderServerComponent(`${process.cwd()}/test/ReactComponent`, {});
        expect(component).toMatchSnapshot();
    });

    it('should be able to return a static html representation of a reactcomponent', function() {
        const component = renderStaticServerComponent(`${process.cwd()}/test/ReactComponent`, {});
        expect(component).toMatchSnapshot();
    });

    it('should be able to return a html representation of a reactcomponent with props', function() {
        const props = {
            "title": "Hello World!"
        }
        const component = renderServerComponent(`${process.cwd()}/test/ReactComponent`, props);
        expect(component).toMatchSnapshot();
    });
});