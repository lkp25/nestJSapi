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
    
    @Column('enum', {
        enum: attendeeAnswerEnum,
        default: attendeeAnswerEnum.Accepted
    })
    answer: attendeeAnswerEnum
}