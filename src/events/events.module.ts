import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventsController } from './events.controller';
import { EventService } from './event.service';
import { AttendeeService } from './attendees.service';
import { EventAttendeesController } from './event-attendees.controller';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    EventAttendeesController,
    EventsOrganizedByUserController,
    CurrentUserEventAttendanceController
  ],
  providers: [EventService, AttendeeService],
})
export class EventsModule {}
