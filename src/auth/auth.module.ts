import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt-strategy";
import { LocalStrategy } from "./local-strategy";
import { User } from "./user.entity";

@Module({
    //to be able to inject User repository
    imports: [
        
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            useFactory: () =>({
                secret: process.env.SECRET,
                signOptions: {
                    expiresIn: '15m'
                }
            })
        })
    ],
    providers: [LocalStrategy, AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule{

}