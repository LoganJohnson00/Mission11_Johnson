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

        [HttpGet]
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

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookstoreContext.Books.Add(newBook);
            _bookstoreContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook (int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookstoreContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;


            _bookstoreContext.Books.Update(existingBook);
            _bookstoreContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook (int bookId)
        {
            var book = _bookstoreContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new {message = "book not found"});
            }

            _bookstoreContext.Books.Remove(book);
            _bookstoreContext.SaveChanges();

            return NoContent();
        }

    }
}