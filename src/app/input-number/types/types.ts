export interface InputChangeMetadata {
  incomingChar: string | null;
  previousValue: string | null;
  oldCursorPosition: number | null;
  $input: HTMLInputElement | null;
}
