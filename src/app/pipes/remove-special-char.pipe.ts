import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpecialChar'
})
export class RemoveSpecialCharPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    return value ? value.replace(/_/g, ' ')  : value;
  }

}
