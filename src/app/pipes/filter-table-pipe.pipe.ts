import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTabelDataPipe'
})
export class FilterTableDataPipe implements PipeTransform {

 transform(value: any[], searchText: any): any {

    if (!searchText) {
      return value;
    }
    if (searchText === 'DATEADDED') {
      /*      return value.sort((a, b) => {
            return (a.DATEADDED) - (b.DATEADDED);
          }); */
    return value.sort((a: any, b: any) => b[searchText].localeCompare(a[searchText]));
    }

    if (searchText === 'DATEMODIFIED') {
    return value.sort((a: any, b: any) => b[searchText].localeCompare(a[searchText]));
    }

    if (searchText === 'DISTRIBUTION') {
    return value.sort((a: any, b: any) => b[searchText].localeCompare(a[searchText]));
    }

    return value.filter((data) => this.matchValue(data, searchText));

  }

  matchValue(data, value) {
    return Object.keys(data).map((key) => {
       return new RegExp(value, 'gi').test(data[key]);
    }).some(result => result);
  }



}
