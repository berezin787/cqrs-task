import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getAll() {
    return this.carsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') carId: number) {
    return this.carsService.getOne(carId);
  }

  @Get(':id/manufacturer')
  async getManufacturer(@Param('id') carId: number) {
    return this.carsService.getManufacturer(carId);
  }

  @Post()
  async create(@Body() dto: CreateCarDto) {
    return this.carsService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') carId: number, @Body() dto: UpdateCarDto) {
    return this.carsService.update(carId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update')
  async updateCarsData() {
    return this.carsService.updateCarsData();
  }

  @Delete(':id')
  async remove(@Param('id') carId: number) {
    return this.carsService.remove(carId);
  }
}
