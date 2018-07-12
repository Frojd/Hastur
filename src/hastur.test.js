const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Hastur = require('./hastur');
const configuration = require('./config');
const server = new Hastur(configuration).getServer();

chai.use(chaiHttp);

describe('Test hastur server', function() {
    it('it should return 405 with GET request', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                expect(res.status).toEqual(405);
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
                expect(res.status).toEqual(400);
            done();
        });
    });

    it('it should return 200 empty POST props', (done) => {
        let body = {
            componentName: path.join(process.cwd(),'test', 'ReactComponent.js'),
        }

        chai.request(server)
            .post('/')
            .send(body)
            .end((err, res) => {
                expect(res.status).toEqual(200);
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
                expect(res.status).toEqual(500);
            done();
        });
    });

    it('it should return 200 and a component with correct POST body', (done) => {
        let body = {
            componentName: path.join(process.cwd(),'test', 'ReactComponent.js'),
            props: {
                title: 'Hello'
            }
        }

        chai.request(server)
            .post('/')
            .send(body)
            .end((err, res) => {
                expect(res.status).toEqual(200);
                expect(res.text).toEqual('<div class="ReactComponent" data-reactroot="">ReactComponent <!-- -->Hello</div>');
            done();
        });
    });

    it('it should return static component with static prop set in POST body', (done) => {
        let body = {
            componentName: path.join(process.cwd(),'test', 'ReactComponent.js'),
            props: {
                title: 'Hello'
            },
            static: true
        }

        chai.request(server)
            .post('/')
            .send(body)
            .end((err, res) => {
                expect(res.status).toEqual(200);
                expect(res.text).toEqual('<div class="ReactComponent">ReactComponent Hello</div>');
            done();
        });
    });
})