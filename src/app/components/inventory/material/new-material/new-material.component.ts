import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

// import { MatFormField, MatPaginator } from '@angular/material';


@Component({
  selector: 'app-new-material',
  templateUrl: './new-material.component.html',
  styleUrls: ['./new-material.component.css']
})
export class NewMaterialComponent implements OnInit {
  @Input() newmaterial: String; 
  
  constructor() { }

  ngOnInit() {
  }

}
