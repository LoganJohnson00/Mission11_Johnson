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
        public IActionResult GetBooks(int pageSize, int pageNum)
        {
            var something = _bookstoreContext.Books
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            
            var totalNumBooks = _bookstoreContext.Books.Count();
        
            var someObject = new
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            };
                
            return Ok(someObject);
        }

    }
}