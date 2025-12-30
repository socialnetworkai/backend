import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';
import { Trim } from '../../../users/api/decorators/transform/trim';

export const IsStringOfLengthWithTrim = (
  minLength: number,
  maxLength?: number,
) => applyDecorators(IsString(), Trim(), Length(minLength, maxLength));