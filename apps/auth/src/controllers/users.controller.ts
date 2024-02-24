import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { USER_ROLES } from '@iot/security';

@Controller('/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/employees')
  findEmployees() {
    return this.usersService.readUsers(USER_ROLES.EMPLOYEE);
  }
}
