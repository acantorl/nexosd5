import { Locator, Page } from "@playwright/test";

export class CheckoutStepOnePage {
  private readonly page: Page;
  public readonly firstNameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly postalCodeInput: Locator;
  public readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByLabel("First Name");
    this.lastNameInput = page.getByLabel("Last Name");
    this.postalCodeInput = page.getByLabel("Zip/Postal Code");
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  public async fillCustomerInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<CheckoutStepTwoPage> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();

    return new CheckoutStepTwoPage(this.page);
  }
}

export class CheckoutStepTwoPage {
  private readonly page: Page;
  public readonly finishButton: Locator;
  public readonly orderSummaryTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderSummaryTitle = page.locator(".title");
    this.finishButton = page.getByRole("button", { name: "Finish" });
  }

  public async completePurchase(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();
    return new CheckoutCompletePage(this.page);
  }
}

export class CheckoutCompletePage {
  public readonly successTitle: Locator;
  public readonly successMessage: Locator;

  constructor(page: Page) {
    this.successTitle = page.locator(".complete-header");
    this.successMessage = page.locator(".complete-text");
  }
}
