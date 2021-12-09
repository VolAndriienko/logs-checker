import { Component, OnInit } from '@angular/core';
import { LocaleConfig } from 'ngx-daterangepicker-material';
import { MainService } from '../../services/main.service';
import { SelectedDateRange } from '../../shared';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  get searchValue(): string {
    return this.mainService.searchValue;
  }

  set searchValue(newValue: string) {
    this.mainService.searchValue = newValue;
  }

  get path(): string {
    return this.mainService.path;
  }

  set path(newValue: string) {
    this.mainService.path = newValue;
  }

  get selected(): SelectedDateRange {
    return this.mainService.selected;
  }

  set selected(newValue: SelectedDateRange) {
    this.mainService.selected = newValue;
  }

  get checkNestedFolders() {
    return this.mainService.checkNestedFolders;
  }

  set checkNestedFolders(newValue: boolean) {
    this.mainService.checkNestedFolders = newValue;
  }

  dateLocale: LocaleConfig = {
    applyLabel: 'Confirm',
    displayFormat: 'DD-MM-YYYY HH:mm',
    separator: '     ...     '
  };

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    //this.mainService.searchLogs();
  }
}
