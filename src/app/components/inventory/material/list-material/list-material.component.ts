import { Component, OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { PageEvent } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { EventEmitter } from '@angular/core';

// imports of data model classes
import { Material, MaterialAction } from '../_models/material';

// imports of common components
import { ItemListingComponent } from '../../../common/item-listing/item-listing.component';

@Component({
  selector: 'app-list-material',
  templateUrl: './list-material.component.html',
  styleUrls: ['./list-material.component.css']
})
export class ListMaterialComponent implements OnInit {
  material = new Material();
  Element: any = {};
  @Output() newmaterial: String = 'newmariall';
  @Output() materialAction = new EventEmitter<any>();
  // @Output() materialAction = new EventEmitter<MaterialAction>();
  action = new MaterialAction(this.materialAction);
  constructor() { }

  ngOnInit() {
  }

  displayedColumns = ['position', 'name', 'cat', 'qty'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  
  // MatPaginator Output
  pageEvent: PageEvent;
  
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  updateMaterialAction(action) {
  //   this.materialAction.emit(action);
  }
}

export interface Element {
  position: number;
  id: number;
  name: string;
  qty: number;
  cat: string;
  unit: string;
}

const ELEMENT_DATA: Element[] = [
  {position: 1, id: 1, name: 'Salt', qty: 503, cat: 'category', unit: 'pack'},
  {position: 2, id: 2, name: 'Pepper', qty: 4002, cat: 'category', unit: 'pack'},
  {position: 3, id: 3, name: 'Sugar', qty: 69, cat: 'category', unit: 'pack'},
  {position: 4, id: 4, name: 'Fish', qty: 91, cat: 'category', unit: 'unit'},
  {position: 5, id: 5, name: 'Chicken', qty: 91, cat: 'category', unit: 'unit'},
  {position: 6, id: 6, name: 'Beef', qty: 91, cat: 'category', unit: 'unit'},
];

