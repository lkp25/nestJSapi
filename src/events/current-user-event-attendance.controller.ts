import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Put, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { currentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { AttendeeService } from "./attendees.service";
import { EventService } from "./event.service";
import { CreateAttendeeDto } from "./input/create-attendee.dto";

@Controller('events-attendance')
@SerializeOptions({strategy: 'excludeAll'})
export class CurrentUserEventAttendanceController{
    constructor(
        private readonly eventService: EventService,
        private readonly attendeeService: AttendeeService,
        
    ){}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(
        @currentUser() user: User,
        @Query('page', new DefaultValuePipe(1),ParseIntPipe) page = 1
    ){
        return await this.eventService.getEventsAttendedByUserIdPaginated(
            user.id,
            {
                currentPage: page,
                limit: 5
            }
        )
    }

    @Get(':eventId')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(
        @Param('eventId', ParseIntPipe) eventId: number,
        @currentUser() user: User
    ){
        const attendee = await this.attendeeService.findOneByEventIdAndUserId(eventId, user.id)
        if(!attendee){
            throw new NotFoundException()
        }
        return attendee
    }

    @Put(':eventId')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(ClassSerializerInterceptor)
    async createOrUpdate(
        @Param('eventId', ParseIntPipe) eventId:number,
        @Body() input: CreateAttendeeDto,
        @currentUser() user: User
    ){
        return await this.attendeeService.createOrUpdate(input, eventId, user.id)
    }
}