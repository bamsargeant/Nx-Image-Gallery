import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
} from '@angular/animations';

import {
  ImageService,
  ImageInfo,
} from '@stackblitz-nx-angular/web/data-access';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        stagger(
          '250ms',
          animate(
            '1200ms ease-out',
            style({ opacity: 1, transform: 'translateY(0%)' })
          )
        ),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        animate(
          '400ms ease-out',
          style({ opacity: 0, transform: 'translateY(100%)' })
        ),
      ],
      {
        optional: true,
      }
    ),
  ]),
]);

@Component({
  selector: 'stackblitz-nx-angular-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  animations: [listAnimation],
})
export class ImageGalleryComponent implements OnInit, OnDestroy {
  public imageList: Array<ImageInfo> = [];

  public imageListSubscription$!: Subscription;

  public loading = true;

  private loadMoreCounter = 0;
  public page = 1;
  public limit = 5;
  public thumbnailWidth = 419;
  public thumbnailHeight = 280;
  public appendImages = false;

  public limitOptions = [3, 5, 10, 25, 100];
  public pageOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.imageListSubscription$ = this.imageService.imageList$.subscribe(
      (e) => {
        // continuously add to the list
        if (this.appendImages) {
          this.imageList.push(...e);
        } else {
          this.imageList = e;
          this.appendImages = true;
        }

        this.imageList = this.imageList.sort((a, b) =>
          a.id.localeCompare(b.id)
        );

        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    const pageParam = Number(this.route.snapshot.queryParamMap.get('page'));
    if (pageParam) this.page = pageParam;

    const limitParam = Number(this.route.snapshot.queryParamMap.get('limit'));
    if (limitParam) this.limit = limitParam;

    const loadMoreCounterParam = Number(
      this.route.snapshot.queryParamMap.get('load')
    );
    if (loadMoreCounterParam) this.loadMoreCounter = loadMoreCounterParam;

    this.loadImages(false, 0);
  }

  ngOnDestroy(): void {
    if (this.imageListSubscription$) {
      this.imageListSubscription$.unsubscribe();
    }
  }

  public viewImage(imageInfo: any) {
    console.log('View Image');
    this.imageService.inspectImage(imageInfo);
    this.router.navigate(['/', imageInfo.id], {
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: this.loadMoreCounter,
      },
    });
  }

  public loadImages(
    appendImages: boolean = false,
    loadCount: number = this.loadMoreCounter
  ) {
    this.loading = true;

    this.appendImages = appendImages;

    for (let index = loadCount; index <= this.loadMoreCounter; index++) {
      this.imageService.retrieveList(
        this.thumbnailWidth,
        this.thumbnailHeight,
        this.page + index,
        this.limit
      );
    }
  }

  public loadMore() {
    this.loadMoreCounter++;
    this.loadImages(true);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: this.loadMoreCounter,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  public next() {
    this.imageList = [];
    this.page += this.loadMoreCounter + 1;
    this.loadMoreCounter = 0;
    this.loadImages(false, 0);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: this.loadMoreCounter,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  public previous() {
    if (this.page > 1) {
      this.imageList = [];
      this.page--;
    }
    this.loadMoreCounter = 0;

    this.loadImages(false, 0);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: this.loadMoreCounter,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  public onChangeLimit(newLimit: number) {
    this.limit = newLimit;
    this.loadImages(false, 0);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: this.loadMoreCounter,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  public onChangePage(newPage: number) {
    this.page = newPage;
    this.loadImages(false, 0);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: this.loadMoreCounter,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }
}
