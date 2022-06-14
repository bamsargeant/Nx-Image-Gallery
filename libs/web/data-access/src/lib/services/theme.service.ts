import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { dark, light, Theme } from '@stackblitz-nx-angular/web/data-access';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public activeThemeName: string | undefined = undefined;
  private theme$ = new BehaviorSubject<Theme | undefined>(undefined);
  private availableThemes: Theme[] = [light, dark];
  private elementRef!: ElementRef;
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private domSanitizer: DomSanitizer
  ) {
    this.renderer = this.rendererFactory.createRenderer(this.elementRef, null);

    // listen to the theme observable and update the css variables as they come in
    this.theme$.subscribe((themeData: Theme | undefined) => {
      if (themeData) {
        this.activeThemeName = themeData.name;
        this.parseThemeKeys(
          themeData.properties,
          (key: string, value: string) => {
            this.injectVariable(key, value);
          }
        );
      }
    });
  }

  // since this is inside a lib, load the element ref from the main project (app.component)
  public loadElementRef(elemRef: ElementRef) {
    this.elementRef = elemRef;
  }

  // get the theme from the backend
  public loadTheme(themeName: string) {
    // check the theme is available
    const theme = this.availableThemes.find((x) => x.name == themeName);
    if (theme) {
      this.theme$.next(theme);
    } else {
      console.log('Unable to find theme: ' + themeName);
    }
  }

  // loop over every key in theme json
  private parseThemeKeys(json: any, parse: Function) {
    for (const key in json) {
      if (typeof json[key] == 'object' && json[key] != null) {
        this.parseThemeKeys(json[key], parse);
      } else if (Object.prototype.hasOwnProperty.call(json, key)) {
        parse(key, json[key]);
      }
    }
  }

  // sanitize a variable
  private sanitize(variable: string) {
    return this.domSanitizer.sanitize(SecurityContext.STYLE, variable);
  }

  // inject variable into the element ref
  private injectVariable(key: string, value: string) {
    const sanitizedKey = this.sanitize(key);
    const sanitizedValue = this.sanitize(value);

    if (sanitizedKey && sanitizedValue) {
      // Use the Renderer2 to set the style - DOM safer than using the elementRef directly
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        sanitizedKey,
        sanitizedValue,
        RendererStyleFlags2.DashCase
      );
    } else {
      console.error('Unable to inject theme variable');
      console.error('Pre-sanitized key / value  - ' + key + ': ' + value);
      console.log('Unable to sanitize key - ' + sanitizedKey == null);
      console.log('Unable to sanitize value - ' + sanitizedValue == null);
    }
  }
}
