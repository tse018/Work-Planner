namespace TripPlanner.API.Models
{
    public class Trip
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public ICollection<Activity> Activities { get; set; } = new List<Activity>();
    }
}
