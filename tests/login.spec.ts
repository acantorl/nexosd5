import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

const STANDARD_USER = process.env.STANDARD_USER!;
const STANDARD_PASSWORD = process.env.STANDARD_PASSWORD!;

test("should log in and navigate to the inventory page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.loginWithCredentials(STANDARD_USER, STANDARD_PASSWORD);

  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});
