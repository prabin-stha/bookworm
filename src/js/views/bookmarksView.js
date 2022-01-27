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

  renderSpinner() {
    const markup = `
    <div class="loadingio-spinner-double-ring-48jq6smvq69">
      <div class="ldio-r3slmbus1r">
        <div></div>
        <div></div>
        <div><div></div></div>
        <div><div></div></div>
      </div>
    </div>
    `;
    this.#clearAndInsert(markup);
  }

  #generateBookmarks() {
    if (document.querySelector('.loadingio-spinner-double-ring-48jq6smvq69'))
      document
        .querySelector('.loadingio-spinner-double-ring-48jq6smvq69')
        .remove();
    this.#clear();
    this.#data.forEach(el => {
      let authors = el.authors
        ? el.authors
            .map(function (author) {
              return `${author[0]}`;
            })
            .join(', ')
        : 'N.A.';
      if (authors.length > 40) authors = authors.substring(0, 40) + '...';
      let title = el.title ? el.title : 'N.A.';
      if (title.length > 16) title = title.substring(0, 16) + '...';
      const markup = `
      <book-item-component
        url="${
          el.covers
            ? `https://covers.openlibrary.org/b/id/${el.covers}-M.jpg`
            : `${na}`
        }"
        padding="0"
        justify-content="center"
        book-id="${el.key}"
      >
        <div slot="title">${title}</div>
        <div slot="author">${authors}</div>
        <div slot="date">${el.publish_date ? el.publish_date : 'N.A.'}</div>
      </book-item-component>
    `;
      this.#parentEl.insertAdjacentHTML('beforeend', markup);
    });
  }

  render(data) {
    this.#data = data;
    this.#clear();
    this.#generateBookmarks();
  }

  renderEmptyMessage() {
    this.#clear();
    this.#parentEl.insertAdjacentHTML(
      'afterbegin',
      '<p><span><i class="fas fa-exclamation-circle"></i></span>&nbsp;&nbsp;Seems like you haven\'t added any bookmarks yet!</p>'
    );
  }

  bookmarkEventHandler(handler) {
    const bookmarksBtn = document.querySelector('.bookmarks-btn');
    const overlay = document.querySelector('.overlay');
    const bookmarks = document.querySelector('.bookmarks');

    function addBookmark() {
      bookmarks.classList.add('active');
      overlay.classList.add('active');
    }

    bookmarksBtn.addEventListener('click', () => {
      addBookmark();
      handler();
    });
  }

  eventHandlers() {
    const bookmarks = document.querySelector('.bookmarks');
    const bookmarksClose = document.querySelector('.bookmarks-header span');
    const overlay = document.querySelector('.overlay');

    function removeBookmark() {
      bookmarks.classList.remove('active');
      setTimeout(() => overlay.classList.remove('active'), 100);
    }

    bookmarksClose.addEventListener('click', () => removeBookmark());
    overlay.addEventListener('click', () => removeBookmark());
    document.addEventListener('keydown', e => {
      if (e.key == 'Escape') removeBookmark();
    });
  }
}

export default new BookmarksView();
