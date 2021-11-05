import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = new User();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['passwords do not match']);
    }

    const userExists = await this.userRepository.findOne({
      where: [
        {
          username: createUserDto.username,
        },
        {
          email: createUserDto.email,
        }
      ],
    });

    if(userExists){
        throw new BadRequestException(['username or email exists already'])
    }

    user.username = createUserDto.username
    user.password = await this.authService.hashPassword(createUserDto.password)
    user.email = createUserDto.email
    user.firstName = createUserDto.firstName
    user.lastName = createUserDto.lastName

    return {
        //will return saved user object - copy its key-val pairs:
        ...(await this.userRepository.save(user)),
        //dummy fake easteregg password!
        password: '123qwert',
        //but also send it along with the token immidiately:
        token: this.authService.getTokenForUser(user)
    }
  }
  
}
