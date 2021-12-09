import { RequestQuery, ResponseMessage, ValidatedRequestQuery } from "../shared/shared.types";
import { Request } from 'express';
import { readdirSync, existsSync, lstatSync, readFileSync } from 'fs';
import { join } from 'path';

export class IndexService {
  validate(req: Request): ValidatedRequestQuery {
    const errors = [];
    let {
      directory: directoryValue,
      from: fromValue = '',
      to: toValue = '',
      checkNestedFolders = false,
      searchValue  = ''
    } = req.query as RequestQuery;
    const from = new Date(fromValue.toString());
    const to = new Date(toValue.toString());
    const directory = directoryValue?.toString();

    if (!directory) {
      errors.push('Directory is not specified');
    }
    else {
      if (['.', '\\', '/'].includes(directory[0])) {
        errors.push('Only absolute directory path can be used');
      } else if (!existsSync(directory)) {
        errors.push('This directory is not exists');
      } else if (!readdirSync('.').length) {
        errors.push('There are no files inside specified directory.');
      }
    }

    if (+from === NaN) {
      errors.push('Start date is not specified or incorrect');
    }

    if (+to === NaN) {
      errors.push('Start date is not specified or incorrect');
    }

    return { errors, directory, from, to, checkNestedFolders, searchValue };
  }

  process({ directory = '', checkNestedFolders = false, from, to, searchValue = '' }: ValidatedRequestQuery, path = ''): ResponseMessage {
    let results: { [filename: string]: string[] } = {};
    let folders: string[] = [];

    if (directory) {
      readdirSync(directory).forEach(entry => {
        const directoryEntry = join(directory, entry);
        const relativeEntryPath = [path, entry].filter(item => item).join('/');

        if (lstatSync(directoryEntry).isDirectory()) {
          folders.push(relativeEntryPath);

          if (checkNestedFolders) {
            const { folders: nestedFolders, results: nestedResults } = this.process({
              directory: directoryEntry,
              checkNestedFolders,
              from,
              to,
              searchValue
            }, relativeEntryPath);

            folders = [...folders, ...nestedFolders];
            results = { ...results, ...nestedResults };
          }
        } else {
          results[relativeEntryPath] = this.processFile({
            fileName: directoryEntry,
            from,
            to,
            searchValue
          });
        }
      });
    }

    return {
      results,
      folders,
    };
  }

  private processFile({ from, to, fileName, searchValue }: { from?: Date, to?: Date, fileName: string, searchValue: string }) {
    const results: string[] = [];
    readFileSync(fileName, 'utf-8')
      .split(/\r?\n/)
      .forEach(line => {
        const date = new Date(line.substring(0, 23).replace(' ', 'T').split(',')[0]);
        if (+date !== NaN &&
          (!from || +from <= +date) &&
          (!to || +to >= +date)
          && line.indexOf('user=,') === -1
          && (!searchValue || line.indexOf(searchValue) !== -1)
        ) {
          results.push(line);
        }
      });

    return results;
  }
}