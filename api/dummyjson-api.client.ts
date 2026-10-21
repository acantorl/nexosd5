import { APIRequestContext, APIResponse } from "@playwright/test";
import {
  AddToCartRequest,
  CatalogProduct,
  ShoppingCart,
} from "./dummyjson.models";

const DEFAULT_BASE_URL = "https://dummyjson.com";

export class DummyJsonApiClient {
  private readonly baseUrl: string;

  constructor(
    private readonly request: APIRequestContext,
    baseUrl: string = process.env.DUMMYJSON_BASE_URL ?? DEFAULT_BASE_URL,
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  public async getProduct(productId: number): Promise<CatalogProduct> {
    const response = await this.request.get(
      `${this.baseUrl}/products/${productId}`,
    );
    const payload: unknown = await this.readSuccessfulJson(
      response,
      "Obtener producto",
    );

    return this.mapProduct(payload);
  }

  public async addProductsToCart(
    cart: AddToCartRequest,
  ): Promise<ShoppingCart> {
    const response = await this.request.post(`${this.baseUrl}/carts/add`, {
      data: cart,
    });
    const payload: unknown = await this.readSuccessfulJson(
      response,
      "Agregar productos al carrito",
    );

    return this.mapShoppingCart(payload);
  }

  private async readSuccessfulJson(
    response: APIResponse,
    operation: string,
  ): Promise<unknown> {
    if (!response.ok()) {
      const responseBody = await response.text();
      throw new Error(
        `${operation} falló: HTTP ${response.status()} - ${responseBody}`,
      );
    }

    return response.json();
  }

  private mapProduct(payload: unknown): CatalogProduct {
    if (
      !isRecord(payload) ||
      !isNumber(payload.id) ||
      !isString(payload.title) ||
      !isString(payload.description) ||
      !isString(payload.category) ||
      !isNumber(payload.price) ||
      !isNumber(payload.stock) ||
      !isString(payload.thumbnail)
    ) {
      throw new Error("La respuesta de producto de DummyJSON no tiene el formato esperado.");
    }

    return {
      id: payload.id,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      price: payload.price,
      stock: payload.stock,
      thumbnail: payload.thumbnail,
    };
  }

  private mapShoppingCart(payload: unknown): ShoppingCart {
    if (
      !isRecord(payload) ||
      !isNumber(payload.id) ||
      !isNumber(payload.userId) ||
      !isNumber(payload.total) ||
      !isNumber(payload.discountedTotal) ||
      !isNumber(payload.totalProducts) ||
      !isNumber(payload.totalQuantity) ||
      !Array.isArray(payload.products)
    ) {
      throw new Error("La respuesta de carrito de DummyJSON no tiene el formato esperado.");
    }

    return {
      id: payload.id,
      userId: payload.userId,
      total: payload.total,
      discountedTotal: payload.discountedTotal,
      totalProducts: payload.totalProducts,
      totalQuantity: payload.totalQuantity,
      products: payload.products.map((product: unknown) =>
        this.mapCartProduct(product),
      ),
    };
  }

  private mapCartProduct(payload: unknown): ShoppingCart["products"][number] {
    if (
      !isRecord(payload) ||
      !isNumber(payload.id) ||
      !isString(payload.title) ||
      !isNumber(payload.price) ||
      !isNumber(payload.quantity) ||
      !isNumber(payload.total) ||
      !isNumber(payload.discountedPrice) ||
      !isString(payload.thumbnail)
    ) {
      throw new Error("Un producto del carrito de DummyJSON no tiene el formato esperado.");
    }

    return {
      id: payload.id,
      title: payload.title,
      price: payload.price,
      quantity: payload.quantity,
      total: payload.total,
      discountedPrice: payload.discountedPrice,
      thumbnail: payload.thumbnail,
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
