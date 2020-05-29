const request = require("supertest");
const { app } = require("../app");

describe('Test the db connection', () => {
  test("It should response return the list of pizzas", () => {
    return request(app)
      .get("/api/products")
      .then(response => {
        const json = JSON.parse(response.text);
        expect(json.pizzas.length).toBe(10);
        expect(response.statusCode).toBe(200);
      });
  });
});