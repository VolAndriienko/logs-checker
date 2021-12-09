import { Component } from '@angular/core';
import { MainService } from '../services/main.service';

const settingsTab = 's' as const;
const resultsTab = 'r' as const;

type Tab = typeof settingsTab | typeof resultsTab;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  get isLoading() {
    return this.mainService.isLoading;
  }

  settingsTab = settingsTab;
  resultsTab = resultsTab;
  currentTab: Tab = this.settingsTab;

  searchFinished = true;

  constructor(
    private mainService: MainService
  ) {
    this.mainService.searchFinished.subscribe(() => {
      this.searchFinished = true;
      this.currentTab = resultsTab;
    });
    this.mainService.searchStarted.subscribe(() => {
      this.currentTab = settingsTab;
      this.searchFinished = false;
    });
  }

  searchLogs() {
    if (this.searchFinished) {
      this.mainService.searchLogs();
    }
  }
}
