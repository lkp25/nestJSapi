import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";


export enum attendeeAnswerEnum {
    Accepted = 1,
    Maybe,
    Rejected
  }

@Entity()
export class Attendee{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string

    @ManyToOne(() => Event, (event)=> event.attendees, {
        nullable: false
    })
    @JoinColumn({
        name: 'event_id',
        // referencedColumnName: 'when'
    })
    event: Event

    @Column() //relation to event entity
    eventId: number
    
    @Column('enum', {
        enum: attendeeAnswerEnum,
        default: attendeeAnswerEnum.Accepted
    })
    answer: attendeeAnswerEnum

    @ManyToOne(()=> User, (user)=>user.attended)
    user: User

    @Column()   //relation to User entity
    userId: number
}