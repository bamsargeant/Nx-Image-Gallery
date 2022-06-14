import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageGalleryComponent } from './image-gallery.component';
import { CardModule } from '@stackblitz-nx-angular/web/ui/card';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, CardModule, FormsModule],
  declarations: [ImageGalleryComponent],
  exports: [ImageGalleryComponent],
})
export class ImageGalleryModule {}
