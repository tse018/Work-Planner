using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Data;
using TripPlanner.API.Models;

namespace TripPlanner.API.Controllers
{
    [ApiController]
    [Route("api/trips/{tripId}/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly TripPlannerDbContext _context;

        public ExpensesController(TripPlannerDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses(int tripId)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return NotFound("Trip not found");

            return await _context.Expenses
                .Where(e => e.TripId == tripId)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpense(int tripId, int id)
        {
            var expense = await _context.Expenses
                .FirstOrDefaultAsync(e => e.Id == id && e.TripId == tripId);

            if (expense == null)
                return NotFound();

            return expense;
        }

        [HttpPost]
        public async Task<ActionResult<Expense>> CreateExpense(int tripId, CreateExpenseRequest request)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return NotFound("Trip not found");

            var expense = new Expense
            {
                TripId = tripId,
                Amount = request.Amount,
                Category = request.Category,
                Date = request.Date,
                Description = request.Description
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpense), new { tripId, id = expense.Id }, expense);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int tripId, int id, UpdateExpenseRequest request)
        {
            var expense = await _context.Expenses
                .FirstOrDefaultAsync(e => e.Id == id && e.TripId == tripId);

            if (expense == null)
                return NotFound();

            expense.Amount = request.Amount;
            expense.Category = request.Category;
            expense.Date = request.Date;
            expense.Description = request.Description;

            _context.Expenses.Update(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int tripId, int id)
        {
            var expense = await _context.Expenses
                .FirstOrDefaultAsync(e => e.Id == id && e.TripId == tripId);

            if (expense == null)
                return NotFound();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("summary")]
        public async Task<ActionResult<ExpenseSummary>> GetExpenseSummary(int tripId)
        {
            var expenses = await _context.Expenses
                .Where(e => e.TripId == tripId)
                .ToListAsync();

            var summary = new ExpenseSummary
            {
                TotalAmount = expenses.Sum(e => e.Amount),
                ExpenseCount = expenses.Count,
                ByCategory = expenses
                    .GroupBy(e => e.Category)
                    .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount))
            };

            return summary;
        }
    }

    public class CreateExpenseRequest
    {
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateExpenseRequest
    {
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Description { get; set; }
    }

    public class ExpenseSummary
    {
        public decimal TotalAmount { get; set; }
        public int ExpenseCount { get; set; }
        public Dictionary<string, decimal> ByCategory { get; set; } = new();
    }
}
