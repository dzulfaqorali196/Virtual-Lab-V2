import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human readable string
 * Supports both Date objects and timestamps
 */
export function formatDate(date: Date | number): string {
  try {
    const d = typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    }).format(d);
  } catch (error) {
    console.error('Error formatting date:', error);
    // Fallback yang lebih aman menggunakan Date methods
    try {
      const d = typeof date === 'number' ? new Date(date) : date;
      const year = d instanceof Date ? d.getFullYear() : new Date().getFullYear();
      const month = d instanceof Date ? String(d.getMonth() + 1).padStart(2, '0') : '01';
      const day = d instanceof Date ? String(d.getDate()).padStart(2, '0') : '01';
      return `${day}-${month}-${year}`;
    } catch (fallbackError) {
      console.error('Fallback formatting failed:', fallbackError);
      return 'Invalid Date';
    }
  }
}

/**
 * Format duration in seconds to a human readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} detik`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes} menit ${remainingSeconds} detik`
}

export function formatMinutes(minutes: number): string {
  // Handle invalid or zero input
  if (!minutes || minutes < 0) return '0 menit'
  
  // Convert to absolute integer
  const mins = Math.floor(Math.abs(minutes))
  
  // Less than 60 minutes - show in minutes
  if (mins < 60) {
    return `${mins} menit`
  }
  
  // Less than 24 hours - show in hours and minutes
  if (mins < 1440) { // 24 * 60 = 1440 minutes in a day
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return remainingMins > 0 
      ? `${hours} jam ${remainingMins} menit`
      : `${hours} jam`
  }
  
  // Less than 7 days - show in days and hours
  if (mins < 10080) { // 7 * 24 * 60 = 10080 minutes in a week
    const days = Math.floor(mins / 1440)
    const remainingHours = Math.floor((mins % 1440) / 60)
    return remainingHours > 0 
      ? `${days} hari ${remainingHours} jam`
      : `${days} hari`
  }
  
  // Less than 30 days - show in weeks and days
  if (mins < 43200) { // 30 * 24 * 60 = 43200 minutes in a month
    const weeks = Math.floor(mins / 10080)
    const remainingDays = Math.floor((mins % 10080) / 1440)
    return remainingDays > 0 
      ? `${weeks} minggu ${remainingDays} hari`
      : `${weeks} minggu`
  }
  
  // More than 30 days - show in months and weeks
  const months = Math.floor(mins / 43200)
  const remainingWeeks = Math.floor((mins % 43200) / 10080)
  return remainingWeeks > 0 
    ? `${months} bulan ${remainingWeeks} minggu`
    : `${months} bulan`
}