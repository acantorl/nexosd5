import { Locator, Page } from "@playwright/test";
import { ProductsPage } from "./products.page";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  public readonly usernameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel("Username");
    this.passwordInput = page.getByLabel("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  public async open(): Promise<void> {
    await this.navigateTo("/");
  }

  public async loginWithCredentials(
    username: string,
    password: string,
  ): Promise<ProductsPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    return new ProductsPage(this.page);
  }
}
