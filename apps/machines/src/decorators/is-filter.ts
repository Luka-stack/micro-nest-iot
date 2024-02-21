import { registerDecorator, ValidationOptions } from 'class-validator';

const filters = ['lt', 'lte', 'gt', 'gte', 'equals'];

export function IsFilter(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    const message = `Provided wrong filters for field '${propertyName}'. Possible filters are ${filters.join(
      ', ',
    )}`;

    const validate = function (value: any) {
      if (typeof value !== 'string') {
        return false;
      }

      if (!filters.includes(value)) {
        return false;
      }

      return true;
    };

    const defaultMessage = () => {
      return message;
    };

    registerDecorator({
      name: 'IsFilter',
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
