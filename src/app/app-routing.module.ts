import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

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
    path: '',
    component: HomePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
