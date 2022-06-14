import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSwitchComponent } from './toggle-switch.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [ToggleSwitchComponent],
  exports: [ToggleSwitchComponent],
})
export class ToggleSwitchModule {}
