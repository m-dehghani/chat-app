import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body.userId) {
      try {
        req.body.userId = new Types.ObjectId(req.body.userId);
      } catch (error) {
        throw new BadRequestException('Invalid userId format', error.message);
      }
    }
    next();
  }
}
