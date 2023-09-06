import { UpdateCarDto } from '../../dto/update-car.dto';

export class UpdateCarCommand {
  constructor(
    public readonly carId: number,
    public readonly dto: UpdateCarDto,
  ) {}
}
