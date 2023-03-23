import { PreviousInputState } from '../types/types';
import { UpdateCursorPositionStrategy } from './interface/update-cursor-position-strategy.interface';

export class DefaultStrategy implements UpdateCursorPositionStrategy {
  updateCursorPosition(
    $input: HTMLInputElement,
    { oldCursorPosition, previousValue }: PreviousInputState
  ): void {
    if (
      !$input ||
      !$input?.selectionStart ||
      !$input?.selectionEnd ||
      !previousValue ||
      oldCursorPosition === null
    )
      return;

    const notNeedToUpdate = oldCursorPosition === previousValue.length;
    if (notNeedToUpdate) return;

    // Reset cursor position
    $input.selectionStart = $input.value.length;
    $input.selectionEnd = $input.value.length;

    // In case of deleting the comma (`,`) character
    let offsetForComma = 0;
    const previousCharacterOnPreviousValue = previousValue.substring(
      oldCursorPosition - 1,
      oldCursorPosition
    );
    if (previousCharacterOnPreviousValue === ',') offsetForComma = 1;

    let reverseCursorPosition: number =
      previousValue.length - (oldCursorPosition - offsetForComma);

    /**
     * If not enough reverse positions when deleting.
     * Example:
     * ( '|' => Cursor position)
     *
     * `"2|,342 -> 342"`
     */
    const isInvalidNewCursorPosition: boolean =
      $input.selectionStart - reverseCursorPosition === -1;

    if (isInvalidNewCursorPosition) reverseCursorPosition -= 1;

    // console.table({
    //   isInvalidNewCursorPosition,
    //   previousInputValueLength: previousValue.length,
    //   currentInputValueLength: $input.value.length,
    //   offsetForCommaChar: offsetForComma,
    //   oldCursorPosition,
    //   currentCursorPosition: $input.selectionStart,
    //   reverseCursorPosition,
    //   newCursorPosition: $input.selectionStart - reverseCursorPosition,
    // });

    $input.selectionStart -= reverseCursorPosition;
    $input.selectionEnd -= reverseCursorPosition;
  }
}
