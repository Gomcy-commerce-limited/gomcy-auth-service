import request from "supertest";
import { expect } from "chai";
import createServer from "server";

const app = createServer();

describe("start shop session", function () {
    it("should sign in a shop", function (done) {
        request(app)
            .post("/start-shop-session")
            .send({ shopId: "1234567" })
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property("message");
                done();
            });
    });
});