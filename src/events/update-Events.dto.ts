import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create-Event.dto";

export class UpdateEventDto extends PartialType(CreateEventDto){

}