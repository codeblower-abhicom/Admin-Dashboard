import React from 'react';

const Pagination = ({ booksPerPage, totalBooks, paginate, setBooksPerPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} href="/" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
      <select
        value={booksPerPage}
        onChange={(e) => setBooksPerPage(Number(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};

export default Pagination;
