class BookmarksView {
  #parentEl = document.querySelector('.bookmarks-container');
  #data;

  /**
   * Clears parent element's innerHTML
   */
  #clear() {
    this.#parentEl.innerHTML = '';
  }

  /**
   * Clears parent element's innerHTML and inserts markup inside it
   * @param {Srring} markup HTML Markup
   */
  #clearAndInsert(markup) {
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Render spinner in parent container
   */
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

  /**
   * Generate and insert book-item-component inside bookmarks container for every workID present inside #data field
   */
  #generateBookmarks() {
    let titleCut = '';
    let authorsCut = '';
    if (
      document.querySelector(
        '.bookmarks-container .loadingio-spinner-double-ring-48jq6smvq69'
      )
    )
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
      // If author length is greater than 40 characters, add ... after it
      authors.length > 40
        ? (authorsCut = authors.substring(0, 40) + '...')
        : (authorsCut = authors);
      let title = el.title ? el.title : 'N.A.';
      // If title length is greater than 16 characters, add ... after it
      title.length > 16
        ? (titleCut = title.substring(0, 16) + '...')
        : (titleCut = title);
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
        <div slot="title" title="${title}">${titleCut}</div>
        <div slot="author" title="${authors}">${authorsCut}</div>
        <div slot="date">${el.publish_date ? el.publish_date : 'N.A.'}</div>
      </book-item-component>
    `;
      this.#parentEl.insertAdjacentHTML('beforeend', markup);
    });
  }

  /**
   * Updates #data field to data from parameter and calls generates bookmarks function for generating book-item-component. This method is called when book-item-component is clicked
   * @param {List} data List of workIds
   */
  render(data) {
    this.#data = data;
    this.#clear();
    this.#generateBookmarks();
  }

  /**
   * Render Error if some error is encountered
   * @param {Object} error Error Object
   */
  renderError(error) {
    const markup = `
    <div class="error">
      <p class="msg">
        <span><i class="fas fa-exclamation-circle"></i></span>&nbsp;&nbsp;${error}
      </p>
    </div>
    `;
    this.#clearAndInsert(markup);
  }

  /**
   * If data field is empty list, render empty message
   */
  renderEmptyMessage() {
    this.#clear();
    this.#parentEl.insertAdjacentHTML(
      'afterbegin',
      '<p><span><i class="fas fa-exclamation-circle"></i></span>&nbsp;&nbsp;Seems like you haven\'t added any bookmarks yet!</p>'
    );
  }

  /**
   * When bookmarks btn is clicked execute bookmarksController
   * @param {Function} handler bookmarksController from controller.js
   */
  bookmarkEventHandler(handler) {
    const bookmarksBtn = document.querySelector('.bookmarks-btn');

    /**
     * handle function is created to prevent bookmarksController from running many times when bookmarks button is pressed again and again. This function will removeEventListner after calling the function. bookmarkEventHaneler will be called in controller again after data is loaded
     */
    const handle = function () {
      handler();
      bookmarksBtn.removeEventListener('click', handle);
    };

    bookmarksBtn.addEventListener('click', handle);
  }

  /**
   * Event handlers for bookmarks opening/closing animation
   */
  eventHandlers() {
    const bookmarks = document.querySelector('.bookmarks');
    const bookmarksClose = document.querySelector('.bookmarks-header span');
    const overlay = document.querySelector('.overlay');
    const bookmarksBtn = document.querySelector('.bookmarks-btn');

    function openBookmark() {
      bookmarks.classList.add('active');
      overlay.classList.add('active');
    }
    function closeBookmark() {
      bookmarks.classList.remove('active');
      setTimeout(() => overlay.classList.remove('active'), 100);
    }

    bookmarksBtn.addEventListener('click', openBookmark);
    bookmarksClose.addEventListener('click', closeBookmark);
    overlay.addEventListener('click', closeBookmark);
    document.addEventListener('keydown', e => {
      if (e.key == 'Escape') closeBookmark();
    });
  }
}

export default new BookmarksView();
