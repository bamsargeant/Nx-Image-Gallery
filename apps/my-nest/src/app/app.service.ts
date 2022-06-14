import { Injectable } from '@nestjs/common';

export interface MessageModel {
  message: string;
}

@Injectable()
export class AppService {
  messages: MessageModel[] = [
    { message: 'Welcome to my-nest!' },
    { message: "Here's another message" },
  ];

  getMessages(): MessageModel[] {
    return this.messages;
  }

  addMessage(messageText: string): void {
    this.messages.push({
      message: messageText,
    });
  }
}
