import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, MoreThan, Repository } from 'typeorm';
import { CreateEventDto } from './create-Event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-Events.dto';

@Controller('events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    // return this.events;
    return await this.repository.find();
  }
  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'description'],
      where: [
        {
          when: MoreThan(new Date('2021-10-02T08:00:00')),
        },
        {
          description: Like('%meat%'),
        },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    // return this.events.find((event) => event.id === +id);
    return await this.repository.findOne(id);
  }
  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
    // const event = {
    //   ...input,
    //   when: new Date(input.when),
    //   id: this.events.length + 1,
    // };
    // this.events.push(event);

    // return event;
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    //find index of item to update
    // const index = this.events.findIndex((event) => event.id === +id);
    //copy old values, replace if new are provided and insert new object in the same place
    const original = await this.repository.findOne(id);

    return await this.repository.save({
      ...original,
      ...input,
      //replace the date if provided, else keep original one
      when: input.when ? new Date(input.when) : original.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    //easy using filter - just put out the one element with given id, keep rest.
    // this.events = this.events.filter((event) => event.id !== +id);
    const event = await this.repository.findOne(id);
    await this.repository.remove(event);
  }
}
