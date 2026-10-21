import { expect, Page, test } from "@playwright/test";
import { CartPage } from "../pages/cart.page";
import { CheckoutStepOnePage, CheckoutStepTwoPage } from "../pages/checkout.page";
import { LoginPage } from "../pages/login.page";
import { ProductsPage } from "../pages/products.page";

const STANDARD_USER = process.env.STANDARD_USER!;
const STANDARD_PASSWORD = process.env.STANDARD_PASSWORD!;
const PRODUCT_NAME = process.env.PRODUCT_NAME!;
const SECOND_PRODUCT_NAME = "Sauce Labs Bike Light";
const FIRST_NAME = process.env.FIRST_NAME!;
const LAST_NAME = process.env.LAST_NAME!;
const POSTAL_CODE = process.env.POSTAL_CODE!;

async function signIn(page: Page): Promise<ProductsPage> {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  return loginPage.loginWithCredentials(STANDARD_USER, STANDARD_PASSWORD);
}

async function addProductAndOpenCart(
  page: Page,
  productName: string,
): Promise<CartPage> {
  const productsPage = await signIn(page);
  await productsPage.addProductByName(productName);
  return productsPage.openCart();
}

test.describe("HU-01: Flujo de Compra", () => {
  test("HU01-CP-01 agrega un producto y actualiza la insignia del carrito", async ({
    page,
  }) => {
    const productsPage = await signIn(page);

    await productsPage.addProductByName(PRODUCT_NAME);

    await expect(productsPage.shoppingCartBadge).toHaveText("1");
  });

  test("HU01-CP-02 muestra el producto agregado en el carrito", async ({
    page,
  }) => {
    const cartPage = await addProductAndOpenCart(page, PRODUCT_NAME);

    await expect(cartPage.pageTitle).toBeVisible();
    await expect(page.getByText(PRODUCT_NAME, { exact: true })).toBeVisible();
  });

  test("HU01-CP-03 permite agregar varios productos al carrito", async ({
    page,
  }) => {
    const productsPage = await signIn(page);

    await productsPage.addProductByName(PRODUCT_NAME);
    await productsPage.addProductByName(SECOND_PRODUCT_NAME);

    await expect(productsPage.shoppingCartBadge).toHaveText("2");
  });

  test("HU01-CP-04 completa una compra y muestra la confirmación", async ({
    page,
  }) => {
    const cartPage = await addProductAndOpenCart(page, PRODUCT_NAME);
    const checkoutPage: CheckoutStepOnePage =
      await cartPage.proceedToCheckout();
    const overviewPage: CheckoutStepTwoPage =
      await checkoutPage.fillCustomerInformation(
        FIRST_NAME,
        LAST_NAME,
        POSTAL_CODE,
      );

    await expect(overviewPage.orderSummaryTitle).toBeVisible();

    const completePage = await overviewPage.completePurchase();
    await expect(completePage.successTitle).toBeVisible();
    await expect(completePage.successMessage).toBeVisible();
  });
});
