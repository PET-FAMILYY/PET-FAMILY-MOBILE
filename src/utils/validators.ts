export const isValidEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email.trim());

const DATE_BR_RE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const TIME_RE = /^(\d{2}):(\d{2})$/;

export const parseBRDate = (value: string): Date | null => {
  const match = DATE_BR_RE.exec(value.trim());
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
};

export const brDateToIso = (value: string): string | null => {
  const date = parseBRDate(value);
  if (!date) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const isoDateToBR = (iso: string): string => {
  const [yyyy, mm, dd] = iso.split('-');
  if (!yyyy || !mm || !dd) return iso;
  return `${dd}/${mm}/${yyyy}`;
};

export const isValidTime = (value: string): boolean => {
  const match = TIME_RE.exec(value.trim());
  if (!match) return false;
  const h = Number(match[1]);
  const m = Number(match[2]);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
};

export const timeToApiFormat = (value: string): string => `${value.trim()}:00`;

export const apiTimeToDisplay = (value: string): string => value.slice(0, 5);

export const isFutureDateTime = (dateBR: string, timeStr?: string): boolean => {
  const date = parseBRDate(dateBR);
  if (!date) return false;
  if (timeStr) {
    const match = TIME_RE.exec(timeStr.trim());
    if (!match) return false;
    date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  } else {
    date.setHours(23, 59, 59, 999);
  }
  return date.getTime() > Date.now();
};
