import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateManufacturerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  // @Min(10000000000000, { message: 'The SIRET number must contain 14 digits' })
  // @Min(99999999999999, { message: 'The SIRET number must contain 14 digits' })
  siret: string;
}
