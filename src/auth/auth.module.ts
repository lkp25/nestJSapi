import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./local-strategy";
import { User } from "./user.entity";

@Module({
    //to be able to inject User repository
    imports: [
        
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.SECRET,
            signOptions: {
                expiresIn: '15m'
            }
        })
    ],
    providers: [LocalStrategy],
    controllers: [AuthController]
})
export class AuthModule{

}