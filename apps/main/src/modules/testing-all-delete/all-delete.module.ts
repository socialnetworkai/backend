import { Module } from '@nestjs/common';
import { AllDeleteController } from './all-delete.controller';

@Module({
  imports: [],
  controllers: [AllDeleteController],
})
export class AllDeleteModule {}
