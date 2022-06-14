import { Component, ElementRef } from '@angular/core';
import { ThemeService } from '@stackblitz-nx-angular/web/data-access';

@Component({
  selector: 'stackblitz-nx-angular-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private elementRef: ElementRef,
    private themeService: ThemeService
  ) {
    this.themeService.loadElementRef(this.elementRef);
    this.themeService.loadTheme('light');
  }
}
