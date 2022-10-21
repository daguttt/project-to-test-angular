import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-event-binding-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
})
export class ChildComponent {
  @Output() customEvent = new EventEmitter();
  onClick(event: MouseEvent) {
    this.customEvent.emit('Value from ChildComponent');
    console.log({ 'event.isPrimary': (event as PointerEvent).isPrimary });
  }
}
