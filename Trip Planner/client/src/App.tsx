import { useState, useEffect } from 'react';
import type { Trip } from './types';
import { Container, Row, Col, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { tripAPI } from './services/api';
import TripsList from './components/TripsList';
import TripDetails from './components/TripDetails';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  // Load trips on mount
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const response = await tripAPI.getAll();
      setTrips(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tripAPI.create({
        name: formData.name,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description || undefined,
      });
      setFormData({
        name: '',
        destination: '',
        startDate: '',
        endDate: '',
        description: '',
      });
      setShowTripModal(false);
      await loadTrips();
    } catch (err) {
      setError('Failed to create trip');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id: number) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripAPI.delete(id);
        if (selectedTrip?.id === id) {
          setSelectedTrip(null);
        }
        await loadTrips();
      } catch (err) {
        setError('Failed to delete trip');
      }
    }
  };

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="text-primary mb-2">✈️ Trip Planner</h1>
            <p className="text-muted">Plan your trips, track expenses, and organize your itinerary</p>
          </Col>
          <Col md="auto">
            <Button
              variant="primary"
              onClick={() => setShowTripModal(true)}
              size="lg"
            >
              + New Trip
            </Button>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}

        <Row className="g-4">
          <Col lg={selectedTrip ? 5 : 12}>
            <TripsList
              trips={trips}
              selectedTrip={selectedTrip}
              onSelectTrip={handleSelectTrip}
              onDeleteTrip={handleDeleteTrip}
            />
          </Col>
          {selectedTrip && (
            <Col lg={7}>
              <TripDetails
                trip={selectedTrip}
                onTripUpdated={loadTrips}
                onBackClick={() => setSelectedTrip(null)}
              />
            </Col>
          )}
        </Row>
      </Container>

      {/* Create Trip Modal */}
      <Modal show={showTripModal} onHide={() => setShowTripModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateTrip}>
            <Form.Group className="mb-3">
              <Form.Label>Trip Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Summer Vacation"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Hawaii"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Optional trip description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Creating...' : 'Create Trip'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
