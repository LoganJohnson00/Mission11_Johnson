import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `categories=${encodeURIComponent(cat)}`)
        .join('&');

      const response = await fetch(
        `http://localhost:5000/bookstore/allbooks?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`
      );
      const data = await response.json();
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
    };

    fetchBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]);

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

      {books.map((b) => (
        <div className="card shadow-sm mb-3" key={b.bookId}>
          <div className="card-body">
            <h5 className="card-title">{b.title}</h5>
            <ul className="list-unstyled mb-0">
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
              onClick={() => navigate(`/donate/${b.title}/${b.bookId}`)}
            >
              Purchase
            </button>
          </div>
        </div>
      ))}

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
