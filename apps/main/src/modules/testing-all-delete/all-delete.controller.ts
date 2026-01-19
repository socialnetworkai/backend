import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Public } from '../auth/api/decorators/public.decorator';

export const TESTING_ROUTE = 'testing';

@Controller(TESTING_ROUTE)
export class AllDeleteController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @ApiOperation({
    summary: 'Clear database',
    description: 'Delete all data from all tables',
  })
  @ApiResponse({
    status: 204,
    description: 'All data is deleted',
  })
  @Public()
  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.query('TRUNCATE TABLE users CASCADE');
    } finally {
      await queryRunner.release();
    }
  }
}
