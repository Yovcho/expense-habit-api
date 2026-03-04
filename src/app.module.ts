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
import { CheckinsModule } from './modules/checkins/checkins.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    HealthModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ExpensesModule,
    HabitsModule,
    CheckinsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
