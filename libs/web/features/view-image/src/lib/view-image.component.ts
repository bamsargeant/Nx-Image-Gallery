import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, debounceTime } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import {
  ImageService,
  ImageInfo,
} from '@stackblitz-nx-angular/web/data-access';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'stackblitz-nx-angular-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
})
export class ViewImageComponent implements OnInit, OnDestroy {
  public imageInfo: ImageInfo | undefined;
  public imgSrc: string | SafeUrl = '';

  public loading = true;

  private id: string | undefined;
  private cachedImageInfo: ImageInfo | undefined;
  private imageInfoSubscription$: Subscription | undefined;
  private imageSrcSubscription$: Subscription | undefined;

  private pageParam: number | undefined;
  private limitParam: number | undefined;
  private loadMoreCounterParam: number | undefined;
  public indexParam: number | undefined;

  public greyscale = false;
  public blur = 0;
  public blurOptions = Array.from({ length: 11 }, (v, k) => k);
  public width = 0;
  public height: number | null | undefined = 0;
  public dimensionsChanged = new Subject<string>();

  constructor(
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dimensionsChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.onChangeImageOptions();
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    this.pageParam = Number(this.route.snapshot.queryParamMap.get('page'));
    this.limitParam = Number(this.route.snapshot.queryParamMap.get('limit'));
    this.loadMoreCounterParam = Number(
      this.route.snapshot.queryParamMap.get('load')
    );
    this.indexParam = Number(this.route.snapshot.queryParamMap.get('index'));

    this.imageInfoSubscription$ = this.imageService.imageInfo$.subscribe(
      (result) => {
        this.imageInfo = result;
        this.width = this.imageInfo?.width || 0;
        this.height = this.imageInfo?.height || null;
        this.setMaxDimensions();

        // this.imgSrc = result?.download_url || '';
      }
    );

    this.imageSrcSubscription$ = this.imageService.image$.subscribe(
      (result) => {
        this.imgSrc = result || '';
        this.loading = false;
      }
    );

    this.loadImage();
  }

  ngOnDestroy(): void {
    if (this.imageInfoSubscription$) {
      this.imageInfoSubscription$.unsubscribe();
    }
    if (this.imageSrcSubscription$) {
      this.imageSrcSubscription$.unsubscribe();
    }
  }

  public loadImage() {
    console.log('Loading Image');
    console.log(this.id);

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
        index: this.indexParam,
      },
    });
  }

  // set the max dimensions to the original image size
  public onChangeDimensions() {
    this.setMaxDimensions();
    if (this.imageInfo) {
      this.dimensionsChanged.next();
    }
  }

  public setMaxDimensions() {
    if (this.imageInfo) {
      this.width =
        this.width <= this.imageInfo!.width
          ? this.width
          : this.imageInfo!.width;

      if (this.height) {
        this.height =
          this.height <= this.imageInfo!.height
            ? this.height
            : this.imageInfo!.height;

        this.height = this.height > 0 ? this.height : this.width;
      }
    }
  }

  public onChangeImageOptions() {
    this.setMaxDimensions();
    this.loading = true;

    this.imageService.retrieveImage({
      id: this.imageInfo?.id,
      width: this.width ?? this.imageInfo?.width,
      height: this.height,
      blur: this.blur > 0,
      blurValue: this.blur,
      grayscale: this.greyscale,
    });
  }
}
