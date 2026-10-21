import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CartPage } from './cart.page';

export class ProductsPage extends BasePage {
  public readonly title: Locator;
  public readonly shoppingCartLink: Locator;
  public readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
  }

  public async addProductByName(productName: string): Promise<void> {
    const productCard = this.page
      .locator('.inventory_item')
      .filter({ has: this.page.getByText(productName, { exact: true }) });

    const addToCartButton = productCard.getByRole('button', { name: 'Add to cart' });
    await addToCartButton.click();
  }

  public async openCart(): Promise<CartPage> {
    await this.shoppingCartLink.click();
    return new CartPage(this.page);
  }

  public async getCartItemsCount(): Promise<number> {
    const badgeCount = await this.shoppingCartBadge.count();
    if (badgeCount === 0) {
      return 0;
    }

    const text = await this.shoppingCartBadge.textContent();
    return Number.parseInt(text ?? '0', 10);
  }
}
