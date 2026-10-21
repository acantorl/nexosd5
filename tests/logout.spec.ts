import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

const STANDARD_USER = process.env.STANDARD_USER!;
const STANDARD_PASSWORD = process.env.STANDARD_PASSWORD!;

test("should log out and navigate to the login page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  const productsPage = await loginPage.loginWithCredentials(
    STANDARD_USER,
    STANDARD_PASSWORD,
  );

  await productsPage.openMenu();
  await productsPage.logout();

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});
