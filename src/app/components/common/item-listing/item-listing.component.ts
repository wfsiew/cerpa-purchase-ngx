import { Component, OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { PageEvent } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-listing',
  templateUrl: './item-listing.component.html',
  styleUrls: ['./item-listing.component.css']
})
export class ItemListingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
