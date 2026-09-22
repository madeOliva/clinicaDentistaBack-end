import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function esCiValida(ci: string): boolean {
  if (!/^\d{11}$/.test(ci)) return false;

  const anioCorto = Number(ci.slice(0, 2));
  const mes = Number(ci.slice(2, 4));
  const dia = Number(ci.slice(4, 6));

  if (mes < 1 || mes > 12) return false;

  const anioActual = new Date().getFullYear();
  const siglo = anioCorto > anioActual % 100 ? 1900 : 2000;
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