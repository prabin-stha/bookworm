//Polyfilling JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//Importing model
import * as model from './model.js';

//Importing Views
import bookView from './views/bookView';
import searchView from './views/searchView';
import bookmarksView from './views/bookmarksView.js';

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
        const data = await model.loadBookInfo(bookId);

        //Rendering Book Info
        bookView.render(data);
      } catch (err) {
        // TODO: Handle Error
      }
    }

    #showBookInfo() {
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
    const data = await model.loadSearchInfo(query);

    //Render Search Result
    searchView.render(model.state.searchData);
  } catch (err) {
    searchView.renderError(err);
  }
};

const init = function () {
  bookView.eventHandlers();
  searchView.eventHandlers(searchController);
  bookmarksView.eventHandlers();
};

init();
