import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUTCDateWithMinutes(utcTimestamp: Date) {
  // Create a new Date object from the UTC timestamp
  const date = new Date(utcTimestamp);

  // Define an array of day names and month names
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Get the components of the date
  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  let minutes: string | number = date.getUTCMinutes();

  // Format the minutes to always have two digits
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Create the formatted date string
  return `${dayName} ${monthName} ${day < 10 ? '0' + day : day} ${hours < 10 ? '0' + hours : hours}:${minutes}`;
}

export const formatUTCDate = (utcTimestamp: Date) => {
  // Create a new Date object from the UTC timestamp
  const date = new Date(utcTimestamp);

  // Define an array of day names and month names
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Get the components of the date
  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const day = date.getUTCDate();

  // Create the formatted date string
  return `${dayName} ${monthName} ${day < 10 ? '0' + day : day}`;
};
