class Vendor {
  id?: number;
}
class PurchaseRequest {
  id?: number
}

export class IssuePO {
  vendor: Vendor;
  purchase_request: PurchaseRequest
  total_price?: number;
  total_price_tax?: number;
  po_products?: any = [];
  constructor() {
    this.vendor = new Vendor();
    this.purchase_request = new PurchaseRequest();
  }
}

export class RejectReason1 {
  id: number;
  reason: string;
  constructor(){}
}

export class RejectReason {
  id: number;
  reason: string;
}