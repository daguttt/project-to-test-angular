import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultipleProvidersComponent } from './multiple-providers.component';

const routes: Routes = [
  {
    path: '',
    component: MultipleProvidersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultipleProvidersRoutingModule {}
