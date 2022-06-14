import { Component } from '@angular/core';
import { ThemeService } from '@stackblitz-nx-angular/web/data-access';
import { Router } from '@angular/router';

@Component({
  selector: 'stackblitz-nx-angular-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  constructor(private themeService: ThemeService, private router: Router) {}

  public get themeName(): string | undefined {
    return this.themeService.activeThemeName;
  }

  public changeTheme(lightMode: boolean) {
    this.themeService.loadTheme(lightMode ? 'light' : 'dark');
  }

  public toHome() {
    this.router.navigate(['/'], {
      queryParams: {
        page: 1,
        limit: 5,
        load: 0,
        index: 0,
      },
    });
  }
}
