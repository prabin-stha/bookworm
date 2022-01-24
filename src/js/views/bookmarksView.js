class BookmarksView {
  #parentEl = document.querySelector('.bookmarks-container');
  #data;

  #clear() {
    this.#parentEl.innerHTML = '';
  }

  #clearAndInsert(markup) {
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  #generateBookmarks() {}

  render(data) {
    this.#data = data;
  }

  eventHandlers() {
    const bookmarksBtn = document.querySelector('.bookmarks-btn');
    const bookmarks = document.querySelector('.bookmarks');
    const bookmarksClose = document.querySelector('.bookmarks-header span');
    const overlay = document.querySelector('.overlay');

    function addBookmark() {
      bookmarks.classList.add('active');
      overlay.classList.add('active');
    }
    function removeBookmark() {
      bookmarks.classList.remove('active');
      setTimeout(() => overlay.classList.remove('active'), 100);
    }

    bookmarksBtn.addEventListener('click', addBookmark);
    bookmarksClose.addEventListener('click', removeBookmark);
    overlay.addEventListener('click', () => removeBookmark());
    document.addEventListener('keydown', e => {
      if (e.key == 'Escape') removeBookmark();
    });
  }
}

export default new BookmarksView();
