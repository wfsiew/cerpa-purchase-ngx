export class Company {
    id?: number;
    company_name?: string;
    company_logo?: string;
    biz_reg_num?: string;
    gst_number?: string;
    credit_limit?: number; //decimal;
    payment_term?: number;
    bank?: string;
    bank_acct_num?: string;
    office_phone?: string;
    office_phone_code?:string;
    office_fax?: string;
    office_fax_code?:string;
    modified_date?: number; // timestamp;
    address?: Address;
    contact_persons?: ContactPersons[];
    constructor(){
        this.address = new Address();
        this.contact_persons = [new ContactPersons()];
    }
}

export class Address {
    id?: number;
    addr_line_1?: string;
    addr_line_2?: string;
    addr_line_3?: string;
    postcode?: string;
    city?: string;
    country?: number;
    state?: number
}

export class ContactPersons {
    id ?: number;
    name ?: string;
    email ?: string;
    phone ?: string;
    phone_code?: string;
    alt_email?: string
}
export class Country{
    id?:number;
    country_name?: string;
    states?:string;
    code?:string;
}
