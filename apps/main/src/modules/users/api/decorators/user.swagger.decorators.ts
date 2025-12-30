import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DESCRIPT_SUCCESS_REGISTR } from '../../../auth/api/decorators/constants';
import { CreateUserInputDto } from '../input-dto/create-user-input.dto';
import { RegisterViewDto } from '../../../auth/api/output-dto/register-view.dto';
import { DomainExceptionDto } from '../../../../infrastructure/exceptions/domainException.dto';
import {
  DESCRIPT_HEAD_CREATEUSER,
  DESCRIPT_SUCCESS_CREATEUSER,
  DESCRIPT_TEXT_CREATEUSER,
} from './constants';

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: DESCRIPT_HEAD_CREATEUSER,
      description: DESCRIPT_TEXT_CREATEUSER,
    }),
    ApiBody({ type: CreateUserInputDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: DESCRIPT_SUCCESS_CREATEUSER,
      type: RegisterViewDto,
    }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: DomainExceptionDto }),
  );
}
