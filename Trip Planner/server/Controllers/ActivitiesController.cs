using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Data;
using TripPlanner.API.Models;

namespace TripPlanner.API.Controllers
{
    [ApiController]
    [Route("api/trips/{tripId}/[controller]")]
    public class ActivitiesController : ControllerBase
    {
        private readonly TripPlannerDbContext _context;

        public ActivitiesController(TripPlannerDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities(int tripId)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return NotFound("Trip not found");

            return await _context.Activities
                .Where(a => a.TripId == tripId)
                .OrderBy(a => a.Date)
                .ThenBy(a => a.StartTime)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(int tripId, int id)
        {
            var activity = await _context.Activities
                .FirstOrDefaultAsync(a => a.Id == id && a.TripId == tripId);

            if (activity == null)
                return NotFound();

            return activity;
        }

        [HttpPost]
        public async Task<ActionResult<Activity>> CreateActivity(int tripId, CreateActivityRequest request)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return NotFound("Trip not found");

            var activity = new Activity
            {
                TripId = tripId,
                Title = request.Title,
                Description = request.Description,
                Date = request.Date,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Location = request.Location,
                Category = request.Category
            };

            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetActivity), new { tripId, id = activity.Id }, activity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(int tripId, int id, UpdateActivityRequest request)
        {
            var activity = await _context.Activities
                .FirstOrDefaultAsync(a => a.Id == id && a.TripId == tripId);

            if (activity == null)
                return NotFound();

            activity.Title = request.Title;
            activity.Description = request.Description;
            activity.Date = request.Date;
            activity.StartTime = request.StartTime;
            activity.EndTime = request.EndTime;
            activity.Location = request.Location;
            activity.Category = request.Category;

            _context.Activities.Update(activity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(int tripId, int id)
        {
            var activity = await _context.Activities
                .FirstOrDefaultAsync(a => a.Id == id && a.TripId == tripId);

            if (activity == null)
                return NotFound();

            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("by-date")]
        public async Task<ActionResult<IEnumerable<DayItinerary>>> GetActivitiesByDate(int tripId)
        {
            var activities = await _context.Activities
                .Where(a => a.TripId == tripId)
                .OrderBy(a => a.Date)
                .ThenBy(a => a.StartTime)
                .ToListAsync();

            var grouped = activities
                .GroupBy(a => a.Date.Date)
                .Select(g => new DayItinerary
                {
                    Date = g.Key,
                    Activities = g.ToList()
                })
                .ToList();

            return grouped;
        }
    }

    public class CreateActivityRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string? Location { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class UpdateActivityRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string? Location { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class DayItinerary
    {
        public DateTime Date { get; set; }
        public List<Activity> Activities { get; set; } = new();
    }
}
