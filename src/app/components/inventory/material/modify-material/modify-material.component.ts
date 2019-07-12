import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-modify-material',
  templateUrl: './modify-material.component.html',
  styleUrls: ['./modify-material.component.css']
})
export class ModifyMaterialComponent implements OnInit {
  @Input() newmaterial: String;

  constructor() { }

  ngOnInit() {
  }

}
