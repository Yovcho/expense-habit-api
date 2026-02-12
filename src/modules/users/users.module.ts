import { Module } from '@nestjs/common';
import { UsersRepo } from './users.repo';

@Module({
  providers: [UsersRepo],
  exports: [UsersRepo], // <-- important
})
export class UsersModule {}
