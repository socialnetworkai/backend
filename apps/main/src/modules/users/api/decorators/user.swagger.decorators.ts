import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserInputDto } from '../input-dto/create-user-input.dto';
import { RegisterViewDto } from '../../../auth/api/output-dto/register-view.dto';
import { DomainExceptionDto } from '../../../../infrastructure/exceptions/domainException.dto';
import {
  DESCRIPT_HEAD_CREATEUSER,
  DESCRIPT_HEAD_DELETEUSER,
  DESCRIPT_SUCCESS_CREATEUSER,
  DESCRIPT_SUCCESS_DELETEUSER,
  DESCRIPT_TEXT_CREATEUSER,
  DESCRIPT_TEXT_DELETEUSER,
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

export function ApiDeleteUser() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'Authorization with bearer token',
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: DESCRIPT_HEAD_DELETEUSER,
      description: DESCRIPT_TEXT_DELETEUSER,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: DESCRIPT_SUCCESS_DELETEUSER,
    }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: DomainExceptionDto }),
  );
}
