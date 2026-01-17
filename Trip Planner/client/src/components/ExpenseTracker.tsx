import { useState, useEffect } from 'react';
import type { Expense } from '../types';
import { Card, Button, Modal, Form, Row, Col, ProgressBar, Alert } from 'react-bootstrap';
import { expenseAPI } from '../services/api';
import { formatDate } from '../utils/dateUtils';

interface ExpenseTrackerProps {
  tripId: number;
  expenses: Expense[];
  onExpensesUpdate: () => void;
}

const EXPENSE_CATEGORIES = ['Accommodation', 'Food', 'Transport', 'Activity', 'Other'];

export default function ExpenseTracker({
  tripId,
  expenses: initialExpenses,
  onExpensesUpdate,
}: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await expenseAPI.create(tripId, {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description || undefined,
      });
      setFormData({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setShowModal(false);
      setError(null);
      onExpensesUpdate();
    } catch (err) {
      setError('Failed to add expense');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (confirm('Delete this expense?')) {
      try {
        await expenseAPI.delete(tripId, id);
        onExpensesUpdate();
      } catch (err) {
        setError('Failed to delete expense');
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const expensesByCategory: Record<string, number> = {};

  expenses.forEach((expense) => {
    expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
  });

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-4">
        <h5>Total Spent: ${totalExpenses.toFixed(2)}</h5>
        <div className="mb-3">
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <div key={category} className="mb-2">
              <div className="d-flex justify-content-between mb-1">
                <small>{category}</small>
                <small>${amount.toFixed(2)}</small>
              </div>
              <ProgressBar
                now={(amount / Math.max(totalExpenses, 1)) * 100}
                label={`${((amount / Math.max(totalExpenses, 1)) * 100).toFixed(0)}%`}
                variant="success"
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3 w-100"
      >
        + Add Expense
      </Button>

      <div className="d-flex flex-column gap-2">
        {expenses.length === 0 ? (
          <p className="text-muted">No expenses yet</p>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id} className="p-3">
              <Row className="align-items-center">
                <Col>
                  <div>
                    <strong>{expense.category}</strong>
                    <br />
                    <small className="text-muted">{expense.description}</small>
                    <br />
                    <small className="text-muted">{formatDate(expense.date)}</small>
                  </div>
                </Col>
                <Col md="auto" className="text-end">
                  <div className="fw-bold text-success mb-2">${expense.amount.toFixed(2)}</div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddExpense}>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Hotel booking"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
