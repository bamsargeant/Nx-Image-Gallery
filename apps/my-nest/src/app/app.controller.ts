import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller('messages')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessages() {
    return this.appService.getMessages();
  }

  @Post()
  addMessage(messageText: string) {
    this.appService.addMessage(messageText);
  }
}
