export class BaseEntity {
    id?: number;
}
export class Vendor implements BaseEntity {
    id?: number;
    company_name?: string;
}

export class Pricing {
    id = 0;
    from_qty = 0;
    to_qty = 0;
    price = '0.00';
}

export class Promotion {
    id = 0;
    from_date = 0;
    to_date = 0;
    price = '0.00';
}
export class Product implements BaseEntity {
    id?: number
    material_name?: string;
    material_picture?: string;
    default_price?: string;
    use_lowest_price?: boolean;
    tax_scheme: string;
    pricings?: Pricing[];
    promotions?: Promotion[];

    constructor() {
        this.pricings = [new Pricing()];
        this.promotions = [new Promotion()];
    }
}

export class Material {
    material_id?: number;
    material_name?: string;
    material_picture?: string;
}

export interface DialogData {
    id?: number,
    name?: string;
    title?: string;
    message?: string;
    confirmButton?: string;
    cancelButton?: string
}

export class Groups implements BaseEntity {
    id?: number;
    name?: string;
    permissions?: any = []
}

export class CurrentUser implements BaseEntity {
    id?: number;
    username?: string;
    email?: string;
    is_active?: string;
    first_name?: string;
    last_name?: string;
    groups?: Groups;
    constructor() {
        this.groups = new Groups()
    }
}

export class Category {
    name?: string;
}

export class Sort implements BaseEntity {
    id?: number;
    name?: string;
}
export class termOptions implements BaseEntity {
    id?: number;
    name?: string;
}

//   *****************************

export class ProductPricingData { //VewProductPricing -->change the name
    id?: number;
    price?: number; // decimal
    tax_scheme?: number;
    use_lowest_price?: boolean
    material?: Material;
    vendor?: Vendor
    constructor() {
        this.material = new Material();
        this.vendor = new Vendor();
    }
}

export class AddNewMaterial {
    id: number
    price?: number;
    tax_scheme?: number;
    add_price?: Pricing[];
    add_promotions?: Promotion[];
    constructor() {
        this.add_price = [new Pricing()];
        this.add_promotions = [new Promotion()];
    }
}
export class PromotionHistoryList {
    id?: number;
    from_date?: string;
    to_date?: string;
    price?: string;
    changed?: boolean;
}
export class TierPricingHistoryList {
    id?: number;
    from_qty?: number;
    to_qty?: number;
    price: string;
    changed: boolean
}

export class VendorDoProduct {
    id?: number;
    material: Material;
    quantity: number;
    accepted_quantity: number;

    constructor() {
        this.material = new Material();
    }
}