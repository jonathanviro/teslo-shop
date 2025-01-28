import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata, ParseUUIDPipe, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth, RawHeaders } from './decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
import { RoleProtected } from './decorators/role-protected.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkStatus(
    @GetUser() user: User 
  ) {
    return this.authService.checkStatus( user )
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('roles') userEmail: User,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log(request)

    return {
      ok: true,
      message: 'Hola mundo',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user:User,
  ) {
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user:User,
  ) {
    return {
      ok: true,
      user
    }
  }
}


