import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CheckoutStepOnePage } from './checkout.page';

export class CartPage extends BasePage {
  public readonly pageTitle: Locator;
  public readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  public async proceedToCheckout(): Promise<CheckoutStepOnePage> {
    await this.checkoutButton.click();
    return new CheckoutStepOnePage(this.page);
  }
}
