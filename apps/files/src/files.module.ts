import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';

@Module({
  controllers: [FilesController],
  imports: [],
  providers: [],
})
export class FilesModule {}
