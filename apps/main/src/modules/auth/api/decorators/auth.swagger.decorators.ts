import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  DESCRIPT_BAD_REQUEST_CONFIRM,
  DESCRIPT_BAD_REQUEST_LOGIN,
  DESCRIPT_BAD_REQUEST_NEW_PASSWORD,
  DESCRIPT_BAD_REQUEST_RECOVER_PASSWORD,
  DESCRIPT_BAD_REQUEST_RESENDING,
  DESCRIPT_HEAD_CONFIRM,
  DESCRIPT_HEAD_GET_USER_ACC,
  DESCRIPT_HEAD_GET_USER_SESSIONS,
  DESCRIPT_HEAD_LOGIN,
  DESCRIPT_HEAD_LOGOUT,
  DESCRIPT_HEAD_NEW_PASSWORD,
  DESCRIPT_HEAD_RECOVER_PASSWORD,
  DESCRIPT_HEAD_REFRESH_TOKEN,
  DESCRIPT_HEAD_REGISTR,
  DESCRIPT_HEAD_RESENDING,
  DESCRIPT_SUCCESS_CONFIRM,
  DESCRIPT_SUCCESS_LOGIN,
  DESCRIPT_SUCCESS_LOGOUT,
  DESCRIPT_SUCCESS_LOGOUT_OTHER,
  DESCRIPT_SUCCESS_NEW_PASSWORD,
  DESCRIPT_SUCCESS_RECOVER_PASSWORD,
  DESCRIPT_SUCCESS_REGISTR,
  DESCRIPT_SUCCESS_RESENDING,
  DESCRIPT_SUCCESS_TOKENS_ISSUED,
  DESCRIPT_SUCCESS_USER_ACC,
  DESCRIPT_SUCCESS_USER_SESSION,
  DESCRIPT_TEXT_CONFIRM,
  DESCRIPT_TEXT_GET_USER_ACC,
  DESCRIPT_TEXT_GET_USER_SESSIONS,
  DESCRIPT_TEXT_RECOVER_PASSWORD,
  DESCRIPT_TEXT_REFRESH_TOKEN,
  DESCRIPT_TEXT_REGISTR,
  DESCRIPT_UNAUTHORIZED_LOGOUT,
  DESCRIPT_UNAUTHORIZED_REFRESH_TOKEN,
  DESCRIPT_UNAUTHORIZED_USER_ACC,
  DESCRIPT_UNAUTHORIZED_USER_SESSIONS,
  EXAMPLE_EMAIL_LINK_CODE,
} from './constants';
import { CreateUserInputDto } from '../../../users/api/input-dto/create-user-input.dto';
import { DomainExceptionDto } from '../../../../infrastructure/exceptions/domainException.dto';
import { RegisterViewDto } from '../output-dto/register-view.dto';
import { CodeDto } from '../input-dto/code.dto';
import { EmailDto } from '../input-dto/email.dto';
import { NewPasswordInputDto } from '../input-dto/new-password.input.dto';
import { RefreshViewDto, SignInViewDto } from '../output-dto/signin-view.dto';
import { SignInInputDto } from '../input-dto/sign-in-input.dto';
import { SessionViewDto } from '../input-dto/session.dto';
import { UserViewDto } from '../../../users/api/output-dto/user-view.dto';

export function Registration() {
  return applyDecorators(
    ApiOperation({
      summary: DESCRIPT_HEAD_REGISTR,
      description: DESCRIPT_TEXT_REGISTR,
    }),
    ApiBody({ type: CreateUserInputDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: DESCRIPT_SUCCESS_REGISTR,
      type: RegisterViewDto,
    }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: DomainExceptionDto }),
  );
}

export function Login() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiHeader({
      name: 'User-Agent',
      example: 'PostmanRuntime/7.51.0',
      required: false,
    }),
    ApiBody({ type: SignInInputDto }),
    ApiOperation({
      summary: DESCRIPT_HEAD_LOGIN,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: DESCRIPT_SUCCESS_LOGIN,
      type: SignInViewDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_BAD_REQUEST_LOGIN,
      type: DomainExceptionDto,
    }),
  );
}

export function SignOut() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiCookieAuth('refreshToken'),
    ApiOperation({
      summary: DESCRIPT_HEAD_LOGOUT,
      description: DESCRIPT_HEAD_LOGOUT,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: DESCRIPT_SUCCESS_LOGOUT,
      type: 'string',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_UNAUTHORIZED_LOGOUT,
      type: DomainExceptionDto,
    }),
  );
}

export function Refresh() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: DESCRIPT_HEAD_REFRESH_TOKEN,
      description: DESCRIPT_TEXT_REFRESH_TOKEN,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: DESCRIPT_SUCCESS_TOKENS_ISSUED,
      type: RefreshViewDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_UNAUTHORIZED_REFRESH_TOKEN,
      type: DomainExceptionDto,
    }),
  );
}

export function Sessions() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: DESCRIPT_HEAD_GET_USER_SESSIONS,
      description: DESCRIPT_TEXT_GET_USER_SESSIONS,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: DESCRIPT_SUCCESS_USER_SESSION,
      type: [SessionViewDto],
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_UNAUTHORIZED_USER_SESSIONS,
      type: DomainExceptionDto,
    }),
  );
}

export function AuthMe() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: DESCRIPT_HEAD_GET_USER_ACC,
      description: DESCRIPT_TEXT_GET_USER_ACC,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: DESCRIPT_SUCCESS_USER_ACC,
      type: UserViewDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_UNAUTHORIZED_USER_ACC,
      type: DomainExceptionDto,
    }),
  );
}

export function SignOutOther() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiCookieAuth('refreshToken'),
    ApiOperation({
      summary: DESCRIPT_HEAD_LOGOUT,
      description: DESCRIPT_HEAD_LOGOUT,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: DESCRIPT_SUCCESS_LOGOUT_OTHER,
      type: 'string',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_UNAUTHORIZED_LOGOUT,
      type: DomainExceptionDto,
    }),
  );
}

export function RegisterEmailResending() {
  return applyDecorators(
    ApiOperation({
      summary: DESCRIPT_HEAD_RESENDING,
    }),
    ApiBody({ type: EmailDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: DESCRIPT_SUCCESS_RESENDING,
      example: EXAMPLE_EMAIL_LINK_CODE,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_BAD_REQUEST_RESENDING,
      type: DomainExceptionDto,
    }),
  );
}

export function RegistrationConfirmation() {
  return applyDecorators(
    ApiOperation({
      summary: DESCRIPT_HEAD_CONFIRM,
      description: DESCRIPT_TEXT_CONFIRM,
    }),
    ApiBody({ type: CodeDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: DESCRIPT_SUCCESS_CONFIRM,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_BAD_REQUEST_CONFIRM,
      type: DomainExceptionDto,
    }),
  );
}
//
// export function Login() {
//   return applyDecorators(
//     ApiOperation({
//       summary: DESCRIPT_HEAD_LOGIN,
//     }),
//     ApiBody({
//       schema: {
//         type: 'object',
//         properties: {
//           email: { type: 'string' },
//           password: { type: 'string' },
//         },
//       },
//     }),
//     ApiResponse({
//       status: HttpStatus.OK,
//       description: DESCRIPT_SUCCESS_LOGIN,
//       type: AccessToken,
//     }),
//     ApiResponse({
//       status: HttpStatus.BAD_REQUEST,
//       description: DESCRIPT_BAD_REQUEST_LOGIN,
//       type: DomainExceptionDto,
//     }),
//     ApiResponse({
//       status: HttpStatus.UNAUTHORIZED,
//       description: DESCRIPT_UNAUTHORIZED_LOGIN,
//     }),
//   );
// }
//
export function RecoverPassword() {
  return applyDecorators(
    ApiOperation({
      summary: DESCRIPT_HEAD_RECOVER_PASSWORD,
      description: DESCRIPT_TEXT_RECOVER_PASSWORD,
    }),
    ApiBody({ type: EmailDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: DESCRIPT_SUCCESS_RECOVER_PASSWORD,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_BAD_REQUEST_RECOVER_PASSWORD,
      type: DomainExceptionDto,
    }),
  );
}

// export function CheckRecoveryCode() {
//   return applyDecorators(
//     ApiOperation({
//       summary: DESCRIPT_HEAD_CHECK_RECOVERY_CODE,
//     }),
//     ApiBody({ type: CodeDto }),
//     ApiResponse({
//       status: HttpStatus.OK,
//       description: DESCRIPT_SUCCESS_CHECK_RECOVERY,
//     }),
//     ApiResponse({
//       status: HttpStatus.BAD_REQUEST,
//       description: DESCRIPT_BAD_REQUEST_CHECK_RECOVERY,
//       type: DomainExceptionDto,
//     }),
//   );
// }

export function SetNewPassword() {
  return applyDecorators(
    ApiOperation({
      summary: DESCRIPT_HEAD_NEW_PASSWORD,
    }),
    ApiBody({ type: NewPasswordInputDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: DESCRIPT_SUCCESS_NEW_PASSWORD,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: DESCRIPT_BAD_REQUEST_NEW_PASSWORD,
      type: DomainExceptionDto,
    }),
  );
}

// export function Logout() {
//   return applyDecorators(
//     ApiOperation({
//       summary: DESCRIPT_HEAD_LOGOUT,
//     }),
//     ApiResponse({
//       status: HttpStatus.NO_CONTENT,
//       description: DESCRIPT_SUCCESS_LOGOUT,
//     }),
//     ApiResponse({
//       status: HttpStatus.UNAUTHORIZED,
//       description: DESCRIPT_UNAUTHORIZED_LOGOUT,
//     }),
//   );
// }
//
// export function GetUserAccounts() {
//   return applyDecorators(
//     ApiOperation({
//       summary: 'Get info about current user',
//       description:
//         'Returns basic account info of the authenticated user. Requires Authorization header with a valid JWT access token.',
//     }),
//     ApiResponse({
//       status: HttpStatus.OK,
//       description: DESCRIPT_SUCCESS_USER_ACC,
//       type: UserViewDto,
//     }),
//     ApiResponse({
//       status: HttpStatus.UNAUTHORIZED,
//       description: DESCRIPT_UNAUTHORIZED_USER_ACC,
//     }),
//   );
// }
//
// export function RefreshToken() {
//   return applyDecorators(
//     ApiOperation({
//       summary: DESCRIPT_HEAD_REFRESH_TOKEN,
//       description: DESCRIPT_TEXT_REFRESH_TOKEN,
//     }),
//     ApiResponse({
//       status: HttpStatus.OK,
//       description: DESCRIPT_SUCCESS_TOKENS_ISSUED,
//       type: AccessToken,
//     }),
//     ApiResponse({
//       status: HttpStatus.UNAUTHORIZED,
//       description: DESCRIPT_UNAUTHORIZED_REFRESH_TOKEN,
//     }),
//   );
// }
//
// export function GithubAuthSwagger() {
//   return applyDecorators(
//     ApiOperation({
//       summary: DESCRIPT_HEAD_GITHUB_AUTH,
//       description: DESCRIPT_TEXT_GITHUB_AUTH,
//     }),
//     ApiResponse({
//       status: HttpStatus.OK,
//       description: DESCRIPT_SUCCESS_GITHUB_AUTH,
//     }),
//     ApiResponse({
//       status: HttpStatus.UNAUTHORIZED,
//       description: DESCRIPT_UNAUTHORIZED_GITHUB_AUTH,
//     }),
//   );
// }
//
// export function GithubCallbackSwagger() {
//   return applyDecorators(
//     ApiOperation({
//       summary: DESCRIPT_HEAD_GITHUB_CALLBACK,
//       description: DESCRIPT_TEXT_GITHUB_CALLBACK,
//     }),
//     ApiResponse({
//       status: HttpStatus.OK,
//       description: DESCRIPT_SUCCESS_GITHUB_CALLBACK,
//     }),
//     ApiResponse({
//       status: HttpStatus.INTERNAL_SERVER_ERROR,
//       description: DESCRIPT_ERROR_GITHUB_CALLBACK,
//     }),
//   );
// }
//
// export function GoogleAuthSwagger() {
//   return applyDecorators(
//     ApiOperation({
//       summary: DESCRIPT_HEAD_GOOGLE_AUTH,
//       description: DESCRIPT_TEXT_GOOGLE_AUTH,
//     }),
//     ApiResponse({
//       status: HttpStatus.OK,
//       description: DESCRIPT_SUCCESS_GOOGLE_AUTH,
//     }),
//     ApiResponse({
//       status: HttpStatus.UNAUTHORIZED,
//       description: DESCRIPT_UNAUTHORIZED_GOOGLE_AUTH,
//     }),
//   );
// }
//
// export function GoogleCallbackSwagger() {
//   return applyDecorators(
//     ApiOperation({
//       summary: DESCRIPT_HEAD_GOOGLE_CALLBACK,
//       description: DESCRIPT_TEXT_GOOGLE_CALLBACK,
//     }),
//     ApiResponse({
//       status: HttpStatus.OK,
//       description: DESCRIPT_SUCCESS_GOOGLE_CALLBACK,
//     }),
//     ApiResponse({
//       status: HttpStatus.INTERNAL_SERVER_ERROR,
//       description: DESCRIPT_ERROR_GOOGLE_CALLBACK,
//     }),
//   );
