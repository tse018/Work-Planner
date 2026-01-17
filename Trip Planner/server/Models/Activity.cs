namespace TripPlanner.API.Models
{
    public class Activity
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string? Location { get; set; }
        public string Category { get; set; } = string.Empty; // Sightseeing, Dining, Transport, Shopping, Other
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Trip? Trip { get; set; }
    }
}
