import axios from 'axios';
import type { Trip, Expense, Activity, ExpenseSummary, DayItinerary } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Trips API
export const tripAPI = {
  getAll: () => apiClient.get<Trip[]>('/trips'),
  getById: (id: number) => apiClient.get<Trip>(`/trips/${id}`),
  create: (trip: Omit<Trip, 'id' | 'createdAt' | 'expenses' | 'activities'>) =>
    apiClient.post<Trip>('/trips', trip),
  update: (id: number, trip: Omit<Trip, 'id' | 'createdAt' | 'expenses' | 'activities'>) =>
    apiClient.put<void>(`/trips/${id}`, trip),
  delete: (id: number) => apiClient.delete<void>(`/trips/${id}`),
};

// Expenses API
export const expenseAPI = {
  getAll: (tripId: number) => apiClient.get<Expense[]>(`/trips/${tripId}/expenses`),
  getById: (tripId: number, id: number) =>
    apiClient.get<Expense>(`/trips/${tripId}/expenses/${id}`),
  create: (tripId: number, expense: Omit<Expense, 'id' | 'tripId' | 'createdAt'>) =>
    apiClient.post<Expense>(`/trips/${tripId}/expenses`, expense),
  update: (tripId: number, id: number, expense: Omit<Expense, 'id' | 'tripId' | 'createdAt'>) =>
    apiClient.put<void>(`/trips/${tripId}/expenses/${id}`, expense),
  delete: (tripId: number, id: number) =>
    apiClient.delete<void>(`/trips/${tripId}/expenses/${id}`),
  getSummary: (tripId: number) =>
    apiClient.get<ExpenseSummary>(`/trips/${tripId}/expenses/summary`),
};

// Activities API
export const activityAPI = {
  getAll: (tripId: number) => apiClient.get<Activity[]>(`/trips/${tripId}/activities`),
  getById: (tripId: number, id: number) =>
    apiClient.get<Activity>(`/trips/${tripId}/activities/${id}`),
  create: (tripId: number, activity: Omit<Activity, 'id' | 'tripId' | 'createdAt'>) =>
    apiClient.post<Activity>(`/trips/${tripId}/activities`, activity),
  update: (tripId: number, id: number, activity: Omit<Activity, 'id' | 'tripId' | 'createdAt'>) =>
    apiClient.put<void>(`/trips/${tripId}/activities/${id}`, activity),
  delete: (tripId: number, id: number) =>
    apiClient.delete<void>(`/trips/${tripId}/activities/${id}`),
  getByDate: (tripId: number) =>
    apiClient.get<DayItinerary[]>(`/trips/${tripId}/activities/by-date`),
};
