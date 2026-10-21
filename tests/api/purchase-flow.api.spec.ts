import { expect, test } from "@playwright/test";
import { DummyJsonApiClient } from "../../api/dummyjson-api.client";

const PRODUCT_ID = 1;
const USER_ID = 1;
const QUANTITY = 1;

test.describe("API de soporte HU-01 — DummyJSON", () => {
  test("HU01-API-01 obtiene y mapea los datos de un producto", async ({
    request,
  }) => {
    const api = new DummyJsonApiClient(request);
    const product = await api.getProduct(PRODUCT_ID);

    expect(product).toMatchObject({
      id: PRODUCT_ID,
      title: expect.any(String),
      description: expect.any(String),
      category: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
      thumbnail: expect.stringMatching(/^https:\/\//),
    });
    expect(product.price).toBeGreaterThan(0);
    expect(product.stock).toBeGreaterThan(0);
  });

  test("HU01-API-02 crea un carrito con el producto obtenido", async ({
    request,
  }) => {
    const api = new DummyJsonApiClient(request);
    const product = await api.getProduct(PRODUCT_ID);
    const cart = await api.addProductsToCart({
      userId: USER_ID,
      products: [{ id: product.id, quantity: QUANTITY }],
    });

    expect(cart.id).toBeGreaterThan(0);
    expect(cart.userId).toBe(USER_ID);
    expect(cart.totalProducts).toBe(1);
    expect(cart.totalQuantity).toBe(QUANTITY);
    expect(cart.products).toHaveLength(1);
    expect(cart.products[0]).toMatchObject({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: QUANTITY,
      total: product.price * QUANTITY,
    });
    expect(cart.discountedTotal).toBeGreaterThan(0);
  });
});
