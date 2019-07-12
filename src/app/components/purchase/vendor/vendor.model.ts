import { VendorLocaleConstant } from './vendor-locale.constant';

export enum VendorStatus {
  Active = 1,
  Blacklisted = 2,
  Invited = 3
}

export class Vendor {
  id?: number;
  company_logo?: string;
  company_name?: string;
  status?: number;
  getStatus() {
    return this.status;
  }

  getStatusLocale(): string {
    let ret = VendorLocaleConstant.VENDOR_STATUS_INVITED;
    switch (this.status) {
      case VendorStatus.Invited:
        ret = VendorLocaleConstant.VENDOR_STATUS_INVITED;
        break;
      case VendorStatus.Active:
        ret = VendorLocaleConstant.VENDOR_STATUS_ACTIVE;
        break;
      case VendorStatus.Blacklisted:
        ret = VendorLocaleConstant.VENDOR_STATUS_BLACKLISTED;
        break;
    }
    return ret;
  }
}

export class VendorAddress {

  id?: number;
  addr_line_1?: string;
  addr_line_2?: string;
  addr_line_3?: string;
  postcode?: string;
  city?: string;
  country?: string;
  state?: string;
}

export class VendorContactPerson {

  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  alt_email?: string;
}

export class Country {

  id?: number;
  name?: string;
}

export class State {

  id?: number;
  name?: string;
  country_id?: number;
}

export class VendorDetails {

  id?: number;
  company_name?: string;
  company_logo?: string;
  biz_reg_num: string;
  gst_number: string;
  bank: string;
  account_num: string;
  credit_limit: number;
  payment_term: number;
  office_phone: string;
  office_fax: string;
  modified_date: string;
  address?: VendorAddress;
  contact_persons?: VendorContactPerson[];
  own_contact_persons?: VendorContactPerson[];

  constructor() {
    this.address = new VendorAddress();
    this.contact_persons = [];
    this.own_contact_persons = [];
  }
}