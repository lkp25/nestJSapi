import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
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
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      entities: [Event, Attendee, Subject, Teacher, User, Profile],
      synchronize: true,
      autoLoadEntities: true
  }),
   
    EventsModule, SchoolModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
