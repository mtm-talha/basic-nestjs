import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { QueryParamsDto } from './dto/query-params.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Users')
@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({
    type: CreateUserDto,
    description: 'The Description for the Create User Body',
    examples: {
      a: {
        summary: 'Body',
        value: {
          name: 'testing',
          email: 'test@test.com',
          age: 20,
        } as CreateUserDto,
      },
    },
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.createUser(createUserDto);
    return result;
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.usersService.findUsers(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  findOne(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'The Description for the Update User Body',
    examples: {
      example1: {
        summary: 'Update Name and Email',
        value: {
          name: 'Updated Name',
          email: 'updated.email@example.com',
          age: 21,
        },
      },
    },
  })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
