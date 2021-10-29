import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "events"})
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({length: 100})
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;
  
  @Column()
  address: string;
}
