import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildComponent } from './child/child.component';
import { EventBindingComponent } from './event-binding.component';
import { InputComponent } from './input/input.component';
import { EventBindingRoutingModule } from './event-binding-routing.module';

@NgModule({
  declarations: [EventBindingComponent, ChildComponent, InputComponent],
  imports: [CommonModule, EventBindingRoutingModule],
  exports: [ChildComponent],
})
export class EventBindingModule {}
