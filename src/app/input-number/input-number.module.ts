import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputNumberRoutingModule } from './input-number-routing.module';
import { InputNumberComponent } from './input-number.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InputNumberComponent],
  imports: [CommonModule, InputNumberRoutingModule, ReactiveFormsModule],
})
export class InputNumberModule {}
