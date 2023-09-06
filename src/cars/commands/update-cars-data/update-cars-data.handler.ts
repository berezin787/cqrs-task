import { CommandHandler, EventPublisher, IQueryHandler } from '@nestjs/cqrs';
import { Between, IsNull, LessThan } from 'typeorm';
import { subMonths, startOfDay, format } from 'date-fns';
import { UpdateCarsDataCommand } from './update-cars-data.command';
import { CarsRepository } from '../../cars.repository';
import { OwnersRepository } from '../../owners.repository';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

@CommandHandler(UpdateCarsDataCommand)
export class UpdateCarsDataHandler
  implements IQueryHandler<UpdateCarsDataCommand>
{
  constructor(
    private readonly carsRepository: CarsRepository,
    private readonly ownersRepository: OwnersRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async applyDiscountToCars(): Promise<void> {
    const date18MonthsAgo = subMonths(new Date(), 18);
    const date12MonthsAgo = subMonths(new Date(), 12);
    const date18MonthsAgoFormatted = format(
      startOfDay(date18MonthsAgo),
      DATE_FORMAT,
    );
    const date12MonthsAgoFormatted = format(
      startOfDay(date12MonthsAgo),
      DATE_FORMAT,
    );
    const cars = await this.carsRepository.find(
      {
        firstRegistrationDate: Between(
          new Date(date18MonthsAgoFormatted),
          new Date(date12MonthsAgoFormatted),
        ),
      },
      { manufacturer: true, owners: true },
    );
    cars.forEach((car) => car.applyDiscount());
    await this.carsRepository.updateMany(cars);
  }

  async removeOwners(): Promise<void> {
    const date18MonthsAgo = subMonths(new Date(), 18);
    const startDate = startOfDay(date18MonthsAgo);
    const dateFormatted = format(startDate, DATE_FORMAT);

    await this.ownersRepository.findAndSoftRemove({
      purchaseDate: LessThan(new Date(dateFormatted)),
      deletedAt: IsNull(),
    });
  }

  async execute(): Promise<void> {
    await this.applyDiscountToCars();
    await this.removeOwners();
  }
}
