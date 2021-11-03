import { Get, Injectable, Request, UseGuards } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET
        });
    }

    async validate(payload: any){
        //payload sub stores user id, can use it to fetch more user details
        const user = await this.userRepository.findOne(payload.sub)
        //return fake password
        user.password = 'admin123'
        return user
    }

    
}