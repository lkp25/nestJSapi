import { Body, Controller, Delete, Get, HttpCode, Param, Post, Patch } from '@nestjs/common';
import { get } from 'http';
import { CreateEventDto } from './create-Event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-Events.dto';

@Controller('events')
export class EventsController {
    private events: Event[] = []

  @Get()
  findAll() {
      return this.events
  }

  @Get(':id')
  findOne(@Param('id') id) {
      return this.events.find(event => event.id === +id)
  }
  @Post()
  create(@Body() input: CreateEventDto){
      const event = {
          ...input,
          when: new Date(input.when),
          id: this.events.length + 1
      }
      this.events.push(event)

      return event
  }
  
  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto){
    //find index of item to update  
    const index = this.events.findIndex(event => event.id === +id)
    //copy old values, replace if new are provided and insert new object in the same place
    this.events[index] = {
        ...this.events[index],
        ...input,
        //replace the date if provided, else keep old one
        when: input.when ? new Date(input.when) : this.events[index].when
    }
    return this.events[index]
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id){
      //easy using filter - just put out the one element with given id, keep rest.
    this.events = this.events.filter(event => event.id !== +id)
  }
}
