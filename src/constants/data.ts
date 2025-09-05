import { Trip, FeatureCardData, StepData } from "@/types";
import {
  IconShield,
  IconList,
  IconDoc,
  IconSpark,
  IconCalendar,
  IconCheck
} from "@/components/icons";

// Dummy trip data
export const dummyTrips: Trip[] = [
  {
    id: "1",
    title: "Tokyo Business Trip",
    destination: "Tokyo, Japan",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    status: "Planning",
    statusColor:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    modules: ["BorderBuddy"],
    userId: "user-1",
  },
  {
    id: "2",
    title: "European Backpacking",
    destination: "Multiple Cities, Europe",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    status: "Ready to Go",
    statusColor:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    modules: ["BorderBuddy", "FlightTracker", "Accommodation"],
    userId: "user-1"
  },
];

// Landing page features data
export interface FeatureData {
  iconName: string;
  title: string;
  body: string;
}

export const featuresData: FeatureData[] = [
  {
    iconName: "shield",
    title: "Visa Compliance",
    body: "Get personalized visa requirements and entry guidelines based on your nationality, destination, and travel purpose.",
  },
  {
    iconName: "list",
    title: "Smart Checklists",
    body: "AI‑generated preparation checklists with time‑based deadlines to ensure you never miss important steps.",
  },
  {
    iconName: "doc",
    title: "Document Manager",
    body: "Securely store and organize all your travel documents in one place with easy access when you need them.",
  },
  {
    iconName: "spark",
    title: "Expert Q&A",
    body: "Ask specific questions about your travel requirements and get instant, personalized answers from our AI.",
  },
  {
    iconName: "calendar",
    title: "Trip Planning",
    body: "Organize multiple trips with comprehensive planning tools for each destination and travel module.",
  },
  {
    iconName: "check",
    title: "Timeline Management",
    body: "Never miss a deadline with intelligent scheduling that accounts for processing times and requirements.",
  },
];

// Landing page steps data
export interface StepData {
  num: number;
  title: string;
  desc: string;
}

export const stepsData: StepData[] = [
  {
    num: 1,
    title: "Create Your Trip",
    desc: "Tell us about your destination, travel dates, and purpose. Our AI will understand your unique situation.",
  },
  {
    num: 2,
    title: "Get Your Brief",
    desc: "Receive a personalized compliance report with visa requirements, document needs, and important notices.",
  },
  {
    num: 3,
    title: "Travel Ready",
    desc: "Follow your personalized checklist, upload documents, and get ready for stress‑free travel.",
  },
];
