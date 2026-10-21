import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/login.page";

const STANDARD_USER = process.env.STANDARD_USER!;
const STANDARD_PASSWORD = process.env.STANDARD_PASSWORD!;
const PRODUCT_NAME = process.env.PRODUCT_NAME!;
const FIRST_NAME = process.env.FIRST_NAME!;
const LAST_NAME = process.env.LAST_NAME!;
const POSTAL_CODE = process.env.POSTAL_CODE!;

test.describe("HU-01: Purchase flow", () => {
  test("@smoke @critical should add a product to the cart and complete a purchase", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    const productsPage = await loginPage.loginWithCredentials(
      STANDARD_USER,
      STANDARD_PASSWORD,
    );

    await expect(productsPage.title).toBeVisible();

    await productsPage.addProductByName(PRODUCT_NAME);
    await expect(productsPage.shoppingCartBadge).toHaveText("1");

    const cartPage = await productsPage.openCart();
    await expect(cartPage.pageTitle).toBeVisible();

    const checkoutPage = await cartPage.proceedToCheckout();
    const overviewPage = await checkoutPage.fillCustomerInformation(
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
