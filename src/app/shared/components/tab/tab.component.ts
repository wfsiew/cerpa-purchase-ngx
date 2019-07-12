import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {

  @Input() tabs: any;
  @Input() selected: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  selectTab(a, b) {
    // this.router.navigate([a]);
    this.selected = b;
    this.router.navigate([a]);
  }
}


