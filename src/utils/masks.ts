const onlyDigits = (value: string, max: number): string => value.replace(/\D/g, '').slice(0, max);

// Digita-se so os numeros e as barras aparecem sozinhas: 25122026 -> 25/12/2026.
// A barra so entra quando ha um digito depois dela, para o apagar nao ficar preso nela.
export const maskDate = (value: string): string => {
  const d = onlyDigits(value, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};

// 1430 -> 14:30
export const maskTime = (value: string): string => {
  const d = onlyDigits(value, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`;
};
