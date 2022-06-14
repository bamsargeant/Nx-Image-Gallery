import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewImageComponent } from './view-image.component';
import { CardModule } from '@stackblitz-nx-angular/web/ui/card';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, CardModule, FormsModule],
  declarations: [ViewImageComponent],
  exports: [ViewImageComponent],
})
export class ViewImageModule {}
