import { SortBatch } from '../../../components/inventory/inventory.model';

export class InventoryPageService {
  sortList = [];
  page = 1;
  belowParLevel: boolean;
  currentPromo: boolean;
  term = '';
  category = '';
  productType: number;
  expiredStock: boolean;
  notForSale: boolean;
  saveState: boolean;

  initInventory() {
    this.sortList = [];
    this.page = 1;
    this.term = '';
    this.category = null;
    this.productType = null;
    this.expiredStock = null;
    this.notForSale = false;
    this.saveState = false;
    this.belowParLevel = false;
  }
}

export class BatchesPageService {
  page = 1;
  sortBatch = SortBatch;
  isSave = false;

  initInventory() {
    this.page = 1;
    this.sortBatch = null;
    this.isSave = false;
  }
}
