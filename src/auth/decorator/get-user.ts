/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      const user_data = req.user?.[data];
      if (!user_data) throw new UnauthorizedException();
      return user_data;
    }
    return req.user;
  },
);
