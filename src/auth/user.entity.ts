import { Event } from 'src/events/event.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @Column()
  password: string;

  @Column({unique: true})
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => Profile)
  @JoinColumn()//on user table there will be profileId column.
  profile: Profile

  @OneToMany(()=>Event, (event)=> event.organizer)
  organized: Event[]
}
