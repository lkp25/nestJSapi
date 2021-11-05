import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { DeleteResult, Repository } from 'typeorm';
import { attendeeAnswerEnum } from './attendee.entity';
import { Event } from './event.entity';
import { CreateEventDto } from './input/create-Event.dto';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { UpdateEventDto } from './input/update-Events.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}
  private getEventsBaseQuery() {
    return this.eventRepository
      .createQueryBuilder('e') //alias for 'event' table
      .orderBy('e.id', 'DESC');
  }

  //how many attendees an event has?
  public getEventWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap(
        'e.attendeeCount',
        'e.attendees', //relation of virtual prop on event entity to the attendee table
      )
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee', // alias for attendee table for qb below:,
        (qb) =>
          qb.where( //count how many attendees have the accepted enum
              'attendee.answer = :answer', {
            answer: attendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee', // alias for attendee table for qb below:,
        (qb) =>
          qb.where( //count how many attendees have the accepted enum
              'attendee.answer = :answer', {
            answer: attendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee', // alias for attendee table for qb below:,
        (qb) =>
          qb.where( //count how many attendees have the accepted enum
              'attendee.answer = :answer', {
            answer: attendeeAnswerEnum.Rejected,
          }),
      );
  }
  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions
    );
  }


  private async getEventsWithAttendeeCountFiltered(
    filter?: ListEvents
  ) {
    let query = this.getEventWithAttendeeCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`
        );
      }

      if (filter.when == WhenEventFilter.Tomorrow) {
        query = query.andWhere(
          `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`
        );
      }

      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
      }

      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1');
      }
    }

    return query;
  }

  public async getEvent(id: number): Promise<Event> | undefined {
    const query = this.getEventWithAttendeeCountQuery().andWhere('e.id = :id', {
      id,
    });
    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  public async deleteEvent(id:number) : Promise<DeleteResult>{
    return await this.eventRepository
      .createQueryBuilder('e') //call qb with alias
      .delete() //deleteQueryBuilder has own methods other than select
      .where('id = :id', { id })
      .execute()
  }

  public async createEvent(input: CreateEventDto, user: User): Promise<Event>{
    return await this.eventRepository.save({
      ...input,
      organizer: user,
      when: new Date(input.when),
    });
  }

  public async updateEvent(input: UpdateEventDto, original: Event): Promise<Event>{
    return  await this.eventRepository.save({
      ...original,
      ...input,
      //replace the date if provided, else keep original one
      when: input.when ? new Date(input.when) : original.when,
    });
  }
}
