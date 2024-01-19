import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatUnixTimestamp(unixTimestamp: number, format = "full") {
    const date = new Date(unixTimestamp * 1000);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'pm' : 'am';

    const formattedHour = hour % 12 || 12;

    switch (format) {
        case "date":
            return `${month} ${day}`;
        case "dateYear":
            return `${month} ${day} ${year}`;
        case "full":
        default:
            return `${month} ${day}, ${year} ${formattedHour}:${minute}${ampm}`;
    }
}

export function formatIsoTimestamp(isoTimestamp: string, format = "full") {
    const date = new Date(isoTimestamp);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'pm' : 'am';

    const formattedHour = hour % 12 || 12;

    switch (format) {
        case "date":
            return `${month} ${day}`;
        case "dateYear":
            return `${month} ${day}, ${year}`;
        case "full":
        default:
            return `${month} ${day}, ${year} ${formattedHour}:${minute}${ampm}`;
    }
}



