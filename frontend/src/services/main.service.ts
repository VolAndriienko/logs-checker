import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import * as moment from 'moment';
import { ReplaySubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LogsResponseMessage, SelectedDateRange } from '../shared';

@Injectable()
export class MainService {
  isLoading = false;
  searchedResultsFiles: string[] = [];
  searchedResults: { [filName: string]: string[] } = {};
  searchedNestedFolders: string[] = [];

  checkNestedFolders = true;
  searchValue = '';
  path = 'C:/Users/Volodya/Desktop/Access/My/logs-checker/logs';
  selected: SelectedDateRange = {
    startDate: moment().add(-100, 'day'),
    endDate: moment()
  };

  searchFinished = new ReplaySubject<void>();
  searchStarted = new ReplaySubject<void>();

  get query(): string {
    const { path, from, to } = this;
    return `http://localhost:8081/api?directory=${path}&from=${from}&to=${to}&checkNestedFolders=${this.checkNestedFolders}&searchValue=${this.searchValue}`;
  }

  get from() {
    return this.selected.startDate.toISOString();
  }

  get to() {
    return this.selected.endDate.toISOString();
  }

  constructor(private httpClient: HttpClient) {}

  searchLogs(): Subscription {
    this.searchStarted.next();
    this.isLoading = true;

    return this.httpClient.get(this.query)
      .pipe(map(response => (response as any).message as LogsResponseMessage))
      .subscribe(response => {
        this.searchedResults = response.results;
        this.searchedNestedFolders = response.folders;
        this.searchedResultsFiles = Object.keys(this.searchedResults);
        this.searchFinished.next();
      })
      .add(() => this.isLoading = false);
  }
}
