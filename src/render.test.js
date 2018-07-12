const path = require('path');
const {
    getComponentElement,
    renderServerComponent,
    renderStaticServerComponent,
} = require('./render');

describe('Render a component', function() {
    it('should return a react element', () => {
        const componentPath = path.join(process.cwd(),'test', 'ReactComponent.js');
        const element = getComponentElement(componentPath, {});
        expect(element).toMatchSnapshot();
    })

    it('should be able to return a html representation of a reactcomponent', function() {
        const componentPath = path.join(process.cwd(),'test', 'ReactComponent.js');
        const component = renderServerComponent(componentPath, {});
        expect(component).toMatchSnapshot();
    });

    it('should be able to return a static html representation of a reactcomponent', function() {
        const componentPath = path.join(process.cwd(),'test', 'ReactComponent.js');
        const component = renderStaticServerComponent(componentPath, {});
        expect(component).toMatchSnapshot();
    });

    it('should be able to return a html representation of a reactcomponent with props', function() {
        const componentPath = path.join(process.cwd(),'test', 'ReactComponent.js');
        const props = {
            "title": "Hello World!"
        }
        const component = renderServerComponent(componentPath, props);
        expect(component).toMatchSnapshot();
    });
});