//Polyfilling JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//Importing model
import * as model from './model.js';

//Importing Views
import bookView from './views/bookView';
import searchView from './views/searchView';
import bookmarksView from './views/bookmarksView.js';
import loadMoreView from './views/loadMoreView.js';

(function () {
  /**
   * *Book Item Custom Web Component
   */
  const template = document.createElement('template');
  template.innerHTML = `
  <style>
    *{
        margin: 0;
        box-sizing: border-box;
    }
    .search-item {
        display: flex;
        max-width: 250px;
        flex-direction: row;
        gap: 10px;
    }

    img {
        border-radius: 5px;
        cursor: pointer;
    }         

    h4 {
        font-size: 16px;
        color: #4b4b4b;
        font-weight: 600;
        padding-bottom: 4px;
    }

    h5 {
        font-size: 12px;
        color: #6c6c6c;
        padding-bottom: 4px;
    }

    h6 {
        font-size: 10px;
        color: #6c6c6c;
    }
  </style>
  <div class="search-item">
    <figure>
        <img id='book-img' width="70" height="100"/>
    </figure>
    <div class="desc">
        <h4><slot name='title'></h4>
        <h5><slot name='author'></h5>
        <h6><slot name='date'></h6>
    </div>
  </div>
  `;

  class BookItem extends HTMLElement {
    /**
     * *Creating custom HTML Element
     */
    constructor() {
      super();
      // *Attaching the current object to shadow DOM and appending new HTML templete to it's shadow root
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      // *Setting image source, padding and justify-content style for this object component
      this.shadowRoot.querySelector('img').src = this.getAttribute('url');
      this.shadowRoot.querySelector('.search-item').style.paddingBottom =
        this.getAttribute('padding');
      this.shadowRoot.querySelector('.search-item').style.justifyContent =
        this.getAttribute('justify-content');
    }

    // *BookController Here
    async #bookController(bookId) {
      try {
        // Rendering Loading Spinner
        bookView.renderSpinner();

        //loading Book Info
        await model.loadBookInfo(bookId);
        const data = model.state.book;

        //Rendering Book Info
        bookView.render(data);
      } catch (err) {
        // TODO: Handle Error
      }
    }

    #showBookInfo() {
      const bookmarks = document.querySelector('.bookmarks');
      if (bookmarks.classList.contains('active'))
        bookmarks.classList.remove('active');

      // Displaying Book Information container and adding overlay
      const overlay = document.querySelector('.overlay');
      const bookInfo = document.querySelector('.book-info');

      bookInfo.classList.add('active');
      overlay.classList.add('active');

      // *Showing Book Information
      const bookId = this.getAttribute('book-id');
      this.#bookController(bookId);
    }

    connectedCallback() {
      // *Event when user clicks to the image - It should show book information
      this.shadowRoot
        .querySelector('img')
        .addEventListener('click', () => this.#showBookInfo());
    }

    disconnectedCallback() {
      // Removing Event Handler for this component if it is removed from DOM
      this.shadowRoot
        .querySelector('img')
        .removeEventListener('click', () => this.#showBookInfo());
    }
  }

  // *Adding the custom element to document
  customElements.get('book-item-component') ||
    customElements.define('book-item-component', BookItem);
})();

const searchController = async function () {
  try {
    // const inputData = document.querySelector('input.search__box').value;
    const query = searchView.getQuery();

    //Render Spinner
    searchView.renderSpinner();

    //Load Search Results
    await model.loadSearchInfo(query);

    //Render Search Result
    searchView.render(
      model.loadSearchResults(model.state.search.level),
      model.state.search.results.length
    );
    model.state.search.level += 1;

    //Render Load More
    const maxLevel = Math.ceil(
      model.state.search.results.length / model.state.search.resultsPerPage
    );
    if (maxLevel > 1) {
      loadMoreView.render(model.state.search);
      loadMoreView.eventHandlers(loadMoreController);
    }
  } catch (err) {
    searchView.renderError(err);
  }
};

const addLoadMoreHandler = function () {
  loadMoreView.removeHandlers(loadMoreController);
  loadMoreView.eventHandlers(loadMoreController);
};

const loadMoreController = function () {
  const maxLevel = Math.ceil(
    model.state.search.results.length / model.state.search.resultsPerPage
  );
  searchView.renderMore(model.loadSearchResults(model.state.search.level));
  if (model.state.search.level < maxLevel) {
    loadMoreView.render();
    addLoadMoreHandler();
  }
  model.state.search.level += 1;
};

const addBookmarkController = function () {
  if (model.state.book.bookmarked) {
    model.removeBookmark(model.state.book.info.key);
  } else if (!model.state.book.bookmarked) {
    model.addBookmark(model.state.book.info.key);
  }
  // console.log(model.state.bookmarks.results);
  bookView.update(model.state.book);
};

const bookmarkController = async function () {
  if (model.state.bookmarks.present.length >= 1) {
    //Render Spinner
    bookmarksView.renderSpinner();

    //Load Data
    await model.loadBookmarksInfo();

    //Render Data
    bookmarksView.render(model.state.bookmarks.results);
  } else {
    bookmarksView.renderEmptyMessage();
  }
};

const init = function () {
  bookView.eventHandlers();
  bookView.addBookmarkEventHandler(addBookmarkController);
  searchView.eventHandlers(searchController);
  bookmarksView.eventHandlers();
  bookmarksView.bookmarkEventHandler(bookmarkController);
};

init();
