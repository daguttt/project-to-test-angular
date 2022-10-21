import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultipleProvidersRoutingModule } from './multiple-providers-routing.module';
import { MultipleProvidersComponent } from './multiple-providers.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomInterceptorInterceptor } from './interceptors/custom-interceptor.interceptor';

@NgModule({
  declarations: [MultipleProvidersComponent],
  imports: [CommonModule, HttpClientModule, MultipleProvidersRoutingModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptorInterceptor,
      multi: true, // -> false === 'regular provider' -> Error: Cannot mix multi providers and regular providers
    },
  ],
})
export class MultipleProvidersModule {}
