export const NEW_TOOL_DAYS = 30;
export const NEW_TOOLS_PAGE_SIZE = 4;
const UTC_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getUtcDateDaysAgo(days: number, now = new Date()): string {
  const date = new Date(now);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export function getUtcDateString(value: string | null | undefined): string | null {
  const dateString = value?.trim().slice(0, 10);
  if (!dateString || !UTC_DATE_PATTERN.test(dateString)) return null;

  const date = new Date(`${dateString}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateString) return null;

  return dateString;
}

export function isNewTool(wentLive: string | null, now = new Date()): boolean {
  const launchDate = getUtcDateString(wentLive);
  if (!launchDate) return false;

  const today = now.toISOString().slice(0, 10);
  return launchDate >= getUtcDateDaysAgo(NEW_TOOL_DAYS, now) && launchDate <= today;
}
