using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Data;

namespace Bookstore.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookstoreController : ControllerBase
    {
        private BookstoreDbContext _bookstoreContext;
        
        public BookstoreController(BookstoreDbContext temp) => _bookstoreContext = temp;

        public IEnumerable<Book> GetBooks()
        {
            return _bookstoreContext.Books.ToList();
        }

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize, int pageNum,[FromQuery] List<string>? categories = null)
        {
            var query = _bookstoreContext.Books.AsQueryable();

            if (categories != null && categories.Any())
            {
                query = query.Where(p => categories.Contains(p.Category));
            }

            var totalNumBooks = query.Count();

            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            
        
            var someObject = new
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            };
                
            return Ok(someObject);
        }

        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookstoreContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();
            
            return Ok(categories);
        }

    }
}