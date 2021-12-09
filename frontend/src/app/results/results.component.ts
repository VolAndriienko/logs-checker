import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  isPreviousAvailable = false;
  isNextAvailable = false;
  searchValue = '';

  from = 0;
  to = 0;
  totalResults = 0;

  totalPages = 0;

  readonly perPageOptions = [5, 10, 20, 50];
  currentPerPage = 5;
  currentPage = 1;
  currentResults: string[] = [];

  totalFound = 0;

  currentFile = '';
  currentFolder = '';
  currentFolderFiles: string[] = [];
  currentFolderResults: string[] = []

  allResults: { [fileName: string]: string[] } = {};

  allFolders: string[] = [];
  allFoldersFiles: string[] = [];

  allFiles: string[] = [];

  folderResultCountsMap: { [folder: string]: number } = {};
  fileResultCountsMap: { [file: string]: number } = {};

  dataSource: string[] = [];

  get isAnyData() {
    return this.totalFound > 0;
  }

  get currentFileResults() {
    return this.allResults[this.currentFile] || [];
  }

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.currentFolderFiles = this.mainService.searchedResultsFiles;
    this.allResults = this.mainService.searchedResults;

    this.allFolders = this.mainService.searchedNestedFolders;
    this.allFiles = Object.keys(this.allResults);
    this.currentFolderFiles = this.getFolderFiles(this.currentFolder);


    this.allFiles.forEach(file => this.fileResultCountsMap[file] = this.getCountResultsInFile(file));
    this.totalFound = Object.values(this.fileResultCountsMap).reduce((a, b) => a += b, 0);

    this.allFolders.map(folder => {
      this.folderResultCountsMap[folder] = this.getFolderFiles(folder).
        map(file => this.getCountResultsInFile(file)).reduce((a, b) => a += b, 0);
    });

    if (this.allFiles.length) {
      this.selectFile(this.allFiles[0]);
    }
  }

  getCountResultsInFile(file: string) {
    return (this.allResults[file] || []).length;
  }

  getFolderFiles(folder: string): string[] {
    return this.allFiles.filter(fileName => fileName.startsWith(folder));
  }

  setCurrentFolder(folder: string) {
    this.currentFolder = folder;
    this.currentFolderFiles = this.getFolderFiles(folder);
    if (!this.currentFolderFiles.includes(this.currentFile)) {
      this.selectFile(this.currentFolderFiles[0]);
    }
  }

  selectFile(file: string) {
    this.currentFile = file;
    this.openResults();
  }

  openResults() {
    this.currentPage = 1;
    this.dataSource = !this.searchValue ?
      this.currentFileResults :
      this.currentFileResults.filter(textLine => textLine
        .toLowerCase()
        .indexOf(this.searchValue.toLowerCase()) !== -1);

    this.totalResults = this.dataSource.length;
    this.openCurrentPage();
  }

  openCurrentPage() {
    this.from = (this.currentPage - 1) * this.currentPerPage + 1;
    this.to = this.from + this.currentPerPage - 1;

    if (this.to > this.totalResults) {
      this.to = this.totalResults;
    }

    if (this.from > this.totalResults) {
      this.from = this.totalResults;
    }
    
    this.currentResults = this.dataSource.slice(this.from - 1, this.to);
    
    this.totalPages = Math.ceil(this.totalResults / this.currentPerPage);

    this.isPreviousAvailable = this.currentPage !== 1 && this.totalFound > 0;
    this.isNextAvailable = this.currentPage < this.totalPages && this.totalFound > 0;
  }

  changePerPage(perPage: number) {
    this.currentPerPage = perPage;
    this.currentPage = 1;
    this.openCurrentPage();
  }

  clickPrevious() {
    if (this.isPreviousAvailable) {
      this.currentPage--;
      this.openCurrentPage();
    }
  }

  clickNext() {
    if (this.isNextAvailable) {
      this.currentPage++;
      this.openCurrentPage();
    }
  }

  search(event: Event) {
    this.searchValue = (event.target as HTMLInputElement)?.value || '';
    this.openResults();
  }

  reload() {
    this.mainService.searchLogs().add(() => this.ngOnInit())
  }
}
