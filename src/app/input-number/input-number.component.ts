import { formatNumber } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, tap, withLatestFrom } from 'rxjs';

import { InputChangeMetadata, InputType } from './types/types';
import { UpdateCursorPositionStrategy } from './update-cursor-position-strategies/interface/update-cursor-position-strategy.interface';
import { DefaultStrategy } from './update-cursor-position-strategies/default.strategy';
import { DeleteContentForwardStrategy } from './update-cursor-position-strategies/delete-content-forward.strategy';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
})
export class InputNumberComponent implements OnInit, OnDestroy {
  inputNumber = new FormControl('');
  // inputNumber = new FormControl('1,234');
  sub!: Subscription;

  private inputChangeMetadataSubject = new BehaviorSubject<InputChangeMetadata>(
    {
      $input: null,
      previousValue: null,
      inputType: null,
      incomingChar: null,
      oldCursorPosition: null,
    }
  );
  inputChangeMetadata$ = this.inputChangeMetadataSubject.asObservable();

  strategy: UpdateCursorPositionStrategy = new DefaultStrategy();
  constructor() {}

  ngOnInit(): void {
    this.sub = this.inputNumber.valueChanges
      .pipe(
        withLatestFrom(this.inputChangeMetadata$),
        tap(([newInputValue, metadata]) =>
          this.preventNotNumericCharacters(newInputValue, metadata)
        )
      )
      .subscribe(([, metadata]) => this.updateCursorPosition(metadata));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onBeforeInput(e: InputEvent, target: HTMLInputElement) {
    // console.log({ event: e, inputType: e.inputType });
    this.inputChangeMetadataSubject.next({
      $input: target,
      incomingChar: e.data,
      inputType: e.inputType as InputType,
      oldCursorPosition: target.selectionStart,
      previousValue: this.inputNumber.value,
    });
  }

  private isAbleToAddDecimals(inputValue: string): boolean {
    const hasNot3Decimals = /\.\d{3}/g.test(inputValue) === false;
    const hasOnePointDecimalChar = inputValue.split('.').length < 3; // `1234.234.` -> ❌
    // console.log({
    //   hasOnePointDecimalChar,
    //   hasNot3Decimals,
    // });
    return hasOnePointDecimalChar && hasNot3Decimals;
  }

  private formatInputValue(inputValue: string) {
    const parsedInputValue = parseFloat(inputValue.replace(/,+/g, ''));
    const formattedInputValue = formatNumber(parsedInputValue, 'en', '1.0-2');

    // console.log({ inputValue, parsedInputValue, formattedInputValue });
    this.inputNumber.setValue(formattedInputValue, {
      emitEvent: false,
    });
  }

  private updateCursorPosition(inputChangeMetadata: InputChangeMetadata) {
    // console.log('hello');
    const { inputType } = inputChangeMetadata;
    const strategiesMap: { [key: string]: UpdateCursorPositionStrategy } = {
      deleteContentForward: new DeleteContentForwardStrategy(),
    };
    this.strategy =
      strategiesMap[inputType ?? 'insertText'] ?? new DefaultStrategy();
    // console.log({ strategy: this.strategy });
    return this.strategy.updateCursorPosition(inputChangeMetadata);
  }

  private preventNotNumericCharacters(
    inputValue: string | null,
    metadata: InputChangeMetadata
  ) {
    if (!inputValue) return;

    const { incomingChar, previousValue } = metadata;

    // Validate incoming character
    const isIncomingCharValid =
      incomingChar === null || /[0-9\.]+/g.test(incomingChar);

    // Validate decimals
    const isAbleToAddDecimals = this.isAbleToAddDecimals(inputValue);
    const isAddingDecimals =
      inputValue.endsWith('.') || inputValue.endsWith('.0');
    if (isAbleToAddDecimals && isAddingDecimals) return;

    if (!isIncomingCharValid || !isAbleToAddDecimals) {
      return this.inputNumber.setValue(previousValue, {
        emitEvent: false,
      });
    }
    this.formatInputValue(inputValue);
  }
}
