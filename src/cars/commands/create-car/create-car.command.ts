import { CreateCarDto } from '../../dto/create-car.dto';

export class CreateCarCommand {
  constructor(public readonly dto: CreateCarDto) {}
}
