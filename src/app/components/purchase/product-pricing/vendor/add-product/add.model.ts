export class Material {
    id: number;
    name: string;
    material_picture: string
}
export class Pricings {
    id: number;
    from_qty: number;
    to_qty: number;
    price: number;
}

export class Promotions {
    id: number;
    from_date: string;
    to_date: string;
    price: number;
}
export class SubmitModel {
    material: Material;
    price: number;
    tax_scheme: number;
    use_lowest_price: boolean;
    pricings: Pricings[];
    promotions: Promotions[];
    constructor(){
        this.promotions = [new Promotions()];
        this.pricings = [new Pricings()];
    }
}