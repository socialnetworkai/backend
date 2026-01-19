import { Global, Module } from '@nestjs/common';
import { RecaptchaService } from './recaptcha.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [RecaptchaService],
  exports: [RecaptchaService],
})
export class RecaptchaModule {}
