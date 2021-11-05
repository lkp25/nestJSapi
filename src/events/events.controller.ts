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
  
  NotFoundException,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  
  ForbiddenException,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { CreateEventDto } from './input/create-Event.dto';
import { Event } from './event.entity';
import { EventService } from './event.service';
import { UpdateEventDto } from './input/update-Events.dto';
import { ListEvents } from './input/list.events';
import { currentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('events')
@SerializeOptions({
  strategy: 'excludeAll'
})
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2,
        },
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
  async practice2() {
    // return await this.repository.findOne(7, {
    //   relations: ['attendees']
    // })
    //wez z bazy event razem z uczestnikami
    const event = await this.repository.findOne(7, {
      relations: ['attendees'],
    });
    //stworz nowego uczestnika, dodaj jego atrybuty, jako event daj znaleziony event wyzej
    const attendee = new Attendee();
    attendee.name = 'jerssry';
    // attendee.event = event
    //wrzuc uczestnika do arraya i zapisz repo.
    //poniewaz jest opcja cascade:true, to sie zapisze wszystko wszedzie.
    event.attendees.push(attendee);
    return await this.repository.save(event);
    //jakby nie bylo kaskadowania:
    // await this.attendeeRepository.save(attendee)
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id) {
    // return this.events.find((event) => event.id === +id);
    const result = await this.eventsService.getEvent(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() input: CreateEventDto,
    //use custom deco to get the user
    @currentUser() user: User,
  ) {
    return this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id,
    @Body() input: UpdateEventDto,
    @currentUser() user: User,
  ) {
    //copy old values, replace if new are provided and insert new object in the same place
    const original = await this.repository.findOne(id);
    if (!original) {
      throw new NotFoundException();
    }

    //only creator of event can modify it!
    if (original.organizerId !== user.id) {
      throw new ForbiddenException(null, 'only creator can modify this event');
    }

    return await this.eventsService.updateEvent(input, original)
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id') id,
    @currentUser() user: User
    ) {
    //copy old values, replace if new are provided and insert new object in the same place
    const original = await this.repository.findOne(id);
    if (!original) {
      throw new NotFoundException();
    }

    //only creator of event can modify it!
    if (original.organizerId !== user.id) {
      throw new ForbiddenException(null, 'only creator can remove this event');
    }

    await this.eventsService.deleteEvent(id);
    //not found in the db? 404!
    // if(result?.affected !== 1){
    //   throw new NotFoundException()

    // }
  }
}
