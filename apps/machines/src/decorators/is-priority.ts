import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsPriority(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    const message = `Provided wrong priority for field '${propertyName}'. Possible priorities are LOW, NORMAL, HIGH`;

    const validate = function (value: unknown) {
      if (typeof value !== 'string') {
        return false;
      }

      if (!['LOW', 'NORMAL', 'HIGH'].includes(value)) {
        return false;
      }

      return true;
    };

    registerDecorator({
      name: 'IsPriority',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate,
        defaultMessage: () => message,
      },
    });
  };
}
