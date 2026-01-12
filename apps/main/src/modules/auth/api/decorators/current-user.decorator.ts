import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserViewDto } from '../../../users/api/output-dto/user-view.dto';

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext): UserViewDto | undefined => {
    const user = context.switchToHttp().getRequest()?.user;
    console.log('user', context.switchToHttp().getRequest());
    if (!user) return;
    return data ? user[data] : user;
  },
);
