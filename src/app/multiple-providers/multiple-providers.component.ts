import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Reporter } from './interfaces/reporter.interface';
import { BrowserReporterService } from './services/browser-reporter.service';
import { EngagingReporterService } from './services/engaging-reporter.service';
import { REPORTERS } from './tokens/reporters.token';

@Component({
  selector: 'app-multiple-providers',
  templateUrl: './multiple-providers.component.html',
  styles: [],
  providers: [
    {
      provide: REPORTERS,
      useClass: BrowserReporterService,
      multi: true,
    },
  ],
})
export class MultipleProvidersComponent implements OnInit {
  constructor(
    @Inject(REPORTERS) private reporters: ReadonlyArray<Reporter>,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log(this.reporters);

    this.reporters.forEach((reporter) => reporter.report());
    this.http
      .get('https://jsonplaceholder.typicode.com/users')
      .subscribe(console.log);
  }
}
