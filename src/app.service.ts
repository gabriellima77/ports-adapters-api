import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  running() {
    return { Status: 'OK' };
  }
}
