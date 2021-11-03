import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import  { Strategy }  from "passport-local/";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    private readonly logger = new Logger(LocalStrategy.name)

    constructor(
        private readonly userRepository: Repository<User>
    ){
        super() // this is inheritance so must call super!
    }

    public async validate(
        username: string,
        password: string
    ): Promise<any>
    {
        const user = await this.userRepository.findOne({
            where: {username: username}
        })
        if(!user){
            this.logger.debug(`user ${username} not found`)
            throw new UnauthorizedException
        }
        if(password !== user.password){
            this.logger.debug(`wrong pass`)
            throw new UnauthorizedException
            
        }
        return {
            ...user,
            password: 'hihihihihihihihi'
        }
    }
}