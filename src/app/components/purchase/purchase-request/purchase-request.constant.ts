export class PurchaseRequestConstant {
  public static DEFAULT_SORT_FIELD = 'issued_date';
  public static CANCEL_PURCHASE_REQUEST_TITLE = 'purchase.purchase-request.cancel-pr.title';
  public static CANCEL_PURCHASE_REQUEST_MESSAGE = 'purchase.purchase-request.cancel-pr.message';
  public static CANCEL_PURCHASE_ORDER_TITLE = 'purchase.purchase-order.cancel-po.title';
  public static CANCEL_PURCHASE_ORDER_MESSAGE = 'purchase.purchase-order.cancel-po.message';
  public static REISSUE_PURCHASE_ORDER_TITLE = 'purchase.purchase-order.issues.reissue.title';
  public static REISSUE_PURCHASE_ORDER_MESSAGE = 'purchase.purchase-order.issues.reissue.message';
  public static DELETE_PURCHASE_ORDER_TITLE = 'purchase.purchase-order.delete.title';
  public static DELETE_PURCHASE_ORDER_MESSAGE = 'purchase.purchase-order.delete.message';


  public static PR_STATUS = {
    Progress: 0,
    IssuedPO: 1,
    Delivered: 2,
    Completed: 3,
    Cancelled: 4,
  }

  public static TABLE_COL_NAME = {
    ID: 'purchase.purchase-request.pr-list-table.id',
    REQUESTED_BY: 'purchase.purchase-request.pr-list-table.id',
    ISSUED_DATE: 'purchase.purchase-request.pr-list-table.id',
    STATUS: 'purchase.purchase-request.pr-list-table.id',
    ACTION: 'purchase.purchase-request.pr-list-table.id'
  }
}
