import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'event-binding',
    loadChildren: () =>
      import('./event-binding/event-binding.module').then(
        (m) => m.EventBindingModule
      ),
  },
  {
    path: 'multiple-providers',
    loadChildren: () =>
      import('./multiple-providers/multiple-providers.module').then(
        (m) => m.MultipleProvidersModule
      ),
  },
  {
    path: 'input-number',
    loadChildren: () =>
      import('./input-number/input-number.module').then(
        (m) => m.InputNumberModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
