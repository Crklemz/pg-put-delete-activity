$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
 $('#bookShelf').on('click', '.isReadBtn', putEditStatusHandler);
 $('#bookShelf').on('click', '.deleteBtn', deleteBookHandler);
}

//passing book id to deleteBook function
function deleteBookHandler() {
  deleteBook($(this).data("id"))
}

function deleteBook(bookId) {
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`
  }).then(response => {
    console.log('deleted book');
    refreshBooks();
  }).catch(err => {
    alert('there was a problem deleting that book. Please try again', err);
  });
}

//function to pass the book id and the status from individual entries - required to update the database
function putEditStatusHandler() {
  editBook($(this).data("id"), "false");
}

//function that works with putEditStatusHandler to send the info to 
//the book.router.js file where the logic is happening
function editBook(bookId, status) {
  $.ajax({
    method: 'PUT',
    url: `/books/${bookId}`,
    data: {
      status: status
    }
  }).then(response => {
    console.log('dubbed a book as read');
    refreshBooks();
  }).catch(err => {
    console.log('issue with editSong', err);
  });
}//end editBook

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td><button class="isReadBtn" data-id="${books[i].id}">Mark as Read</button></td>
        <td><button class="deleteBtn" data-id="${books[i].id}">Delete</button></td>
      </tr>
    `);
  }
}
