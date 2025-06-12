import { toZonedTime, format } from 'date-fns-tz';

export function formatUTCToLocal(
  date?: Date | null,
  timeZone = 'Asia/Beirut',
): string | null {
  if (!date) return null;
  const utcDate = typeof date === 'string' ? new Date(date) : date;
  const zonedDate = toZonedTime(utcDate, timeZone);
  zonedDate.setHours(zonedDate.getHours() + 3);
  return format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
}
