const bodyObserver = new ResizeObserver(entries => {
  const searchBox = document.querySelector('.search__box');
  const bookmarks = document.querySelector('.bookmarks-btn');
  const bodyObj = entries[0];
  if (bodyObj.contentRect.width >= 600) {
    searchBox.placeholder = 'Search over 1,000,000 of books';
    bookmarks.innerHTML =
      'Bookmarks&nbsp;&nbsp;<i class="far fa-bookmark"></i>';
  } else if (bodyObj.contentRect.width < 600) {
    searchBox.placeholder = 'Search Books';
    bookmarks.innerHTML = '<i class="far fa-bookmark"></i>';
  }
});
bodyObserver.observe(document.querySelector('body'));
