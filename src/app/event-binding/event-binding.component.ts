import { Component } from '@angular/core';

@Component({
  selector: 'app-event-binding',
  templateUrl: './event-binding.component.html',
})
export class EventBindingComponent {
  onCustomEvent(value: string) {
    console.log(value);
    window.alert('Custom event emitted!');
  }
}
