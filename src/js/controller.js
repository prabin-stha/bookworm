//Bookmark Open/Close
const bookmarkBtn = document.querySelector('.bookmarks-btn');
const bookmarks = document.querySelector('.bookmarks');
const bookmarkOverlay = document.querySelector('.bookmarks-overlay');
const bookmarksClose = document.querySelector('.bookmarks-header span');

function addBookmark() {
  bookmarks.classList.add('active');
  bookmarkOverlay.classList.add('active');
}
function removeBookmark() {
  bookmarks.classList.remove('active');
  bookmarkOverlay.classList.remove('active');
}

bookmarkBtn.addEventListener('click', addBookmark);
bookmarkOverlay.addEventListener('click', removeBookmark);
bookmarksClose.addEventListener('click', removeBookmark);
document.addEventListener('keydown', e => {
  if (e.key == 'Escape') {
    removeBookmark();
  }
});
