import { Component } from '@angular/core';

@Component({
  selector: 'app-test-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'testStocks';
}
