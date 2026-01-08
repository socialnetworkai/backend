import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_GUARD = 'SKIP_AUTH_GUARD';

export const SkipAuth = () => SetMetadata(SKIP_AUTH_GUARD, 'true');
