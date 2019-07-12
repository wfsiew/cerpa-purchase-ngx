import { HttpHeaders } from '@angular/common/http';

export class ResponseWrapper {
  constructor(
    public headers: HttpHeaders,
    public data: any,
    public status: number
  ) { }
}