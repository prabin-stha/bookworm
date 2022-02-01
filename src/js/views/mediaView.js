// Observing the size of the body element and performing some operations
const bodyObserver = new ResizeObserver(entries => {
  const searchBox = document.querySelector('.search__box');
  const bookmarks = document.querySelector('.bookmarks-btn');
  const bodyObj = entries[0];

  if (bodyObj.contentRect.width >= 600) {
    // Tablet view or greater
    searchBox.placeholder = 'Search over 1,000,000 of books';
    bookmarks.innerHTML =
      'Bookmarks&nbsp;&nbsp;<i class="far fa-bookmark"></i>';
  } else if (bodyObj.contentRect.width < 600) {
    //Mobile view
    searchBox.placeholder = 'Search Books';
    bookmarks.innerHTML = '<i class="far fa-bookmark"></i>';
  }
});

bodyObserver.observe(document.querySelector('body'));

function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}

window.addEventListener('resize', appHeight);
appHeight();
