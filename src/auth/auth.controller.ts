import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{

    constructor(
        private readonly authService: AuthService
    ) { }


    @Post('login') 
    @UseGuards(AuthGuard('local')) 
    // this will call the validate method in local startegy,
    //if the user is found - guard will set req.user = user
    //and pass it furhter here!
    async login(@Request() request){ // here we have req object access
        return {
            userId: request.user.id,
            //user is a property of request by now:
            token: this.authService.getTokenForUser(request.user)
        }
    }
    
    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() request){
        return request.user
    }
}