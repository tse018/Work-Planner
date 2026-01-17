using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Data;
using TripPlanner.API.Models;

namespace TripPlanner.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripsController : ControllerBase
    {
        private readonly TripPlannerDbContext _context;

        public TripsController(TripPlannerDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            return await _context.Trips
                .Include(t => t.Expenses)
                .Include(t => t.Activities)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(int id)
        {
            var trip = await _context.Trips
                .Include(t => t.Expenses)
                .Include(t => t.Activities)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null)
            {
                return NotFound();
            }

            return trip;
        }

        [HttpPost]
        public async Task<ActionResult<Trip>> CreateTrip(CreateTripRequest request)
        {
            var trip = new Trip
            {
                Name = request.Name,
                Destination = request.Destination,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Description = request.Description
            };

            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, trip);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(int id, UpdateTripRequest request)
        {
            var trip = await _context.Trips.FindAsync(id);

            if (trip == null)
            {
                return NotFound();
            }

            trip.Name = request.Name;
            trip.Destination = request.Destination;
            trip.StartDate = request.StartDate;
            trip.EndDate = request.EndDate;
            trip.Description = request.Description;

            _context.Trips.Update(trip);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);

            if (trip == null)
            {
                return NotFound();
            }

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CreateTripRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateTripRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Description { get; set; }
    }
}
