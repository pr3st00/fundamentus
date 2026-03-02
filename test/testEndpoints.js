import app from "../app.js";
import * as chai from "chai";
import { default as chaiHttp, request } from "chai-http";

chai.use(chaiHttp);

const { expect } = chai;

let miscTests = describe("Miscelaneous testing", () => {

    it("Should return alive status", (done) => {
        request.execute(app)
            .get("/health")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response.body).to.have.property("status").which.equal('alive');
                done();
            })
    });
});

let fiiTests = describe("Fii endpoint testing", () => {

    it("Should return sucessfull status", (done) => {
        request.execute(app)
            .get("/fii/hglg11")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                done();
            })
    });

    it("Should return 404 status", (done) => {
        request.execute(app)
            .get("/fii/nonexistent")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.be.json;
                expect(response).to.have.status(404);
                expect(response.body).to.have.property("message").which.equal('Request failed');
                expect(response.body).to.have.property("error").which.equal('Ticker not found');
                done();
            })
    });

    it("Should return 400 status", (done) => {
        request.execute(app)
            .get("/fii")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.be.json;
                expect(response).to.have.status(400);
                expect(response.body).to.have.property("message").which.equal('Missing required query parameter');
                expect(response.body).to.have.property("error").which.equal('The ticker parameter is required.');
                done();
            })
    });

    it("Response should have all indicators", (done) => {
        request.execute(app)
            .get("/fii/hglg11")
            .end((err, response) => {
                expect(err).to.be.null;

                let numberElements = ["value", "price", "pvp", "dy", "dy12m", "vacancy", "tax", "properties"];
                let stringElements = ["ticker", "sector", "cnpj"];

                expect(response).to.be.json;

                numberElements.forEach((ele) => {
                    expect(response.body).to.have.property(ele).which.match(/(\d+[.])?\d+/);
                });

                stringElements.forEach((ele) => {
                    expect(response.body).to.have.property(ele).which.is.a('string');
                });

                expect(response.body.ticker).to.equal("hglg11");

                expect(Object.keys(response.body)).to.have.lengthOf(numberElements.length + stringElements.length);

                done();
            })
    });

});

let stockTests = describe("Stocks endpoint testing", () => {

    it("Should return sucessfull status", (done) => {
        request.execute(app)
            .get("/stock/abev3")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                done();
            })
    });

    it("Should return 404 status", (done) => {
        request.execute(app)
            .get("/stock/nonexistent")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(404);
                expect(response).to.be.json;
                expect(response.body).to.have.property("message").which.equal('Request failed');
                expect(response.body).to.have.property("error").which.equal('Ticker not found');
                done();
            })
    });

    it("Should return 400 status", (done) => {
        request.execute(app)
            .get("/stock")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.be.json;
                expect(response).to.have.status(400);
                expect(response.body).to.have.property("message").which.equal('Missing required query parameter');
                expect(response.body).to.have.property("error").which.equal('The ticker parameter is required.');
                done();
            })
    });

    it("Response should have all indicators", (done) => {
        request.execute(app)
            .get("/stock/abev3")
            .end((err, response) => {
                expect(err).to.be.null;

                let numberElements = ["dy", "roe", "roic", "eve", "pl", "pvp", "lpa", "price"];
                let stringElements = ["ticker"];

                expect(response).to.be.json;

                numberElements.forEach((ele) => {
                    expect(response.body).to.have.property(ele).which.match(/([0-9]+[.])?[0-9]+/);
                });

                stringElements.forEach((ele) => {
                    expect(response.body).to.have.property(ele).which.is.a('string');
                });

                expect(response.body.ticker).to.equal("abev3");

                expect(Object.keys(response.body)).to.have.lengthOf(numberElements.length + stringElements.length);

                done();
            })
    });

});

/**
 * Main tests
 */
describe("Fundamentus api tests", () => {

    fiiTests;
    stockTests;

});