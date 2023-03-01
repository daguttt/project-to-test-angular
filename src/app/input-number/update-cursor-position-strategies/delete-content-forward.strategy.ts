import { InputChangeMetadata } from '../types/types';
import { UpdateCursorPositionStrategy } from './interface/update-cursor-position-strategy.interface';

export class DeleteContentForwardStrategy
  implements UpdateCursorPositionStrategy
{
  updateCursorPosition(inputChangeMetadata: InputChangeMetadata): void {
    const { $input, oldCursorPosition, previousValue } = inputChangeMetadata;

    // console.log({
    //   $input,
    //   selectionStart: $input?.selectionStart,
    //   selectionEnd: $input?.selectionEnd,
    //   previousValue,
    //   oldCursorPosition,
    // });
    if (
      !$input ||
      !$input?.selectionStart ||
      !$input?.selectionEnd ||
      !previousValue ||
      oldCursorPosition === null
    )
      return;

    // Reset cursor position
    $input.selectionStart = $input.value.length;
    $input.selectionEnd = $input.value.length;

    let reverseCursorPosition: number =
      previousValue.length - oldCursorPosition - 1;

    console.log({
      previousValue: previousValue.length,
      oldCursorPosition,
      baseReverseCursorPosition: reverseCursorPosition,
    });

    /**
     * If not enough reverse positions.
     * Example:
     * ( '|' => Cursor position)
     *
     * `"|2,342 -> 242"`
     *
     * Once "2" is deleted `reverseCursorPosition` is gonna be 4 (",342"  4).
     *  But new value's length is 3. So that's when we need 1 less reverse position
     */
    const isInvalidNewCursorPosition: boolean =
      $input.selectionStart - reverseCursorPosition === -1;

    if (isInvalidNewCursorPosition) reverseCursorPosition -= 1;

    console.log({ updatedReverseCursorPosition: reverseCursorPosition });

    // console.table({
    //   isInvalidNewCursorPosition,
    //   previousInputValueLength: previousValue.length,
    //   currentInputValueLength: $input.value.length,
    //   defaultCursorPosition: $input.selectionStart,
    //   oldCursorPosition,
    //   reverseCursorPosition: reverseCursorPosition,
    //   newCursorPosition: `${$input.selectionStart - reverseCursorPosition}`,
    // });

    $input.selectionStart -= reverseCursorPosition;
    $input.selectionEnd -= reverseCursorPosition;
  }
}
