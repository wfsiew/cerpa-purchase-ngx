export class UIUtil {

  static getValidationErrors(dic): string {
    let r = '';

    let le = [];
    for (let k in dic) {
      let a = dic[k];
      a.forEach(s => {
        le.push(s);
      });
    }

    if (le.length > 0) {
      let ls = [];
      ls.push('<ol>');
      le.forEach(x => {
        ls.push(`<li>${x}</li>`);
      });
      ls.push('</ol>');

      r = ls.join('');
    }

    return r;
  }

  static isInt(value): boolean {
    return !isNaN(value) && !isNaN(parseInt(value, 10));
  }
}