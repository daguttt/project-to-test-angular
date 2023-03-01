import { InputChangeMetadata } from '../../types/types';

export interface UpdateCursorPositionStrategy {
  updateCursorPosition(inputChangeMetadata: InputChangeMetadata): void;
}
