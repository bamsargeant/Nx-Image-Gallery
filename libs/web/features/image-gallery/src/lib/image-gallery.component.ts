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
  animateChild,
} from '@angular/animations';
import { ViewportScroller } from '@angular/common';

import {
  ImageService,
  ImageInfo,
} from '@stackblitz-nx-angular/web/data-access';

// Define the list item enter animation
const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        stagger(
          '100ms',
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
        animateChild(),
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
  public queryParamMap$!: Subscription;

  public loading = true;
  public scrolling = false;

  private loadMoreCounter = 0;
  public page = 1;
  public limit = 5;
  public thumbnailWidth = 419;
  public thumbnailHeight = 280;
  public appendImages = false;

  public scrollToIndexUpdated = false;
  public scrollToElementIndex = 0;
  public indexParam = 0;

  public limitOptions = [3, 5, 10, 25, 100];
  public pageOptions = Array.from({ length: 10 }, (v, k) => k + 1);

  constructor(
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller
  ) {
    this.imageListSubscription$ = this.imageService.imageList$.subscribe(
      (e) => {
        // continuously add to the list
        if (this.appendImages) {
          this.scrollToElementIndex = this.imageList.length;
          this.imageList.push(...e);
        }
        // reset the list and repopulate
        else {
          this.scrollToElementIndex = 0;
          this.imageList = e;
          this.appendImages = true;
        }

        if (this.imageList.length == 0) {
          this.previous();
          return;
        }

        // when coming back from a view image page, the list items can be unordered due to async
        // reorder the list
        this.imageList = this.imageList.sort((a, b) =>
          a.id.localeCompare(b.id)
        );

        this.loading = false;

        // scroll to the selected item
        if (this.scrollToIndexUpdated && this.scrollToElementIndex > 0) {
          this.scrollToElement(this.scrollToElementIndex);
        }
      }
    );
  }

  setPageOptions(count: number) {
    this.pageOptions = Array.from({ length: count }, (v, k) => k + 1);
  }

  // scroll to a defined item
  scrollToElement(index: number | string) {
    if (!this.scrolling) {
      this.scrolling = true;

      setTimeout(() => {
        this.viewportScroller.scrollToAnchor('image-card-' + index.toString());
        this.scrolling = false;
      }, 1000);
    }
  }

  ngOnInit(): void {
    // constantly listen to param changes
    this.queryParamMap$ = this.route.queryParamMap.subscribe(
      (queryParamMap) => {
        const pageParam = Number(queryParamMap.get('page'));
        if (pageParam) this.page = pageParam;

        const limitParam = Number(queryParamMap.get('limit'));
        if (limitParam) this.limit = limitParam;

        const loadMoreCounterParam = Number(queryParamMap.get('load'));
        if (loadMoreCounterParam) this.loadMoreCounter = loadMoreCounterParam;

        this.loadImages(false, true, 0);

        const indexParam = Number(queryParamMap.get('index'));
        if (indexParam) {
          this.scrollToElementIndex = indexParam;
          this.scrolling = false;
          this.scrollToElement(indexParam);
        }
      }
    );
  }

  ngOnDestroy(): void {
    // free up memory by unsubscribing
    // note: angular does this automatically for most subscriptions
    if (this.imageListSubscription$) {
      this.imageListSubscription$.unsubscribe();
    }
    if (this.queryParamMap$) {
      this.queryParamMap$.unsubscribe();
    }
  }

  // select an image to view
  public viewImage(imageInfo: any, index: number) {
    this.imageService.inspectImage(imageInfo);
    this.router.navigate(['/', imageInfo.id], {
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: this.loadMoreCounter,
        index: index,
      },
    });
  }

  // trigger the image service to get images
  public loadImages(
    appendImages: boolean = false,
    loading: boolean = true,
    loadCount: number = this.loadMoreCounter
  ) {
    this.loading = loading;

    this.appendImages = appendImages;

    // loop through the load more counter to get all the images when coming back from the view image page
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
    this.scrollToIndexUpdated = true;
    this.loadMoreCounter++;
    this.loadImages(true, false);
    this.appendImages = true;

    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     page: this.page,
    //     limit: this.limit,
    //     load: this.loadMoreCounter,
    //     index: this.scrollToElementIndex,
    //   },
    //   queryParamsHandling: 'merge', // remove to replace all query params by provided
    // });
  }

  public next() {
    const currentPage = this.page;
    // add the load more counter to the page count so the user doesnt see the same images
    this.page += this.loadMoreCounter + 1;

    if (
      this.page > Math.max(...this.pageOptions) &&
      this.imageList.length != 0
    ) {
      this.setPageOptions(this.page);
    } else if (this.imageList.length == 0) {
      this.page = currentPage;
      this.setPageOptions(this.page);
      return;
    }

    this.loadMoreCounter = 0;
    // this.loadImages(false, true, 0);
    this.appendImages = false;
    this.scrollToElementIndex = 0;

    this.imageList = [];

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: this.loadMoreCounter,
        index: this.scrollToElementIndex,
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
    this.scrollToElementIndex = 0;

    // this.loadImages(false, true, 0);
    this.appendImages = false;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: this.loadMoreCounter,
        index: this.scrollToElementIndex,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  // manually change the limit dropdown
  public onChangeLimit(newLimit: number) {
    this.limit = newLimit;
    // this.loadImages(false, true, 0);
    this.appendImages = false;
    this.loadMoreCounter = 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: 0,
        index: 0,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  public onChangePage(newPage: number) {
    this.page = newPage;
    // this.loadImages(false, true, 0);
    this.appendImages = false;
    this.loadMoreCounter = 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        load: 0,
        index: 0,
      },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  public onItemFocus(imageInfo: Partial<ImageInfo>) {
    imageInfo.focused = true;
  }

  public offItemFocus(imageInfo: Partial<ImageInfo>) {
    imageInfo.focused = false;
  }
}
