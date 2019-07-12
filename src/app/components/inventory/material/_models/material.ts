import { EventEmitter } from '@angular/core';

export class Material {
    id: Number;
    name: String; 
    description: String;
    category: String;
    brand: String;
    model: String;
    par_level: Number;
    quantity_measure: String;   // unit for quantity, e.g. KG, Litre, KM
    validity_days: Number;      // used for valid until expired
    modified_date: Date;        // used for comparison if the material has been updated.
}

export class MaterialAction {
    materialAction: EventEmitter<any>;
    constructor(materialAction: EventEmitter<any>) {
        this.materialAction = materialAction;
    }
    update(action) {
        this.materialAction.emit(action);
    }
    action: String;
}