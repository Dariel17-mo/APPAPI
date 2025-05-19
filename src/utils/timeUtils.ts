
import { format, parse, differenceInMinutes, addMinutes } from "date-fns";

export type TimeEntry = {
  date: Date;
  clockIn: string;
  clockOut: string;
  hoursWorked: number;
  overtimeHours: number;
};

// Regular hours per day (8 hours)
export const REGULAR_HOURS = 9.6;

// Parse time string (HH:mm) to Date object
export const parseTimeString = (dateObj: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(dateObj);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Calculate the difference in hours between two times
export const calculateHours = (clockIn: Date, clockOut: Date): number => {
  const diffInMinutes = differenceInMinutes(clockOut, clockIn);
  return Math.round((diffInMinutes / 60) * 100) / 100; // Round to 2 decimal places
};

// Calculate overtime hours (anything beyond 8 hours)
export const calculateOvertimeHours = (totalHours: number): number => {
  return totalHours > REGULAR_HOURS ? Math.round((totalHours - REGULAR_HOURS) * 100) / 100 : 0;
};

// Format number of hours to string with 2 decimal places
export const formatHours = (hours: number): string => {
  return hours.toFixed(2);
};

// Calculate total overtime from all entries
export const calculateTotalOvertime = (entries: TimeEntry[]): number => {
  return entries.reduce((total, entry) => total + entry.overtimeHours, 0);
};

// Format time for display (e.g., 14:30 -> 02:30 PM)
export const formatTimeForDisplay = (time: string): string => {
  if (!time) return "";
  try {
    const date = parse(time, "HH:mm", new Date());
    return format(date, "hh:mm a");
  } catch (e) {
    return time;
  }
};

// Format date for display (e.g., 2023-05-15 -> May 15, 2023)
export const formatDateForDisplay = (date: Date): string => {
  return format(date, "MMMM d, yyyy");
};

// Format date for the summary report
export const formatDateForReport = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};
