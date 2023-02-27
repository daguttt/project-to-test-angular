import { formatNumber } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, withLatestFrom } from 'rxjs';
import { InputChangeMetadata } from './types/types';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
})
export class InputNumberComponent implements OnInit, OnDestroy {
  inputNumber = new FormControl('');
  sub!: Subscription;

  private inputChangeMetadataSubject = new BehaviorSubject<InputChangeMetadata>(
    {
      $input: null,
      previousValue: null,
      incomingChar: null,
      oldCursorPosition: null,
    }
  );
  inputChangeMetadata$ = this.inputChangeMetadataSubject.asObservable();

  constructor() {}

  ngOnInit(): void {
    this.sub = this.inputNumber.valueChanges
      .pipe(withLatestFrom(this.inputChangeMetadata$))
      .subscribe(([newInputValue, metadata]) =>
        this.preventNotNumericCharacters(newInputValue, metadata)
      );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onBeforeInput(e: InputEvent, target: HTMLInputElement) {
    // console.log({ event: e });
    this.inputChangeMetadataSubject.next({
      $input: target,
      incomingChar: e.data,
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
    const { $input, oldCursorPosition, previousValue } = inputChangeMetadata;

    if (
      !$input ||
      !$input?.selectionStart ||
      !$input?.selectionEnd ||
      !previousValue ||
      !oldCursorPosition
    )
      return;

    // Deleting the comma (`,`) character
    let offsetForCommaChar = 0;
    const previousCharacterOnPreviousValue = previousValue.substring(
      oldCursorPosition - 1,
      oldCursorPosition
    );
    if (previousCharacterOnPreviousValue === ',') offsetForCommaChar = 1;

    let reverseCursorPosition: number =
      previousValue.length - (oldCursorPosition - offsetForCommaChar);

    /**
     * If not enough reverse positions.
     * Example:
     * ( '|' => Cursor position)
     *
     * `"2|,342 -> 342"`
     */
    const isInvalidNewCursorPosition: boolean =
      $input.selectionStart - reverseCursorPosition === -1;

    if (isInvalidNewCursorPosition) reverseCursorPosition -= 1;
    if (previousValue.length === 3 && reverseCursorPosition === 1) return; // ❗ Edge case

    $input.selectionStart -= reverseCursorPosition;
    $input.selectionEnd -= reverseCursorPosition;
  }

  private preventNotNumericCharacters(
    inputValue: string | null,
    metadata: InputChangeMetadata
  ) {
    if (!inputValue) return;

    const { incomingChar, previousValue } = metadata;

    // Validate incoming character
    const deletingCharacters = incomingChar === null;
    const isIncomingCharValid =
      deletingCharacters || /[0-9\.]+/g.test(incomingChar ?? '');

    // Validate decimals
    const isAbleToAddDecimals = this.isAbleToAddDecimals(inputValue);
    const isAddingDecimals =
      inputValue.endsWith('.') || inputValue.endsWith('.0');
    if (isAbleToAddDecimals && isAddingDecimals) return;

    // console.log({
    //   isIncomingCharValid: isIncomingCharValid,
    //   isAbleToAddDecimals,
    // });

    if (!isIncomingCharValid || !isAbleToAddDecimals) {
      return this.inputNumber.setValue(previousValue, {
        emitEvent: false,
      });
    }

    this.formatInputValue(inputValue);
    if (deletingCharacters) this.updateCursorPosition(metadata);
  }
}
