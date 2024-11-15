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