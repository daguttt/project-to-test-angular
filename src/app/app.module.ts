import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventBindingModule } from './event-binding/event-binding.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, EventBindingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
