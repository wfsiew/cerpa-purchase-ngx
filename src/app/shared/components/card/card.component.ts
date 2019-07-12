import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})


export class CardComponent implements OnInit {
  @Input() venodr: string;
  // @Input() ContaxMenuList: [];
  constructor(private router: Router) { }
  ngOnInit() {}

  hello(name:string = 'Hayat'){
    console.log(name)
  }

  test(id){
    console.log(id);
  }
}
