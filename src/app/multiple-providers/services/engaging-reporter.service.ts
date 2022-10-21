import { Injectable } from '@angular/core';
import { Reporter } from '../interfaces/reporter.interface';

@Injectable()
export class EngagingReporterService implements Reporter {
  constructor() {}

  report(): void {
    console.log('User ... has been for ... in the page');
  }
}
