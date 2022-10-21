import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventBindingComponent } from './event-binding.component';

const routes: Routes = [
  {
    path: '',
    component: EventBindingComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventBindingRoutingModule {}
