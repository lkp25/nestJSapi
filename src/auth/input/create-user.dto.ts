import { Length } from "class-validator"

export class CreateUserDto{
    @Length(5)
    username: string

    @Length(5)
    password: string
    
    @Length(5)
    retypedPassword: string

    @Length(5)
    firstName: string

    @Length(5)
    lastName: string

    @Length(5)
    email:string
}