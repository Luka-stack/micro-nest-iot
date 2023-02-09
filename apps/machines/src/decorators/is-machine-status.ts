import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { MACHINE_STATUS } from '../app.types';

export function IsMachineStatus(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    const message = `Provided wrong status for field '${propertyName}'. Possible status are ${Object.keys(
      MACHINE_STATUS,
    ).join(', ')}`;

    const validate = function (value: any, _: ValidationArguments) {
      if (typeof value !== 'string') {
        return false;
      }

      if (!MACHINE_STATUS[value]) {
        return false;
      }

      return true;
    };

    const defaultMessage = () => {
      return message;
    };

    registerDecorator({
      name: 'IsMachineStatus',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate,
        defaultMessage,
      },
    });
  };
}
