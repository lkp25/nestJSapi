import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./event.entity";

@Injectable()
export class EventService{
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        private readonly logger = new Logger(EventService.name)
    ){}
    private getEventsBaseQuery(){
        return this.eventRepository
            .createQueryBuilder('e') //alias for 'event' table
            .orderBy('e.id', 'DESC')
    }
    public async getEvent(id: number): Promise<Event>{
        const query = this.getEventsBaseQuery()
        .andWhere('e.id = :id', {id})
        this.logger.debug(query.getSql())

        return await query.getOne()
    }
}