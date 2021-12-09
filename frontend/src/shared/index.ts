import { Moment } from 'moment';

export interface SelectedDateRange {
  startDate: Moment,
  endDate: Moment
}

export interface LogsResponseMessage {
  errors?: string[];
  results: { [filename: string]: string[] };
  folders: string[];
}
