import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { PaginationResult } from 'src/pagination/paginator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';


@Entity({name: 'events'})
export class Event {
  @Expose()
  @PrimaryGeneratedColumn()
  id: string;

  @Expose()
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;
  
  @Column()
  address: string;

  @OneToMany(()=> Attendee, (attendee)=> attendee.event, {
    // eager: true
    cascade: true
  })
  attendees: Attendee[]

  attendeeCount?: number  
  attendeeAccepted?: number
  attendeeMaybe?: number
  attendeeRejected?: number

  @ManyToOne(()=> User, (user)=> user.organized)
  @JoinColumn({
    name: 'organizerId'
  })
  organizer: User

  @Column({nullable: true})
  organizerId: number
}

export type PaginatedEvents = PaginationResult<Event>