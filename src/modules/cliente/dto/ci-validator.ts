import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function esCiValida(ci: string): boolean {
  if (!/^\d{11}$/.test(ci)) return false;

  const primerDigito = Number(ci[0]);
  const mes = Number(ci.slice(1, 3));
  const dia = Number(ci.slice(3, 5));
  const anioCorto = Number(ci.slice(5, 7));

  if (primerDigito < 1 || primerDigito > 9 || mes < 1 || mes > 12) return false;

  const siglo = primerDigito === 3 || primerDigito === 4 ? 2000 : 1900;
  const anioCompleto = siglo + anioCorto;
  const diasEnMes = new Date(anioCompleto, mes, 0).getDate();

  return dia >= 1 && dia <= diasEnMes;
}

@ValidatorConstraint({ name: "isCiValida", async: false })
export class CiValidator implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === "string" && esCiValida(value);
  }

  defaultMessage(_args: ValidationArguments): string {
    return "El CI debe tener 11 dígitos y una fecha de nacimiento válida (mes 01-12 y día válido para el mes)";
  }
}

export function IsCiValida(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: CiValidator,
    });
  };
}