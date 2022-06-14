import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageGalleryComponent } from '@stackblitz-nx-angular/web/features/image-gallery';
import { ViewImageComponent } from '@stackblitz-nx-angular/web/features/view-image';

const routes: Routes = [
  {
    path: '',
    component: ImageGalleryComponent,
  },
  {
    path: ':id',
    component: ViewImageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
