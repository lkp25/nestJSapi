import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Profile } from './auth/profile.entity';
import { User } from './auth/user.entity';
import { Attendee } from './events/attendee.entity';
import { Event } from './events/event.entity';
import { EventsController } from './events/events.controller';
import { EventsModule } from './events/events.module';
import { SchoolModule } from './school/school.module';
import { Subject } from './school/subject.entity';
import { Teacher } from './school/teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'pass',
      database: 'test',
      entities: [Event, Attendee, Subject, Teacher, User, Profile],
      synchronize: true,
      autoLoadEntities: true
  }),
   
    EventsModule, SchoolModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
