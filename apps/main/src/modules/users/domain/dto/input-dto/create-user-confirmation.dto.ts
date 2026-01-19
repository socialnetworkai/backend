export class CreateUserConfirmationDto {
  confirmationCode: string | null;
  expirationDate: Date | null;
  isConfirmed: boolean;
  isAgreeWithPrivacy?: boolean;
}
