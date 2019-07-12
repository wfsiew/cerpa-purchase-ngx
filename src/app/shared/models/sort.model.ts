export class Sort {
  fieldName: string;
  order: SortOrder;
  constructor(fieldName, order) {
    this.fieldName = fieldName;
    this.order = order;
  }
  public toString = () : string => {
    return `${this.fieldName}:${this.order}`;
  }
}

export class ProductPricingSort{
  sort?: number;
  categories?: string;
  term?: number;
  constructor(sort){
    this.sort = sort
  }
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class OptionalSortingTerms{
  term: TermSort; 
  sort: SortOptions; 
  category: CategorySort[];
  constructor(term, category){
    this.term =  term;
    this.category = category
  }
}

export enum TermSort{
  ID = '',
  NAME = ''
}
export enum SortOptions{
  ID = '',
  NAME = ''
}
export enum CategorySort{
  NAME = ''
}