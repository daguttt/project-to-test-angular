import { formatNumber } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, map, Subscription, withLatestFrom } from 'rxjs';

import {
  InputChangeMetadata,
  InputType,
  InputTypeMap,
  ValidInputValue,
} from './types/types';

import { UpdateCursorPositionStrategy } from './update-cursor-position-strategies/interface/update-cursor-position-strategy.interface';
import { DefaultStrategy } from './update-cursor-position-strategies/default.strategy';
import { DeleteContentForwardStrategy } from './update-cursor-position-strategies/delete-content-forward.strategy';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
})
export class InputNumberComponent implements OnInit, OnDestroy {
  @Input() format: boolean = true;

  inputNumber = new FormControl('');
  // inputNumber = new FormControl('1,234');
  sub!: Subscription;
  strategy: UpdateCursorPositionStrategy = new DefaultStrategy();

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

  constructor() {}

  ngOnInit(): void {
    this.sub = this.inputNumber.valueChanges
      .pipe(
        withLatestFrom(this.inputChangeMetadata$),
        map(([newInputValue, metadata]) =>
          this.preventInvalidCharacters(newInputValue, metadata)
        )
      )
      .subscribe(
        ({ value: validInputValue, metadata }) =>
          this.format && this.formatInputValue(validInputValue, metadata)
      );
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

  private formatInputValue(
    inputValue: string | null,
    metadata: InputChangeMetadata
  ) {
    if (!inputValue || inputValue.endsWith('.')) return;

    const parsedInputValue = parseFloat(inputValue.replace(/,+/g, ''));
    const formattedInputValue = formatNumber(parsedInputValue, 'en', '1.0-2');

    this.inputNumber.setValue(formattedInputValue, {
      emitEvent: false,
    });
    this.updateCursorPosition(metadata);
  }

  private updateCursorPosition(inputChangeMetadata: InputChangeMetadata) {
    const { inputType } = inputChangeMetadata;
    if (!inputType) return;

    const strategiesMap: InputTypeMap = {
      deleteContentForward: new DeleteContentForwardStrategy(),
      deleteContentBackward: new DefaultStrategy(),
      insertText: new DefaultStrategy(),
    };
    this.strategy = strategiesMap[inputType];

    return this.strategy.updateCursorPosition(inputChangeMetadata);
  }

  private preventInvalidCharacters(
    inputValue: string | null,
    metadata: InputChangeMetadata
  ): ValidInputValue {
    if (!inputValue) return { value: inputValue, metadata };

    const { incomingChar, previousValue } = metadata;

    if (incomingChar === null) return { value: inputValue, metadata };

    const isIncomingCharInvalid = /[0-9\.]+/g.test(incomingChar) === false;
    const isIncomingCharNumber = /[0-9]+/.test(inputValue);
    const has3Decimal = /\.\d{3}/g.test(inputValue);
    const isNotAbleToAddPoint = inputValue.split('.').length > 2; // `1234.234.` -> ❌

    const isInvalid =
      isIncomingCharInvalid ||
      (isIncomingCharNumber && has3Decimal) ||
      isNotAbleToAddPoint;

    if (isInvalid) {
      this.inputNumber.setValue(previousValue, { emitEvent: false });
      return { value: previousValue, metadata };
    }
    return { value: inputValue, metadata };
  }
}
