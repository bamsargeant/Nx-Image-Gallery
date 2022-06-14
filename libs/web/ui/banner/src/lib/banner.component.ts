import { Component } from '@angular/core';
import { ThemeService } from '@stackblitz-nx-angular/web/data-access';

@Component({
  selector: 'stackblitz-nx-angular-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  constructor(private themeService: ThemeService) {}

  public get themeName(): string | undefined {
    return this.themeService.activeThemeName;
  }

  public changeTheme(lightMode: boolean) {
    this.themeService.loadTheme(lightMode ? 'light' : 'dark');
    console.log(this.themeService.activeThemeName);
  }
}
