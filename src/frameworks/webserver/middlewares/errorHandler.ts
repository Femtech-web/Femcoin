import { Request, Response, NextFunction } from 'express';

const sendError = (err: Error, req: Request, res: Response) => {
  if (req.originalUrl.startsWith('/api')) {
    console.log('ERROR:', err);
    return res.status(400).json({
      message: 'Something went wrong!',
      error: err.message,
    });
  }

  return res.status(500).json({
    error: 'Something went wrong! Please try again later.'
  });
};

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  sendError(err, req, res);
};