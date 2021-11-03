import { Controller, Post } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Controller('school')
export class TrainingController {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) { }

  @Post('/create')
  public async savingRelation() {
    
    const subject = await this.subjectRepository.findOne(3);

    const teacher1 = await this.teacherRepository.findOne(1)
    const teacher2 = await this.teacherRepository.findOne(2)

    return await this.subjectRepository
    .createQueryBuilder()// no alias needed
    .relation(Subject, 'teachers')// RelationQueryBuilder, takes Main Class and its object's field reletion
    .of(subject) //real object present here not a class - 
    .add([teacher1, teacher2])  // and pass array of objects to be added to teachers field.
    
    



    // const teacher1 = new Teacher();
    // teacher1.name = 'John Doe';

    // const teacher2 = new Teacher();
    // teacher2.name = 'Harry Doe';

    // subject.teachers = [teacher1, teacher2];
    // await this.subjectRepository.save(subject);

    // How to use One to One
    // const user = new User();
    // const profile = new Profile();

    // user.profile = profile;
    // user.profile = null;
    // Save the user here


    // const teacher1 = await this.teacherRepository.findOne(5);
    // const teacher2 = await this.teacherRepository.findOne(6);

    // return await this.subjectRepository
    //   .createQueryBuilder()
    //   .relation(Subject, 'teachers')
    //   .of(subject)
    //   .add([teacher1, teacher2]);
  }

  @Post('/remove')
  public async removingRelation() {
    // const subject = await this.subjectRepository.findOne(
    //   1,
    //   { relations: ['teachers'] }
    // );

    // subject.teachers = subject.teachers.filter(
    //   teacher => teacher.id !== 5
    // );

    // await this.subjectRepository.save(subject);
    await this.subjectRepository.createQueryBuilder('s')
      .update() //for updating - UdateQueryBuilder
      .set({ name: "Confidential" }) // partial of our entity
      .execute();
  }
}