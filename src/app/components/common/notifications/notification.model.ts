export class Notifications{
    from:string;
    notifyDate:string;
    poReference: string;
    notifyBody:string;
    constructor(from, notifyDate, poReference,notifyBody){
        this.from = from;
        this.notifyDate = notifyDate;
        this.poReference = poReference;
        this.notifyBody = notifyBody;
    }
}