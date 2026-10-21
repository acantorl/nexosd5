import { test, expect } from "@playwright/test";

test.describe("API - Login DummyJSON", () => {
  test("Login exitoso", async ({ request }) => {
    const response = await request.post("https://dummyjson.com/auth/login", {
      data: {
        username: "emilys",
        password: "emilyspass",
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    console.log(body);

    expect(body).toHaveProperty("accessToken");
    expect(body.username).toBe("emilys");
    expect(body.firstName).toBeTruthy();
    expect(body.lastName).toBeTruthy();
  });
});
