import { Expose } from 'class-transformer';
import { Attendee } from 'src/events/attendee.entity';
import { Event } from 'src/events/event.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({unique: true})
  username: string;

  @Column()
  password: string;

  @Expose()
  @Column({unique: true})
  email: string;

  @Expose()
  @Column()
  firstName: string;

  @Expose()
  @Column()
  lastName: string;

  @Expose()
  @OneToOne(() => Profile)
  @JoinColumn()//on user table there will be profileId column.
  profile: Profile

  @Expose()
  @OneToMany(()=>Event, (event)=> event.organizer)
  organized: Event[]

  @Expose()
  @OneToMany(()=> Attendee, (attendee)=>attendee.user)
  attended: Attendee[]
}
