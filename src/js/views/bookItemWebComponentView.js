//Creating a template for a book-item-component
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

/**
 * Creating a custom BookItem HTMLElement
 */
export class BookItem extends HTMLElement {
  bookController;
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

  /**
   * Shows Book Information in the book-container class based on the data returned by the model
   */
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
    const workId = this.getAttribute('book-id');
    this.bookController(workId);
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

/**
 * Adding the custom element to document
 */
export const defineWebComponent = function (bookItem) {
  customElements.get('book-item-component') ||
    customElements.define('book-item-component', bookItem);
};
