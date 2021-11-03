import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController{

    @Post('login') 
    @UseGuards(AuthGuard('local')) 
    // this will call the validate method in local startegy,
    //if the user is found - guard will set req.user = user
    //and pass it furhter here!
    async login(@Request() request){ // here we have req object access
        return {
            userId: request.user.id,
            token: 'the token will go here'
        }
    }
}