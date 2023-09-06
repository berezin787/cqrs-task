import {
  IsArray,
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateManufacturerDto } from './create-manufacturer.dto';
import { CreateOwnerDto } from './create-owner.dto';

export class CreateCarDto {
  @IsPositive()
  price: number;

  @IsDate()
  @Type(() => Date)
  firstRegistrationDate: Date;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateManufacturerDto)
  manufacturer: CreateManufacturerDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOwnerDto)
  owners?: CreateOwnerDto[];
}
