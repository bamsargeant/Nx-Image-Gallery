import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';
import { ToggleSwitchModule } from '@stackblitz-nx-angular/web/ui/toggle-switch';

@NgModule({
  imports: [CommonModule, ToggleSwitchModule],
  declarations: [BannerComponent],
  exports: [BannerComponent],
})
export class BannerModule {}
