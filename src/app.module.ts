import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common';
import { CarsModule } from './cars/cars.module';

const envFile =
  process.env.NODE_ENV && process.env.NODE_ENV === 'test'
    ? './.env.test'
    : './.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFile,
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.boolean().required(),
      }),
    }),
    DatabaseModule,
    CarsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
