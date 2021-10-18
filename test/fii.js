let server = require("../app");
let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe("Fundamentus api tests", () => {

    describe("Fii endpoint testing", () => {

        it("Should return correct status", (done) => {
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

        it("Should have all indicators", (done) => {
            chai.request(server)
            .get("/fii/hglg11")
            .end((err, response) => {
                if (err) return done(err);
                response.should.have.status(404);
                done();
            })
        });

        
    });

});
