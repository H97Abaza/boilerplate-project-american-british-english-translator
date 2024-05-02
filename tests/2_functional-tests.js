const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    suite("POST request to / api / translate", () => {
        let text = "Mangoes are my favorite fruit."
        let locale = "american-to-british"
        // Translation with text and locale fields: POST request to / api / translate
        test("Translation with text and locale fields: POST request to / api / translate", (done) => {
            chai.request(server).post('/api/translate').send({ text, locale }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, "text");
                assert.propertyVal(res.body, "text", text);
                assert.property(res.body, "translation");
                assert.propertyVal(res.body, "translation", 'Mangoes are my <span class="highlight">favourite</span> fruit.');
                done();
            })
        })
        // Translation with text and invalid locale field: POST request to / api / translate
        test("Translation with text and invalid locale field: POST request to / api / translate", (done) => {
            chai.request(server).post('/api/translate').send({ text, locale: "invalid local" }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, "error");
                assert.propertyVal(res.body, "error", "Invalid value for locale field");
                done();
            })
        })
        // Translation with missing text field: POST request to / api / translate
        test("Translation with missing text field: POST request to / api / translate", (done) => {
            chai.request(server).post('/api/translate').send({ locale }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, "error");
                assert.propertyVal(res.body, "error", "Required field(s) missing");
                done();
            })
        })
        // Translation with missing locale field: POST request to / api / translate
        test("Translation with missing locale field: POST request to / api / translate", (done) => {
            chai.request(server).post('/api/translate').send({ text }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, "error");
                assert.propertyVal(res.body, "error", "Required field(s) missing");
                assert.equal(res.status, 200);
                done();
            })
        })
        // Translation with empty text: POST request to / api / translate
        test("Translation with empty text: POST request to / api / translate", (done) => {
            chai.request(server).post('/api/translate').send({ text: "", locale }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, "error");
                assert.propertyVal(res.body, "error", "No text to translate");
                done();
            })
        })
        // Translation with text that needs no translation: POST request to / api / translate
        test("Translation with text that needs no translation: POST request to / api / translate", (done) => {
            chai.request(server).post('/api/translate').send({ text: "No translation needed", locale }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, "text");
                assert.propertyVal(res.body, "text", "No translation needed");
                assert.property(res.body, "translation");
                assert.propertyVal(res.body, "translation", "Everything looks good to me!");
                done();
            })
        })
    })

});
