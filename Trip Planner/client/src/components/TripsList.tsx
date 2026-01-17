import type { Trip } from '../types';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { formatDate, getDaysUntilTrip } from '../utils/dateUtils';

interface TripsListProps {
  trips: Trip[];
  selectedTrip: Trip | null;
  onSelectTrip: (trip: Trip) => void;
  onDeleteTrip: (id: number) => void;
}

export default function TripsList({
  trips,
  selectedTrip,
  onSelectTrip,
  onDeleteTrip,
}: TripsListProps) {
  if (trips.length === 0) {
    return (
      <Card className="text-center p-5">
        <p className="text-muted">No trips yet. Create one to get started!</p>
      </Card>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {trips.map((trip) => (
        <Card
          key={trip.id}
          className={`cursor-pointer ${selectedTrip?.id === trip.id ? 'border-primary' : ''}`}
          onClick={() => onSelectTrip(trip)}
          style={{ cursor: 'pointer' }}
        >
          <Card.Body>
            <Row className="align-items-start">
              <Col>
                <Card.Title className="mb-2">{trip.name}</Card.Title>
                <div className="mb-2">
                  <Badge bg="info" className="me-2">
                    {trip.destination}
                  </Badge>
                  <Badge bg="success">
                    {getDaysUntilTrip(trip.startDate)} days away
                  </Badge>
                </div>
                <small className="text-muted d-block">
                  📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </small>
                <small className="text-muted d-block">
                  💰 {trip.expenses.length} expenses | 📋 {trip.activities.length} activities
                </small>
              </Col>
              <Col md="auto">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTrip(trip.id);
                  }}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
