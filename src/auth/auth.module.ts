import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocalStrategy } from "./local-strategy";
import { User } from "./user.entity";

@Module({
    //to be able to inject User repository
    imports: [TypeOrmModule.forFeature([User])],
    providers: [LocalStrategy]
})
export class AuthModule{

}