import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { attendeeAnswerEnum } from './attendee.entity';
import { Event, PaginatedEvents } from './event.entity';
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



  private getEventsBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventRepository
      .createQueryBuilder('e') //alias for 'event' table
      .orderBy('e.id', 'DESC');
  }

  //how many attendees an event has?
  public getEventWithAttendeeCountQuery(): SelectQueryBuilder<Event>{
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
  ): Promise<PaginatedEvents> {
    return await paginate(
      await this.getEventsWithAttendeeCountFilteredQuery(filter),
      paginateOptions
    );
  }


  private getEventsWithAttendeeCountFilteredQuery(
    filter?: ListEvents
  ): SelectQueryBuilder<Event>{
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

  public async getEventWithAttendeeCount(id: number): Promise<Event> | undefined {
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

  //organized by
  public async getEventsOrganizedByUserIdPaginated(
    userId: number, paginateOptions: PaginateOptions
  ): Promise<PaginatedEvents>{
    return await paginate<Event>(
      this.getEventsOrganizedByUserIdQuery(userId),
      paginateOptions
    )
  }

  private getEventsOrganizedByUserIdQuery(userId: number): SelectQueryBuilder<Event>{
    return this.getEventsBaseQuery()
    .where('e.organizerId = :userId', {userId})
  }

  //attended by
  public async getEventsAttendedByUserIdPaginated(
    userId: number, paginateOptions: PaginateOptions
  ): Promise<PaginatedEvents>{
    return await paginate<Event>(
      this.getEventsAttendedByUserIdQuery(userId),
      paginateOptions
    )
  }

  private getEventsAttendedByUserIdQuery(userId: number): SelectQueryBuilder<Event>{
    return this.getEventsBaseQuery()
    .leftJoinAndSelect('e.attendees', 'a')//'a' is alias for this relation-attendee
    .where('a.userId = :userId', { userId })
  }
}
