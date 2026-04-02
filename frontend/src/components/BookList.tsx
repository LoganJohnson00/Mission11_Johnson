import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/BooksAPI';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('');
  const navigate = useNavigate();
  const [openBookId, setOpenBookId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNum, selectedCategories);

        let sortedBooks = data.books;
        if (sortOrder === 'asc') {
          sortedBooks = [...data.books].sort((a: Book, b: Book) =>
            a.title.localeCompare(b.title)
          );
        } else if (sortOrder === 'desc') {
          sortedBooks = [...data.books].sort((a: Book, b: Book) =>
            b.title.localeCompare(a.title)
          );
        }

        setBooks(sortedBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]);

  if (loading) return <p>Loading Projects...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className={`btn btn-sm ${sortOrder ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => {
            if (sortOrder === '') setSortOrder('asc');
            else if (sortOrder === 'asc') setSortOrder('desc');
            else setSortOrder('');
          }}
        >
          Sort by Title{' '}
          {sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : ''}
        </button>
      </div>

      <div className="accordion" id="bookAccordion">
        {books.map((b) => (
          <div className="accordion-item" key={b.bookId}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${openBookId === b.bookId ? '' : 'collapsed'}`}
                type="button"
                onClick={() =>
                  setOpenBookId(openBookId === b.bookId ? null : b.bookId)
                }
              >
                {b.title} — ${b.price.toFixed(2)}
              </button>
            </h2>
            <div
              className={`accordion-collapse collapse ${openBookId === b.bookId ? 'show' : ''}`}
            >
              <div className="accordion-body">
                <ul className="list-unstyled mb-2">
                  <li>
                    <strong>Author:</strong> {b.author}
                  </li>
                  <li>
                    <strong>Publisher:</strong> {b.publisher}
                  </li>
                  <li>
                    <strong>ISBN:</strong> {b.isbn}
                  </li>
                  <li>
                    <strong>Classification:</strong> {b.classification}
                  </li>
                  <li>
                    <strong>Category:</strong> {b.category}
                  </li>
                  <li>
                    <strong>Page Count:</strong> {b.pageCount}
                  </li>
                  <li>
                    <strong>Price:</strong> ${b.price.toFixed(2)}
                  </li>
                </ul>
                <button
                  className="btn btn-success"
                  onClick={() =>
                    navigate(`/purchase/${b.title}/${b.bookId}/${b.price}`)
                  }
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center align-items-center gap-2 my-3">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={`btn btn-sm ${pageNum === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setPageNum(i + 1)}
            disabled={pageNum === i + 1}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-primary btn-sm"
          disabled={pageNum === totalPages}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>

      <div className="text-center mb-4">
        <label>
          Results per page:{' '}
          <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={pageSize}
            onChange={(p) => {
              setPageSize(Number(p.target.value));
              setPageNum(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default BookList;
