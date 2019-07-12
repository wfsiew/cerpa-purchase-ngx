export class SearchOption {
  
  moduleName: string;
  selectedIndex: number;
  list: string[];

  constructor() {
    this.init();
  }

  init() {
    this.moduleName = '';
    this.selectedIndex = 0;
    this.list = [];
  }

  setData(moduleName: string, selectedIndex: number, list: string[]) {
    this.moduleName = moduleName;
    this.selectedIndex = selectedIndex;
    this.list = list;
  }
}