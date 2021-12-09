import { HttpStatusCode } from "./shared.types";
import { Response } from 'express';

interface HelperFunctions {
  log: (data: any) => any;
  error: (err: any, prefixMessage: string) => never | void;
  dbStatusLog: (database: string, err: Error | undefined) => any;
  sendMessage: (res: Response, message: any, status?: HttpStatusCode) => Response;
}

const helper: HelperFunctions = {
  log: (data: any) => console.log(JSON.stringify(data)),
  error: (err: any, prefixMessage: string) => {
    if (err) {
      throw new Error(prefixMessage + '\n' + err.message);
    }
  },
  dbStatusLog: (database: string, err: Error | undefined = undefined) => {
    console.log((err
      ? 'Cannot connect to the database: '
      : 'Connected to the database: ')
      + database);

    if (err) {
      console.log(err.message);
      //throw new Error(err.message);
    }
  },
  sendMessage: (res: Response, message: any, status: HttpStatusCode = HttpStatusCode.InternalServerError) => 
    res.status(status).send({ message })
};

export {
  helper
};