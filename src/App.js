import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookTable from './components/BookTable';
import Pagination from './components/Pagination';
import Search from './components/Search';
delete axios.defaults.headers.common["X-Requested-With"];


const App = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [searchAuthor, setSearchAuthor] = useState('');
  

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://openlibrary.org/subjects/science_fiction.json?limit=100');
        const works = response.data.works;
        const detailedBooks = await Promise.all(
          works.map(async (work) => {
            const workDetails = await axios.get(`https://openlibrary.org${work.key}.json`);
            const authorDetails = workDetails.data.authors ? await axios.get(`https://openlibrary.org${workDetails.data.authors[0].author.key}.json`) : {};
            const rating = await axios.get(`https://openlibrary.org${work.key}/ratings.json`);
            const top = await axios.get(`https://openlibrary.org/search/authors.json?q=${authorDetails.data.name}`);

            return {
              key: work.key,
              title: workDetails.data.title,
              first_publish_year: workDetails.data.first_publish_date ? workDetails.data.first_publish_date : 'N/A',
              subject: workDetails.data.subjects ? workDetails.data.subjects : 'N/A',
              ratings_average: rating.data.summary.average ? rating.data.summary.average.toFixed(1) : 'N/A',
              author_name: authorDetails.data ? authorDetails.data.name : 'N/A',
              author_birth_date: authorDetails.data ? authorDetails.data.birth_date : 'N/A',
              author_top_work: top.data.docs[0] ? top.data.docs[0].top_work : 'N/A',
            };
          })
        );

        setBooks(detailedBooks);
        setFilteredBooks(detailedBooks); // Initialize filteredBooks with all books
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.author_name.toLowerCase().includes(searchAuthor.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchAuthor, books]);

  const sortedBooks = React.useMemo(() => {
    let sortableBooks = [...filteredBooks];
    if (sortConfig !== null) {
      sortableBooks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBooks;
  }, [filteredBooks, sortConfig]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (key, updatedBook) => {
    setBooks(books.map((book) => (book.key === key ? updatedBook : book)));
  };

  
  const handleSearch = (query) => {
    setSearchAuthor(query);
  };

  const downloadCSV = () => {
    const headers = [
      'Ratings Average',
      'Author Name',
      'Title',
      'First Publish Year',
      'Subject',
      'Author Birth Date',
      'Author Top Work',
    ];

    const rows = currentBooks.map((book) => [
      book.ratings_average,
      book.author_name,
      book.title,
      book.first_publish_year,
      book.subject ? book.subject.join(', ') : 'N/A',
      book.author_birth_date,
      book.author_top_work,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'books.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <button onClick={downloadCSV}>Download CSV</button>
      <Search onSearch={handleSearch} />
      <BookTable books={currentBooks} loading={loading} onSort={handleSort} onEdit={handleEdit}/>
      <Pagination
        booksPerPage={booksPerPage}
        totalBooks={filteredBooks.length}
        paginate={setCurrentPage}
        setBooksPerPage={setBooksPerPage}
      />
    </div>
  );
};

export default App;
