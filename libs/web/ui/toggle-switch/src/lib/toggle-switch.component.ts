import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'stackblitz-nx-angular-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent {
  @Input() checked = false;
  @Output() onCheck: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  changeChecked() {
    this.onCheck.emit(this.checked);
  }
}
