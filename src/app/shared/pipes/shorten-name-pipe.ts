import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenName',
  standalone: true
})
export class ShortenNamePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const parts = value.trim().split(' ');

    if (parts.length === 1) {
      return value;
    }

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];

    return `${firstName} ${lastName}`;
  }
}
