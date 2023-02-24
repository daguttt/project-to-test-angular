import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
})
export class InputNumberComponent implements OnInit, OnDestroy {
  inputNumber = new FormControl('');
  sub!: Subscription;

  private beforeInputDataSubject = new BehaviorSubject<BeforeInputData>({
    previousValue: '',
    incomingChar: '',
  });
  beforeInputData$ = this.beforeInputDataSubject.asObservable();

  constructor() {}

  ngOnInit(): void {
    this.inputNumber.valueChanges
      .pipe(withLatestFrom(this.beforeInputData$))
      .subscribe((...args) => this.preventNotNumericCharacters(...args));
  }

  onBeforeInput(e: InputEvent) {
    this.beforeInputDataSubject.next({
      previousValue: this.inputNumber.value ?? '',
      incomingChar: e.data,
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private preventNotNumericCharacters({
    // 0: inputChange,
    1: { incomingChar, previousValue },
  }: [string | null, BeforeInputData]) {
    const deletingCharacters = incomingChar === null;
    if (deletingCharacters) return;

    const isIncomingCharValid = /[0-9]+/g.test(incomingChar);
    if (isIncomingCharValid) return;

    this.inputNumber.setValue(previousValue, {
      emitEvent: false,
    });
  }
}

interface BeforeInputData {
  previousValue: string;
  incomingChar: string | null;
}
