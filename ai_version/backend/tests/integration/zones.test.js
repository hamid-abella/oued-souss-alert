// Test de l’API des zones

const request = require("supertest");

const app = require("../../src/app");

describe("API Zones", () => {

  test("GET /api/zones doit retourner les zones", async () => {

    const response = await request(app)
      .get("/api/zones");

    expect(response.statusCode).toBe(200);

  });

});