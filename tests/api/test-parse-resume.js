const supertest = require('supertest')
const app = require('../../app')

exports.response_parse_resume_should_be_json_and_ok = (done) => {
    supertest(app)
    .post('/parse/resume')
    .field('data','/Users/ahmad/php_native/resume_test_copy.docx')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(done())
};
