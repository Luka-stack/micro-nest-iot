import { Injectable } from '@nestjs/common';

@Injectable()
export class KepwareService {
  handle(data: any) {
    console.log('Received this:', data);
  }
}
