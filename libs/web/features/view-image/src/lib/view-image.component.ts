import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
  ImageService,
  ImageInfo,
} from '@stackblitz-nx-angular/web/data-access';

@Component({
  selector: 'stackblitz-nx-angular-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
})
export class ViewImageComponent implements OnInit, OnDestroy {
  public imageInfo: ImageInfo | undefined;
  public imgSrc = '';

  private id: string | undefined;
  private cachedImageInfo: ImageInfo | undefined;
  private imageInfoSubscription$: Subscription | undefined;

  private pageParam: number | undefined;
  private limitParam: number | undefined;
  private loadMoreCounterParam: number | undefined;

  constructor(
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pageParam = Number(this.route.snapshot.queryParamMap.get('page'));
    this.limitParam = Number(this.route.snapshot.queryParamMap.get('limit'));
    this.loadMoreCounterParam = Number(
      this.route.snapshot.queryParamMap.get('load')
    );

    this.imageInfoSubscription$ = this.imageService.imageInfo$.subscribe(
      (result) => {
        this.imageInfo = result;
        this.imgSrc = result?.download_url || '';
      }
    );
  }

  ngOnDestroy(): void {
    if (this.imageInfoSubscription$) {
      this.imageInfoSubscription$.unsubscribe();
    }
  }

  public loadImage() {
    this.imageService.imageInfo$.pipe(
      map((imageInfoResult: any) => {
        this.imageInfo = imageInfoResult;
      })
    );

    if (this.cachedImageInfo && this.cachedImageInfo.id == this.id) {
      this.imageInfo = this.cachedImageInfo;
    } else {
      this.imageService.retrieveImageInfo({ id: this.id });
    }
  }

  public backToList() {
    this.router.navigate(['/'], {
      queryParams: {
        page: this.pageParam,
        limit: this.limitParam,
        load: this.loadMoreCounterParam,
      },
    });
  }
}
