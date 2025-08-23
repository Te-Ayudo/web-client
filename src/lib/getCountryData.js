import phone_code from "@/assets/phone_code.json";

/**
 * Retorna un arreglo con objetos: { name, dial_code, code }
 * Donde `code` es el código ISO de dos letras requerido por react-country-flag
 */
export const paises = phone_code.paises.map(({ name, dial_code, code }) => ({
  name,
  dial_code,
  iso2: code.toUpperCase(), // <- esto es lo que usará CountryFlag
}));
