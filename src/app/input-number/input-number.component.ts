import { formatNumber } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PreviousInputState } from './types/types';

import { UpdateCursorPositionStrategy } from './update-cursor-position-strategies/interface/update-cursor-position-strategy.interface';
import { DefaultStrategy } from './update-cursor-position-strategies/default.strategy';
import {
  DeleteContentForwardStrategy,
  FORWARD_STRATEGY_KEY,
} from './update-cursor-position-strategies/delete-content-forward.strategy';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
})
export class InputNumberComponent {
  @Input() format: boolean = true;

  inputNumber = new FormControl('');
  allowedPressedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];
  strategy: UpdateCursorPositionStrategy = new DefaultStrategy();

  private previousInputState: PreviousInputState | null = null;

  constructor() {}

  preventInvalidCharacters(e: KeyboardEvent, $input: HTMLInputElement) {
    const inputValue = $input.value;
    if (inputValue === null) return;

    this.previousInputState = {
      incomingChar: e.key,
      previousValue: $input.value,
      oldCursorPosition: $input.selectionStart,
    };

    if (this.allowedPressedKeys.includes(e.key)) return;

    const isIncomingKeyInvalid = /[0-9\.]+/g.test(e.key) === false;

    const isIncomingKeyNumber = /[0-9]+/.test(e.key);
    const inputValueHas2Decimals = /\.\d{2}/g.test(inputValue);

    const isAddingAnotherPoint = inputValue.includes('.') && e.key === '.';

    const isInvalid =
      isAddingAnotherPoint ||
      (isIncomingKeyNumber && inputValueHas2Decimals) ||
      isIncomingKeyInvalid;

    if (isInvalid) e.preventDefault(); // Not fire 'input' event
  }

  onInput($input: HTMLInputElement) {
    this.format && this.formatInputValue($input, this.previousInputState);
    this.previousInputState = null;
  }

  private formatInputValue(
    $input: HTMLInputElement,
    previousInputState: PreviousInputState | null
  ) {
    const inputValue = $input.value;

    const notNeedToFormat =
      !inputValue || inputValue.endsWith('.') || inputValue.endsWith('.0');
    if (notNeedToFormat) return;

    const parsedInputValue = parseFloat(inputValue.replace(/,+/g, ''));
    const formattedInputValue = formatNumber(parsedInputValue, 'en', '1.0-2');
    this.inputNumber.setValue(formattedInputValue);

    this.updateCursorPosition($input, previousInputState);
  }

  private updateCursorPosition(
    $input: HTMLInputElement,
    previousInputState: PreviousInputState | null
  ) {
    this.strategy =
      previousInputState?.incomingChar === FORWARD_STRATEGY_KEY
        ? new DeleteContentForwardStrategy()
        : new DefaultStrategy();

    return this.strategy.updateCursorPosition($input, previousInputState);
  }
}
