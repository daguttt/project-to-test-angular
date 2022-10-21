import { Injectable } from '@angular/core';
import { Reporter } from '../interfaces/reporter.interface';

@Injectable()
export class BrowserReporterService implements Reporter {
  constructor() {}

  report(): void {
    const browserStatus = `
      Browser height: ${window.innerHeight}.
      Browser width: ${window.innerWidth}.
    `;
    console.log(browserStatus);
  }
}
