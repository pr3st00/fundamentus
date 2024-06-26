let server = require("../app");
let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

let miscTests = describe("Miscelaneous testing", () => {

    it("Should return alive status", (done) => {
        chai.request(server)
            .get("/health")
            .end((err, response) => {
                if (err) return done(err);
                response.should.have.status(200);
                response.body.should.have.property("status").which.equal('alive');
                done();
            })
    });
});

let fiiTests = describe("Fii endpoint testing", () => {

    it("Should return sucessfull status", (done) => {
        chai.request(server)
            .get("/fii/hglg11")
            .end((err, response) => {
                if (err) return done(err);
                response.should.have.status(200);
                done();
            })
    });

    it("Should return 404 status", (done) => {
        chai.request(server)
            .get("/fii/nonexistent")
            .end((err, response) => {
                if (err) return done(err);
                response.should.have.status(404);
                response.body.should.have.property("message").which.equal('Request failed');
                response.body.should.have.property("error").which.equal('Ticker not found');
                done();
            })
    });

    it("Response should have all indicators", (done) => {
        chai.request(server)
            .get("/fii/hglg11")
            .end((err, response) => {
                if (err) return done(err);

                let numberElements = ["value", "price", "pvp", "dy", "dy12m", "vacancy", "tax", "properties"];
                let stringElements = ["ticker", "sector", "cnpj" ];

                numberElements.forEach((ele) => {
                    response.body.should.have.property(ele).which.match(/(\d+[.])?\d+/);
                });

                stringElements.forEach((ele) => {
                    response.body.should.have.property(ele).which.is.a('string');
                });

                response.body.ticker.should.equal("hglg11");

                Object.keys(response.body).should.have.lengthOf(numberElements.length + stringElements.length);

                done();
            })
    });

});


let stockTests = describe("Stocks endpoint testing", () => {

    it("Should return sucessfull status", (done) => {
        chai.request(server)
            .get("/stock/abev3")
            .end((err, response) => {
                if (err) return done(err);
                response.should.have.status(200);
                done();
            })
    });

    it("Should return 404 status", (done) => {
        chai.request(server)
            .get("/stock/nonexistent")
            .end((err, response) => {
                if (err) return done(err);
                response.should.have.status(404);
                response.body.should.have.property("message").which.equal('Request failed');
                response.body.should.have.property("error").which.equal('Ticker not found');
                done();
            })
    });

    it("Response should have all indicators", (done) => {
        chai.request(server)
            .get("/stock/abev3")
            .end((err, response) => {
                if (err) return done(err);

                let numberElements = ["dy", "roe", "roic", "eve", "pl", "pvp", "lpa", "price"];
                let stringElements = ["ticker"];

                numberElements.forEach((ele) => {
                    response.body.should.have.property(ele).which.match(/([0-9]+[.])?[0-9]+/);
                });

                stringElements.forEach((ele) => {
                    response.body.should.have.property(ele).which.is.a('string');
                });

                response.body.ticker.should.equal("abev3");

                Object.keys(response.body).should.have.length(numberElements.length + stringElements.length);

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
