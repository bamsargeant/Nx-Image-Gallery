export interface ImageUrl {
  id?: string;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  seed?: string;
  grayscale?: boolean;
  blur?: boolean;
  blurValue?: number;
  type?: ImageType;
  info?: boolean;
  random?: string;
}

export enum ImageType {
  JPG = '.jpg',
  WEBP = '.webp',
  // PNG = '.png',
  // TIFF = '.tiff',
}
