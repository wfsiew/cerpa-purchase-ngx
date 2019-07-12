import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../shared';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  
  searchKeyword: string = '';
  useOption: boolean = false;
  @Input() showApp: string = '';
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();
  subscription: Subscription

  constructor(
    private searchService: SearchService,
    private messageService: MessageService,
    private translateService: TranslateService) {
  }
 
  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.subscription = this.messageService.getMessage().subscribe(x => {
      if (x.name == 'search:loadstate') {
        this.loadState(x.data);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search(ev) {
    if (ev.keyCode == 13) {
      this.initSearch();
    }
  }

  initSearch() {
    var o = {
      searchKeyword: this.searchKeyword,
      useOption: this.useOption,
      selectedOption: this.selectedOption - 1
    };
    this.messageService.sendMessage(`${this.searchService.searchOption.moduleName}:search`, o);
    this.searchEvent.emit('search');
  }

  loadState(o) {
    if (o == null) {
      this.searchKeyword = '';
      this.useOption = false;
      return;
    }

    this.searchKeyword = o.searchKeyword;
    this.useOption = o.useOption;
    this.selectedOption = o.selectedOption + 1;
  }

  set selectedOption(i: number) {
    this.searchService.searchOption.selectedIndex = i;
  }

  get selectedOption(): number {
    return this.searchService.searchOption.selectedIndex;
  }

  get selectionList(): string[] {
    return this.searchService.searchOption.list;
  }
}