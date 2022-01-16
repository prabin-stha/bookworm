window.onresize = window.onload = function () {
  let width;
  const searchBox = document.querySelector('.search__box');
  const bookmarks = document.querySelector('.bookmarks-btn');
  width = this.innerWidth;
  if (width >= 600) {
    searchBox.placeholder = 'Search over 1,000,000 of books';
    bookmarks.innerHTML = 'Bookmarks&nbsp;<i class="far fa-bookmark"></i>';
  } else if (width < 600) {
    searchBox.placeholder = 'Search Books';
    bookmarks.innerHTML = '<i class="far fa-bookmark"></i>';
  }
};
