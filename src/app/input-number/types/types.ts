import { UpdateCursorPositionStrategy } from '../update-cursor-position-strategies/interface/update-cursor-position-strategy.interface';

export interface InputChangeMetadata {
  incomingChar: string | null;
  inputType: InputType | null;
  previousValue: string | null;
  oldCursorPosition: number | null;
  $input: HTMLInputElement | null;
}

export const INPUT_TYPES = {
  INSERT_TEXT: 'insertText',
  DELETE_CONTENT_BACKWARD: 'deleteContentBackward',
  DELETE_CONTENT_FORWARD: 'deleteContentForward',
} as const;

export type ObjectValues<T> = T[keyof T];
export type InputType = ObjectValues<typeof INPUT_TYPES>;
export type InputTypeMap = {
  [Key in InputType]: UpdateCursorPositionStrategy;
};

export type ValidInputValue = {
  value: string | null;
  metadata: InputChangeMetadata | null;
};
