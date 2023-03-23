import { PreviousInputState } from '../../types/types';

export interface UpdateCursorPositionStrategy {
  updateCursorPosition(
    $input: HTMLInputElement,
    previousInputState: PreviousInputState | null
  ): void;
}
