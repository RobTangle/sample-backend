import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserRequest } from './create-user.dto';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {
  // BD provisoria hasta implementar mongoDB
  private readonly users: any[] = [];

  constructor(
    @Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
    @Inject('ANALYTICS') private readonly analyticsClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createUser(createUserRequest: CreateUserRequest) {
    this.users.push(createUserRequest);

    this.communicationClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );

    this.analyticsClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );
    console.log('USERS: ', this.users);
  }

  getAnalytics() {
    return this.analyticsClient.send({ cmd: 'get_analytics' }, {});
  }
}
