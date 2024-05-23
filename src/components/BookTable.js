import React, { useState } from 'react';

const BookTable = ({ books, loading, onSort, onEdit }) => {
  const [editKey, setEditKey] = useState(null);
  const [editedBook, setEditedBook] = useState({});

  const handleEditClick = (book) => {
    setEditKey(book.key);
    setEditedBook(book);
  };

  const handleSaveClick = () => {
    onEdit(editKey, editedBook);
    setEditKey(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBook({ ...editedBook, [name]: value });
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th onClick={() => onSort('ratings_average')}>Ratings Average</th>
          <th onClick={() => onSort('author_name')}>Author Name</th>
          <th onClick={() => onSort('title')}>Title</th>
          <th onClick={() => onSort('first_publish_year')}>First Publish Year</th>
          <th onClick={() => onSort('subject')}>Subject</th>
          <th onClick={() => onSort('author_birth_date')}>Author Birth Date</th>
          <th onClick={() => onSort('author_top_work')}>Author Top Work</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.key}>
            {editKey === book.key ? (
              <>
                <td><input type="text" name="ratings_average" value={editedBook.ratings_average} onChange={handleInputChange} /></td>
                <td><input type="text" name="author_name" value={editedBook.author_name} onChange={handleInputChange} /></td>
                <td><input type="text" name="title" value={editedBook.title} onChange={handleInputChange} /></td>
                <td><input type="text" name="first_publish_year" value={editedBook.first_publish_year} onChange={handleInputChange} /></td>
                <td><input type="text" name="subject" value={editedBook.subject} onChange={handleInputChange} /></td>
                <td><input type="text" name="author_birth_date" value={editedBook.author_birth_date} onChange={handleInputChange} /></td>
                <td><input type="text" name="author_top_work" value={editedBook.author_top_work} onChange={handleInputChange} /></td>
                <td>
                  <button onClick={handleSaveClick}>Save</button>
                </td>
              </>
            ) : (
              <>
                <td>{book.ratings_average}</td>
                <td>{book.author_name}</td>
                <td>{book.title}</td>
                <td>{book.first_publish_year}</td>
                <td>{book.subject ? book.subject.join(', ') : 'N/A'}</td>
                <td>{book.author_birth_date}</td>
                <td>{book.author_top_work}</td>
                <td>
                  <button onClick={() => handleEditClick(book)}>Edit</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookTable;


