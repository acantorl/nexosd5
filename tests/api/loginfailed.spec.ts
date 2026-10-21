import { test, expect } from "@playwright/test";

test.describe("API - Login DummyJSON", () => {
  test("Login con credenciales inválidas", async ({ request }) => {
    const response = await request.post("https://dummyjson.com/auth/login", {
      data: {
        username: "usuario_invalido",
        password: "123456",
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();

    console.log(body);

    expect(body.message).toBeTruthy();
  });
});
