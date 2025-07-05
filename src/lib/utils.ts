import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Route } from "react-router-dom";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// <Route path="/facetracker" element={<FaceTracker />} />
