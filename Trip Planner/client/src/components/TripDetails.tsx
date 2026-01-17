import { useState, useEffect } from 'react';
import type { Trip, Expense, Activity } from '../types';
import { Card, Tab, Tabs, Button } from 'react-bootstrap';
import { formatDate } from '../utils/dateUtils';
import ExpenseTracker from './ExpenseTracker';
import ActivityPlanner from './ActivityPlanner';

interface TripDetailsProps {
  trip: Trip;
  onTripUpdated: () => void;
  onBackClick: () => void;
}

export default function TripDetails({
  trip,
  onTripUpdated,
  onBackClick,
}: TripDetailsProps) {
  const [expenses, setExpenses] = useState<Expense[]>(trip.expenses);
  const [activities, setActivities] = useState<Activity[]>(trip.activities);

  useEffect(() => {
    setExpenses(trip.expenses);
    setActivities(trip.activities);
  }, [trip]);

  const handleExpensesUpdate = () => {
    onTripUpdated();
  };

  const handleActivitiesUpdate = () => {
    onTripUpdated();
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div>
      <Button variant="secondary" size="sm" className="mb-3" onClick={onBackClick}>
        ← Back
      </Button>

      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">{trip.name}</h4>
        </Card.Header>
        <Card.Body>
          <p className="mb-1">
            <strong>Destination:</strong> {trip.destination}
          </p>
          <p className="mb-1">
            <strong>Dates:</strong> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </p>
          {trip.description && (
            <p className="mb-0">
              <strong>Description:</strong> {trip.description}
            </p>
          )}
        </Card.Body>
      </Card>

      <Tabs defaultActiveKey="expenses" className="mb-4">
        <Tab eventKey="expenses" title={`💰 Expenses ($${totalExpenses.toFixed(2)})`}>
          <div className="mt-3">
            <ExpenseTracker
              tripId={trip.id}
              expenses={expenses}
              onExpensesUpdate={handleExpensesUpdate}
            />
          </div>
        </Tab>
        <Tab eventKey="activities" title={`📋 Activities (${activities.length})`}>
          <div className="mt-3">
            <ActivityPlanner
              tripId={trip.id}
              activities={activities}
              onActivitiesUpdate={handleActivitiesUpdate}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
