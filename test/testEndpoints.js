let server = require("../app");
let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

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
            done();
        })
    });

    it("Response should have all indicators", (done) => {
        chai.request(server)
        .get("/fii/hglg11")
        .end((err, response) => {
            if (err) return done(err);
            
            ["ticker","pvp","dy","price"].forEach((ele) => {
                response.body.should.have.property(ele);
            });

            response.body.ticker.should.equal("hglg11");
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
            response.should.have.status(200);
            done();
        })
    });

    it("Response should have all indicators", (done) => {
        chai.request(server)
        .get("/stock/abev3")
        .end((err, response) => {
            if (err) return done(err);
            
            ["ticker","dy","roe","roic","eve","pl","pvp","lpa","price"].forEach((ele) => {
                response.body.should.have.property(ele);
            });

            response.body.ticker.should.equal("abev3");
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
