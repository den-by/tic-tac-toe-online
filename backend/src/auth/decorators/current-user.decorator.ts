import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const token = request.headers.authorization;
      const userId = JSON.parse(atob(token.split(".")[1]))?.id;
      if (!userId) {
        throw new ForbiddenException("You are not logged in");
      }
      return Number(userId);
    } catch (error) {
      throw new ForbiddenException("You are not logged in");
    }
  },
);
