import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultipleProvidersRoutingModule } from './multiple-providers-routing.module';
import { MultipleProvidersComponent } from './multiple-providers.component';


@NgModule({
  declarations: [
    MultipleProvidersComponent
  ],
  imports: [
    CommonModule,
    MultipleProvidersRoutingModule
  ]
})
export class MultipleProvidersModule { }
