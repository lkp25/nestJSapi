import { IsEnum } from "class-validator";
import { attendeeAnswerEnum } from "../attendee.entity";

export class CreateAttendeeDto{
    @IsEnum(attendeeAnswerEnum)
    answer: attendeeAnswerEnum
}