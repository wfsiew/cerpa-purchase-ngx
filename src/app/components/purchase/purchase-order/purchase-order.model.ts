export class PurchaseRequest {
    material_id: number;
    material_name?: string;
    company_name?: string;
    quatity?: number;
}
export class PurchaseRequestItems {
    id: number;
    p_request: PurchaseRequest
    constructor() {
        this.p_request = new PurchaseRequest();
    }
}
export class PurchaseOrderList {
    id: number;
    vendor: string;
    issued_date: number;
    status: string;
    action: string;
}
export class RejectPo {
    reason: string
}

