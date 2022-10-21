import { Component } from '@angular/core';

@Component({
  selector: 'app-event-binding-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  currentItem = {
    name: '',
  };
  getValue(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }
  logInputValue(): void {
    console.log(`Value: ${this.currentItem.name}`);
  }
}
