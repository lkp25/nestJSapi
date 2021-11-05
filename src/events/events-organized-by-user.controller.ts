import { ClassSerializerInterceptor, Controller, Get, Param, Query, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { EventService } from "./event.service";

@Controller('events-organized-by-user/:userId')
@SerializeOptions({strategy: 'excludeAll'})
export class EventsOrganizedByUserController{
    constructor(
        private readonly eventsService: EventService
    ){}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor) //to serialize
    async findAll(
        @Param('userId') userId:number,
        @Query('page') page = 1
    ){
       return await this.eventsService.getEventsOrganizedByUserIdPaginated(userId, {
            currentPage: page,
            limit: 5
        })
    }
}