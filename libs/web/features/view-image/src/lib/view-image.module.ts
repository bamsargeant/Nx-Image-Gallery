import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewImageComponent } from './view-image.component';
import { CardModule } from '@stackblitz-nx-angular/web/ui/card';

@NgModule({
  imports: [CommonModule, CardModule],
  declarations: [ViewImageComponent],
  exports: [ViewImageComponent],
})
export class ViewImageModule {}
