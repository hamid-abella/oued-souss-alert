const request = require("supertest");

const app = require("../../src/app");

describe("API Alertes", () => {

  test("GET /api/alerts", async () => {

    const res = await request(app)
      .get("/api/alerts");

    expect(res.statusCode).toBe(200);

  });

});