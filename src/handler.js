const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (_request, _h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = _request.payload;

  if (name === undefined) {
    const response = _h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = _h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = _h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = _h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = (_request, _h) => {
  const { name, reading, finished } = _request.query;
  let queryBook = books;

  if (name) {
    queryBook = queryBook.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading) {
    queryBook = queryBook.filter((book) => Number(book.reading) === Number(reading));
  }

  if (finished) {
    queryBook = queryBook.filter((book) => Number(book.finished) === Number(finished));
  }

  const response = _h.response({
    status: 'success',
    data: {
      books: queryBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (_request, _h) => {
  const { id } = _request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book) {
    const response = _h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }

  const response = _h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookByIdHandler = (_request, _h) => {
  const { id } = _request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = _request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name === undefined) {
      const response = _h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });

      response.code(400);
      return response;
    }
    if (pageCount < readPage) {
      const response = _h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });

      response.code(400);
      return response;
    }

    const finished = pageCount === readPage;

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = _h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = _h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookByIdHandler = (_request, _h) => {
  const { id } = _request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = _h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = _h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
