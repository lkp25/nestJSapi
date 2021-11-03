import { User } from 'src/auth/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';


@Entity({name: 'events'})
export class Event {
  @PrimaryGeneratedColumn()
  id: string;

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
