import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  Logger,
  Injectable,
  NotFoundException,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { CreateEventDto } from './input/create-Event.dto';
import { Event } from './event.entity';
import { EventService } from './event.service';
import { UpdateEventDto } from './input/update-Events.dto';
import { ListEvents } from './input/list.events';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name)

  constructor(    
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventService
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    const events = await this.eventsService
      .getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2
        }
      );
    return events;
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

  @Get('/practice2')
  async practice2(){
    // return await this.repository.findOne(7, {
    //   relations: ['attendees']
    // })
    //wez z bazy event razem z uczestnikami
    const event =  await this.repository.findOne(7, {
      relations: ['attendees']
    })
    //stworz nowego uczestnika, dodaj jego atrybuty, jako event daj znaleziony event wyzej
    const attendee = new Attendee()
    attendee.name = 'jerssry'
    // attendee.event = event
    //wrzuc uczestnika do arraya i zapisz repo. 
    //poniewaz jest opcja cascade:true, to sie zapisze wszystko wszedzie.
    event.attendees.push(attendee)
    return await this.repository.save(event)
    //jakby nie bylo kaskadowania:
    // await this.attendeeRepository.save(attendee)
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    // return this.events.find((event) => event.id === +id);
    const result = await this.eventsService.getEvent(id);
    if(!result){
      throw new NotFoundException()
    }
    return result
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
    if(!original){
      throw new NotFoundException()
    }

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
   
    const result = await this.repository.findOne(id);
    if(!result){
      throw new NotFoundException()
    }
    await this.repository.remove(result);
  }
}
