import { Component, OnInit } from '@angular/core';
import { Material } from './_models/material';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    // Default material action to list all materials. 
    this.materialAction = 'listMaterial';
  }

  materialAction: String;

  setAction(action) {
    this.materialAction = action;
  }

}

