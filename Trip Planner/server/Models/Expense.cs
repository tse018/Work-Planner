namespace TripPlanner.API.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty; // Accommodation, Food, Transport, Activity, Other
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Trip? Trip { get; set; }
    }
}
