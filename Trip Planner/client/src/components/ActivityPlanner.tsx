import { useState, useEffect } from 'react';
import type { Activity } from '../types';
import { Card, Button, Modal, Form, Row, Col, Alert, Accordion, Badge } from 'react-bootstrap';
import { activityAPI } from '../services/api';
import { formatDate, formatTime } from '../utils/dateUtils';

interface ActivityPlannerProps {
  tripId: number;
  activities: Activity[];
  onActivitiesUpdate: () => void;
}

const ACTIVITY_CATEGORIES = ['Sightseeing', 'Dining', 'Transport', 'Shopping', 'Other'];

export default function ActivityPlanner({
  tripId,
  activities: initialActivities,
  onActivitiesUpdate,
}: ActivityPlannerProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    location: '',
    category: 'Sightseeing',
  });

  useEffect(() => {
    setActivities(initialActivities);
  }, [initialActivities]);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const startTimeSpan = formData.startTime
        ? `${formData.startTime}:00`.slice(0, 8)
        : undefined;
      const endTimeSpan = formData.endTime
        ? `${formData.endTime}:00`.slice(0, 8)
        : undefined;

      await activityAPI.create(tripId, {
        title: formData.title,
        description: formData.description || undefined,
        date: formData.date,
        startTime: startTimeSpan,
        endTime: endTimeSpan,
        location: formData.location || undefined,
        category: formData.category,
      });

      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        location: '',
        category: 'Sightseeing',
      });
      setShowModal(false);
      setError(null);
      onActivitiesUpdate();
    } catch (err) {
      setError('Failed to add activity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (confirm('Delete this activity?')) {
      try {
        await activityAPI.delete(tripId, id);
        onActivitiesUpdate();
      } catch (err) {
        setError('Failed to delete activity');
      }
    }
  };

  // Group activities by date
  const activitiesByDate: Record<string, Activity[]> = {};
  activities.forEach((activity) => {
    const dateKey = activity.date;
    if (!activitiesByDate[dateKey]) {
      activitiesByDate[dateKey] = [];
    }
    activitiesByDate[dateKey].push(activity);
  });

  const sortedDates = Object.keys(activitiesByDate).sort();

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3 w-100"
      >
        + Add Activity
      </Button>

      {activities.length === 0 ? (
        <p className="text-muted">No activities planned yet</p>
      ) : (
        <Accordion>
          {sortedDates.map((date) => (
            <Accordion.Item eventKey={date} key={date}>
              <Accordion.Header>
                📅 {formatDate(date)} ({activitiesByDate[date].length} activities)
              </Accordion.Header>
              <Accordion.Body>
                <div className="d-flex flex-column gap-2">
                  {activitiesByDate[date]
                    .sort((a, b) => {
                      if (!a.startTime || !b.startTime) return 0;
                      return a.startTime.localeCompare(b.startTime);
                    })
                    .map((activity) => (
                      <Card key={activity.id} className="p-3">
                        <Row className="align-items-start">
                          <Col>
                            <div>
                              <strong>{activity.title}</strong>
                              <br />
                              <Badge bg="info" className="me-2 mb-2">
                                {activity.category}
                              </Badge>
                              {activity.description && (
                                <>
                                  <br />
                                  <small>{activity.description}</small>
                                  <br />
                                </>
                              )}
                              {activity.startTime && (
                                <>
                                  <small className="text-muted">
                                    🕐 {formatTime(activity.startTime)}
                                    {activity.endTime && ` - ${formatTime(activity.endTime)}`}
                                  </small>
                                  <br />
                                </>
                              )}
                              {activity.location && (
                                <small className="text-muted">📍 {activity.location}</small>
                              )}
                            </div>
                          </Col>
                          <Col md="auto">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteActivity(activity.id)}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddActivity}>
            <Form.Group className="mb-3">
              <Form.Label>Activity Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Visit Eiffel Tower"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
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
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Paris, France"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="e.g., Don't forget to book tickets in advance"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Adding...' : 'Add Activity'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
