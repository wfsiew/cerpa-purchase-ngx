export class ProductPricingConstant {
  public static ERROR_MESSAGE: string = 'purchase.notification.errors.message';
  public static CATEGORY_TITLE: string = 'purchase.product-pricing.category.title';

  public static LIST_PRICE_IS_TAX_INCLUSIVE: string = 'purchase.product-pricing.category.title';
  public static DELETE_MESSAGE: string = 'purchase.product-pricing.delete.message';
  public static DELETE_TITLE: string = 'purchase.product-pricing.delete.title';
  public static DEFAULT_SORT_FIELD = 'cheapest_first';
  public static TAX_SCHEME =
    [
      { userView: "Listed price is tax inclusicve", value: 0 },
      { userView: "Subject to tax", value: 1 },
      { userView: "Non-taxable item", value: 2 }
    ] 
  /** 
   * product history changes
   */
  public static = {
    added: 0,
    updated: 1,
    deleted: 2,
  }
}
export class FILTER {
  categoryParams = '';
  isPromoItems = '';
  hasTierPrice = '';
  termParams = '';
  paymentTermData = '';
  keyword = '';
  constructor(
    categoryParams: any, isPromoItems: string, hasTierPrice: string, termParams: string, paymentTermData: string, keyword: string) {
    this.categoryParams = categoryParams;
    this.isPromoItems = isPromoItems;
    this.hasTierPrice = hasTierPrice;
    this.termParams = termParams;
    this.paymentTermData = paymentTermData;
    this.keyword = keyword;
  }

}
