using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Models;

namespace TripPlanner.API.Data
{
    public class TripPlannerDbContext : DbContext
    {
        public TripPlannerDbContext(DbContextOptions<TripPlannerDbContext> options)
            : base(options)
        {
        }

        public DbSet<Trip> Trips { get; set; } = null!;
        public DbSet<Expense> Expenses { get; set; } = null!;
        public DbSet<Activity> Activities { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Trip entity
            modelBuilder.Entity<Trip>()
                .HasMany(t => t.Expenses)
                .WithOne(e => e.Trip)
                .HasForeignKey(e => e.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Trip>()
                .HasMany(t => t.Activities)
                .WithOne(a => a.Trip)
                .HasForeignKey(a => a.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Expense entity
            modelBuilder.Entity<Expense>()
                .Property(e => e.Amount)
                .HasPrecision(18, 2);

            // Configure Activity entity
            modelBuilder.Entity<Activity>()
                .Property(a => a.StartTime)
                .HasConversion(v => v.HasValue ? v.Value.Ticks : (long?)null,
                              v => v.HasValue ? new TimeSpan(v.Value) : null);

            modelBuilder.Entity<Activity>()
                .Property(a => a.EndTime)
                .HasConversion(v => v.HasValue ? v.Value.Ticks : (long?)null,
                              v => v.HasValue ? new TimeSpan(v.Value) : null);
        }
    }
}
