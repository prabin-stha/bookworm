//Polyfilling JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//Importing model
import * as model from './model.js';

//Importing Views
import bookView from './views/bookView';
import searchView from './views/searchView';

(function () {
  /**
   * *IIFE for Opening/Closing Bookmark Sidebar and Show Work/Book Information Section
   */
  const bookmarksBtn = document.querySelector('.bookmarks-btn');
  const bookmarks = document.querySelector('.bookmarks');
  const overlay = document.querySelector('.overlay');
  const bookmarksClose = document.querySelector('.bookmarks-header span');
  const bookInfo = document.querySelector('.book-info');
  const bookInfoClose = document.querySelector('.book-info .close i');

  function addBookmark() {
    bookmarks.classList.add('active');
    overlay.classList.add('active');
  }
  function removeBookmark() {
    bookmarks.classList.remove('active');
    setTimeout(() => overlay.classList.remove('active'), 100);
  }
  function removeBookInfo() {
    bookInfo.classList.remove('active');
    setTimeout(() => overlay.classList.remove('active'), 250);
  }

  // Bookmarks opens when clicked on bookmarks button
  bookmarksBtn.addEventListener('click', addBookmark);

  //Bookmarks and Book Information closes when clicked outside of bookmark sidebar, when clicked on close icon or when pressed Esc
  bookmarksClose.addEventListener('click', removeBookmark);
  bookInfoClose.addEventListener('click', removeBookInfo);
  overlay.addEventListener('click', () => {
    removeBookmark();
    removeBookInfo();
  });
  document.addEventListener('keydown', e => {
    if (e.key == 'Escape') {
      removeBookmark();
      removeBookInfo();
    }
  });
})();

(function () {
  /**
   * *IIFE for showing search results for user search string
   */
  const searchController = async function () {
    const inputData = document.querySelector('input.search__box').value;

    //Render Spinner
    searchView.renderSpinner();

    //Load Search Results
    const data = await model.loadSearchInfo(inputData);

    //Render Search Result
    searchView.render(data);
  };

  //Show search results when user clicks search button or presses enter inside input el
  const searchBtn = document.querySelector('button.search__icon');
  const input = document.querySelector('input.search__box');
  searchBtn.addEventListener('click', searchController);
  input.addEventListener('keydown', e => {
    if (e.key == 'Enter') searchController();
  });
})();

// *Template for book item web component
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
   * *Creating Custom book-item-component HTML Element
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

  async #bookController(bookId) {
    // Rendering Loading Spinner
    bookView.renderSpinner();

    //loading Book Info
    const data = await model.loadBookInfo(bookId);

    //Rendering Book Info
    bookView.render(data);
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
    this.shadowRoot
      .querySelector('img')
      .removeEventListener('click', () => this.#showBookInfo());
  }
}

// *Adding the custom element to document
customElements.get('book-item-component') ||
  customElements.define('book-item-component', BookItem);
