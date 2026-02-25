import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { HabitsModule } from './modules/habits/habits.module';

@Module({
  imports: [
    HealthModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ExpensesModule,
    HabitsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
