import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Attendee } from "./attendee.entity";

export class AttendeeService{
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>

    ){}
}