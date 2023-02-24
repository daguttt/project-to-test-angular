import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
  providers: [DecimalPipe],
})
export class InputNumberComponent implements OnInit, OnDestroy {
  inputNumber = new FormControl('');
  sub!: Subscription;

  private beforeInputDataSubject = new BehaviorSubject<BeforeInputData>({
    previousValue: '',
    incomingChar: '',
  });
  beforeInputData$ = this.beforeInputDataSubject.asObservable();

  constructor(private decimalPipe: DecimalPipe) {}

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
    0: inputValue,
    1: { incomingChar, previousValue },
  }: [string | null, BeforeInputData]) {
    if (!inputValue) return;

    const deletingCharacters = incomingChar === null;
    if (deletingCharacters) return;

    const isValidToAddDecimals =
      inputValue.endsWith('.') || inputValue.endsWith('.0');
    const hasOnePointDecimalChar = inputValue.split('.').length < 3; // `1234.234.` -> ❌
    if (isValidToAddDecimals && hasOnePointDecimalChar) return;

    const isIncomingCharValid = /[0-9\.]+/g.test(incomingChar);
    if (isIncomingCharValid && hasOnePointDecimalChar) {
      const parsedInputValue = parseFloat(inputValue.replace(/,+/g, ''));
      const formattedInputValue = this.decimalPipe.transform(
        parsedInputValue,
        '1.0-2'
      );

      // console.log({ inputValue, parsedInputValue, formattedInputValue });
      return this.inputNumber.setValue(formattedInputValue, {
        emitEvent: false,
      });
    }

    this.inputNumber.setValue(previousValue, {
      emitEvent: false,
    });
  }
}

interface BeforeInputData {
  previousValue: string;
  incomingChar: string | null;
}
