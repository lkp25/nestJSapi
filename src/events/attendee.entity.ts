import { Expose } from "class-transformer";
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
    @Expose()
    @PrimaryGeneratedColumn()
    id: number

    

    @Expose()
    @ManyToOne(() => Event, (event)=> event.attendees, {
        nullable: false,
        onDelete: "CASCADE"  //VERY IMPORTANT FOR PORPER REMovAl oF EVENT - will also remove all it's attendees
    })
    @JoinColumn()
    event: Event

    @Expose()
    @Column() //relation to event entity
    eventId: number
    
    @Expose()
    @Column('enum', {
        enum: attendeeAnswerEnum,
        default: attendeeAnswerEnum.Accepted
    })
    answer: attendeeAnswerEnum

    @Expose()
    @ManyToOne(()=> User, (user)=>user.attended)
    user: User

    @Expose()
    @Column()   //relation to User entity
    userId: number
}