import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ImageInfo } from '@stackblitz-nx-angular/web/data-access';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'stackblitz-nx-angular-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('hoverTrigger', [
      state(
        'in',
        style({
          transform: 'scale(1.15)',
          zIndex: 9999,
          position: 'relative',
        })
      ),
      state(
        'out',
        style({
          transform: 'scale(1)',
          zIndex: 0,
          position: 'relative',
        })
      ),
      /*
            this transitions has keyframes to controll the in-out speed with offset (time in point from in to out, ) you can also use 
            
            */
      transition(
        'out => in',
        animate(
          '250ms ease-in-out',
          style({ transform: 'scale(1.15)', zIndex: 9999 })
        )
      ),
      transition(
        'in => out',
        animate(
          '250ms ease-in-out',
          style({ transform: 'scale(1)', zIndex: 0 })
        )
      ),
    ]),
  ],
})
export class CardComponent implements OnChanges {
  @Input() path: string | SafeUrl = '';
  @Input() alttext = '';
  @Input() imgInfo: ImageInfo | undefined = undefined;
  @Input() useAnimation: boolean = false;
  @Input() imageLoading: boolean = true;
  @Input() focused: boolean = false;
  @Input() showInfo: boolean = false;

  @Output() click: EventEmitter<any> = new EventEmitter<any>();
  onClick(e: any) {
    this.click.emit(e);
  }

  //animation:
  hoverAnimationState = '';
  hoverStates = {
    mouseEnter: 'in',
    mouseLeave: 'out',
  };

  /** Animations: hostlisteners are used to change the animation states
   * when mouse enters and leaves the card
   */
  @HostListener('mouseenter', ['$event'])
  onOver(event: MouseEvent): void {
    if (this.useAnimation) {
      this.hoverAnimationState = this.hoverStates.mouseEnter;
    } else {
      this.hoverAnimationState = '';
    }
  }

  @HostListener('mouseleave', ['$event'])
  onOut(event: MouseEvent): void {
    if (this.useAnimation) {
      this.hoverAnimationState = this.hoverStates.mouseLeave;
    } else {
      this.hoverAnimationState = '';
    }
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.focused?.currentValue) {
      this.hoverAnimationState = this.hoverStates.mouseEnter;
    } else {
      this.hoverAnimationState = '';
    }
  }
}
