import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventsController } from './events.controller';
import { EventService } from './event.service';
import { AttendeeService } from './attendees.service';
import { EventAttendeesController } from './event-attendees.controller';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Attendee]),
  ],
  controllers: [EventsController, EventAttendeesController, EventsOrganizedByUserController],
  providers: [EventService, AttendeeService]
})
export class EventsModule { }