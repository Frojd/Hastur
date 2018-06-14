const assert = require('assert');
const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {renderServerComponent, renderStaticServerComponent, server } = require('../hastur');

chai.use(chaiHttp)

describe('Test hastur server', function() {
    it('it should return 405 with GET request', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(405);
            done();
        });
    });

    it('it should return 400 empty POST body', (done) => {
        let body = {
        }

        chai.request(server)
            .post('/')
            //.send(body)
            .end((err, res) => {
                res.should.have.status(400);
            done();
        });
    });

    it('it should return 200 empty POST props', (done) => {
        let body = {
            componentName: `${process.cwd()}/test/ReactComponent.js`,
        }

        chai.request(server)
            .post('/')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
            done();
        });
    });

    it('it should return 500 when no component found', (done) => {
        let body = {
            componentName: `nocomp`,
            props: {}
        }

        chai.request(server)
            .post('/')
            .send(body)
            .end((err, res) => {
                res.should.have.status(500);
            done();
        });
    });

    it('it should return 200 and a component with correct POST body', (done) => {
        let body = {
            componentName: `${process.cwd()}/test/ReactComponent.js`,
            props: {
                title: 'Hello'
            }
        }

        chai.request(server)
            .post('/')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.eql('<div class="ReactComponent" data-reactroot="">ReactComponent <!-- -->Hello</div>')
            done();
        });
    });

    it('it should return static component with static prop set in POST body', (done) => {
        let body = {
            componentName: `${process.cwd()}/test/ReactComponent.js`,
            props: {
                title: 'Hello'
            },
            static: true
        }

        chai.request(server)
            .post('/')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.eql('<div class="ReactComponent">ReactComponent Hello</div>')
            done();
        });
    });
})

describe('Render a component', function() {
    it('should be able to return a html representation of a reactcomponent', function() {
        let component = renderServerComponent(`${process.cwd()}/test/ReactComponent`, {});
        assert.ok(component.indexOf('data-reactroot=""') !== -1);
    });

    it('should be able to return a static html representation of a reactcomponent', function() {
        let component = renderStaticServerComponent(`${process.cwd()}/test/ReactComponent`, {});
        assert.ok(component.indexOf('data-reactroot=""') === -1);
    });

    it('should be able to return a html representation of a reactcomponent with props', function() {
        let component = renderServerComponent(`${process.cwd()}/test/ReactComponent`, {"title": "hejhej"});
        assert.ok(component.indexOf('hejhej') !== -1);
    });
});
