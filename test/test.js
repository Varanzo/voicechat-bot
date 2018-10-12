//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app').app;
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Move', () => {

    /*
      * Test the /GET route
      */
    describe('/POST move', () => {
        it('it shouldn\'t move user', (done) => {
            chai.request(server)
                .post('/move')
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('string');
                    done();
                });
        });
    });

});