import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DeviceName = createParamDecorator(
  (data: string, context: ExecutionContext): string | undefined => {
    const deviceName = context.switchToHttp().getRequest()?.deviceName;
    if (!deviceName) return;
    return deviceName;
  },
);
