// types/index.ts

// Type for a user object
export interface User {
    id: string;
    fullName: string;
    username: string;
    tokenIdentifier: string;
    title: string;
    about: string;
    bio?: string;
    portfolioUrls?: string[];
    profileImageUrl?: string;
    favoritedSellerIds?: string[];
    customTag?: string;
    userType: "Contractor" | "Business";
    calendarEvents?: CalendarEvent[];
    jobIds?: string[];
  }
  
  // Type for a calendar event
  export interface CalendarEvent {
    date: string; // ISO date string
    hours: string[]; // Array of time ranges like ["14:00-15:00"]
    jobId?: string; // Optional job ID associated with the event
  }
  
  // Type for job information, if needed
  export interface Job {
    id: string;
    title: string;
    description: string;
    userId: string; // Reference to the user
    // Additional fields as necessary
  }
  
  // Type for user credentials
  export interface UserCredentials {
    username: string;
    password: string;
  }
  
  // Type for authentication result
  export interface AuthResult {
    user: User | null;
    token: string | null;
  }
  