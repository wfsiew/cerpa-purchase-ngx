import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'ago'
})
export class DateAgoPipe implements PipeTransform {

  transform(dateNow: any, timeDiff?: any): any {
    if (timeDiff == null || timeDiff == undefined) {
      let issuanceDate = moment(new Date(dateNow), "D MMM YYYY h:mm:ss A").fromNow();
      if(issuanceDate=="a minute ago") {
        issuanceDate = "1 minute ago"
      }
      if(issuanceDate=="an hour ago") {
        issuanceDate = "1 hour ago"
      }
      if(issuanceDate=="a day ago") {
        issuanceDate = "1 day ago"
      }
      if(issuanceDate=="a month ago") {
        issuanceDate = "1 month ago"
      }
      if(issuanceDate=="a year ago") {
        issuanceDate = "1 year ago"
      }
      return issuanceDate
    }
    // else {
    //   var diffTime = moment(0).diff((timeDiff * 1000));
    //   var duration = moment.duration(diffTime * -1);
    //   var days = duration.days();
    //   var years = duration.years();
    //   var months = duration.months()
    //   var hrs = duration.hours();
    //   var mins = duration.minutes();
    //   let result;
    //   if (years !== 0) {
    //     result = `${duration.asDays().toFixed()} days ago`
    //   }
    //   else if (months !== 0) {
    //     result = `${duration.asDays().toFixed()} days ago`
    //   }
    //   else if (days !== 0) {
    //     if (days === 1) {
    //       result = `${days} day ago`;
    //     }
    //     else {
    //       result = `${days} days ago`;
    //     }
    //   }
    //   else if (hrs !== 0) {
    //     if (hrs === 1) {
    //       result = `${hrs} hour ago`;
    //     }
    //     else {
    //       result = `${hrs} hours ago`;
    //     }
    //   }
    //   else if (mins !== 0) {
    //     if (mins === 1) {
    //       result = `${mins} minute ago`;
    //     }
    //     else {
    //       result = `${mins} minutes ago`;
    //     }
    //   }
    //   else {
    //     result = `few seconds ago`;
    //   }
    //   return result;
    // }
  }
}
