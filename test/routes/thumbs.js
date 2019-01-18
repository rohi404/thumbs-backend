const createApp = require('../../dist/create-app');
const request = require('supertest');
const should = require('should');

const app = createApp.createAppToTest();

describe('Get Thumb', function () {
    it('# default', function (done) {
        request(app)
            .get('/thumbs/1')
            .expect(200)
            .expect((res) => {
                res.body.should.have.properties('thumbId', 'name', 'condition');
                res.body['condition'].should.have.properties('affection', 'health', 'hygiene', 'satiety');
                res.body['condition']['affection'].should.have.properties('label', 'value');
                res.body['condition']['health'].should.have.properties('label', 'value');
                res.body['condition']['hygiene'].should.have.properties('label', 'value');
                res.body['condition']['satiety'].should.have.properties('label', 'value');
            })
            .end((err, res) => {
                if (err) done(err);
                else done();
            });
    });

    it('# Not Found', function (done) {
        request(app)
            .get('/thumbs/12345678987654321')
            .expect(404)
            .expect((res) => {
                res.body.should.have.properties('message', 'status', 'stack');
            })
            .end((err, res) => {
                if (err) done(err);
                else done();
            });
    });
});