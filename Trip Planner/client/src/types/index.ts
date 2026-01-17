export interface Trip {
  id: number;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  createdAt: string;
  expenses: Expense[];
  activities: Activity[];
}

export interface Expense {
  id: number;
  tripId: number;
  amount: number;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
}

export interface Activity {
  id: number;
  tripId: number;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category: string;
  createdAt: string;
}

export interface ExpenseSummary {
  totalAmount: number;
  expenseCount: number;
  byCategory: Record<string, number>;
}

export interface DayItinerary {
  date: string;
  activities: Activity[];
}
