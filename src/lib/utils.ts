import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formDate(date:Date |string):string{
  return new Date(date).toLocaleString()
}

export function formatDuration(duration:number):string {
  if(duration < 1 ){
    return `${(duration * 1000).toFixed(2)}μs`;
  }
 if(duration < 1000){
  return `${duration .toFixed(2)}ms`
 }
 return `${(duration /1000).toFixed(2)}s`
}

