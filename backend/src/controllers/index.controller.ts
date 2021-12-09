import { Request, Response } from 'express';
import { HttpStatusCode, ResponseMessage } from '../shared/shared.types';
import { helper } from '../shared/shared.helper';
import { IndexService } from '../services/index.service';

const indexService = new IndexService();

function get(req: Request, res: Response) {
  if (req) {

    const { errors = [], from, to, directory, checkNestedFolders = false, searchValue = '' } = indexService.validate(req);

    if (errors.length) {
      errors.forEach(console.log);
    } else {
      console.log("Directory:", directory);
      console.log("From:", from);
      console.log("To:", to);
      console.log("Include nested:", checkNestedFolders);
    }

    if (errors.length) {
      helper.sendMessage(res, { errors } as ResponseMessage);
    }
    else {
      const result = indexService.process({ from, to, directory, checkNestedFolders, searchValue });
      helper.sendMessage(res, result, HttpStatusCode.Ok);
    }
  }
}



export { get };
