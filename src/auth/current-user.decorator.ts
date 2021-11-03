import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const currentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext)=>{
        //gets the same request object as @Request deco
        const request = ctx.switchToHttp().getRequest()
        return request.user ?? null  //null if not defined
    }
)