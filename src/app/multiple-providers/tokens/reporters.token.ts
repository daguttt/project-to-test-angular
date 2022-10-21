import { InjectionToken } from '@angular/core';
import { Reporter } from '../interfaces/reporter.interface';

export const REPORTERS = new InjectionToken<Reporter[]>('Repoters');
