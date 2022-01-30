import { mark } from 'regenerator-runtime';
import logo from 'url:../../img/logo/openlibrary.png';
import { state } from '../model';

class BookView {
  #parentEl = document.querySelector('.book-info .container');
  #data;

  /**
   * Clear parent element's innerHTML
   */
  #clear() {
    this.#parentEl.innerHTML = '';
  }

  /**
   * Clears and Inserts HTML markup inside parent element
   * @param {String} markup HTML markup
   */
  #clearAndInsert(markup) {
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Generates HTML markup for viewing book information
   * @returns HTML markup
   */
  #generateMarkup() {
    return `
      <div class="book-header">
          <div class="title-bookmark">
            <h1>${
              this.#data.info.title ? this.#data.info.title : '<p>N.A.</p>'
            }</h1>
            <span><i ${
              this.#data.bookmarked
                ? 'class="fas fa-bookmark"'
                : 'class="far fa-bookmark"'
            }></i></span>
          </div>
          <h2 class="description">
            ${
              this.#data.info.subtitle
                ? this.#data.info.subtitle
                : '<p>N.A.</p>'
            }
          </h2>
          <h3 class="date">This edition was published in ${
            this.#data.info.publish_date
              ? this.#data.info.publish_date
              : '<p>N.A.</p>'
          }</h3>
        </div>
        <div class="book-body">
          <div class="img-BScreen">
          ${
            this.#data.info.covers
              ? `<img
                src="https://covers.openlibrary.org/b/id/${
                  this.#data.info.covers
                }-M.jpg"
                height="250"
                width="150"
              />`
              : `<div class="na-BScreen"><p>N.A.</p></div>`
          }
          </div>
          <section class="content">
            <div class="meta-container">
              <div class="img-SScreen">
              ${
                this.#data.info.covers
                  ? `<img
                    src="https://covers.openlibrary.org/b/id/${
                      this.#data.info.covers
                    }-M.jpg"
                    height="150"
                    width="100"
                  />`
                  : `<div class="na-SScreen"><p>N.A.</p></div>`
              }
              </div>
              <div class="meta">
                <div class="author-publisher">
                  <div>
                    <h2>Author</h2>
                    ${
                      this.#data.info.authors
                        ? this.#data.info.authors
                            .map(function (author) {
                              return `<a href="http://openlibrary.org${author[1]}" target="_blank"><p>${author[0]}</p></a>`;
                            })
                            .join('')
                        : `<p>N.A.</p>`
                    }
                  </div>
                  <div>
                    <h2>Publisher</h2>
                    ${
                      this.#data.info.publishers
                        ? this.#data.info.publishers
                            .map(function (publisher) {
                              return `<p>${publisher}</p>`;
                            })
                            .join('')
                        : '<p>N.A.</p>'
                    }
                  </div>
                </div>
                <div class="pages-isbn">
                  <div>
                    <h2>Pages</h2>
                    <p>${
                      this.#data.info.number_of_pages
                        ? this.#data.info.number_of_pages
                        : '<p>N.A.</p>'
                    }</p>
                  </div>
                  <div>
                    <h2>ISBN10</h2>
                    <p>${
                      this.#data.info.isbn_10
                        ? this.#data.info.isbn_10
                        : '<p>N.A.</p>'
                    }</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="description">
              <h2>Description</h2>
              <p>
                ${
                  this.#data.info.description
                    ? this.#data.info.description
                    : '<p>N.A.</p>'
                }
              </p>
            </div>
            <div class="subjects">
              <h2>Subjects</h2>
              <p>
                ${
                  this.#data.info.subjects
                    ? this.#data.info.subjects.join(', ')
                    : '<p>N.A.</p>'
                }
              </p>
            </div>
            <a href="https://www.pdfdrive.com/search?q=${
              this.#data.info.title
            }" target="_blank">Search for this E-Book in PDF Drive</a>
            <hr />
            <div class="find-notes">
              <div class="find-more">
                <h2>Want to learn more about this book?</h2>
                <a href="https://openlibrary.org${
                  this.#data.info.key
                }" target="_blank"
                  ><img
                    title="openlibrary"
                    src=${logo}
                    alt="openlibrary logo"
                    width="60px"
                /></a>
              </div>
              <div class="notes">
                <textarea
                  id="notes"
                  cols="35"
                  rows="8"
                  placeholder="Write some notes about this book here. Don't worry, the data will be saved inside your browser!"
                >${this.#data.note ? this.#data.note : ''}</textarea>
                <button class="save">Save Note</button>
              </div>
            </div>
          </section>
        </div>
      `;
  }

  /**
   * re-renders just bookmark icon when something is changed in the DOM
   * @param {Object} data state.book object
   */
  update(data) {
    this.#data = data;
    const newMarkup = this.#generateMarkup();

    // Creates like a virtual dom from the HTML markup
    const newDom = document.createRange().createContextualFragment(newMarkup);

    // Convert NodeList of all elements in DOM of newDOM  to Array
    const newElements = Array.from(newDom.querySelectorAll('*'));

    // Convert NodeList of all elements in DOM of current parent element to Array
    const curElements = Array.from(this.#parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          // If the element is a bookmark icon
          if (
            attr.value === 'fas fa-bookmark' ||
            attr.value === 'far fa-bookmark'
          ) {
            curEl.setAttribute(attr.name, attr.value);
          }
        });
      }
    });
  }

  /**
   * Renders book information in the parent element. This method is called when book-item-component is clicked
   * @param {Object} data state.book object
   */
  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clearAndInsert(markup);
  }

  /**
   * Renders success message when some operation is performed sucessfully
   * @param {String} msg Success Message. This is used in render method of this object
   */
  renderSuccess() {
    const markup = `
    <div class="message-s">
          <p class="success-msg">
            <span><i class="fas fa-check-circle"></i></span>&nbsp;&nbsp;Note Saved Sucessfully!
          </p>
        </div>
    `;
    document.querySelector('.notes').insertAdjacentHTML('afterbegin', markup);
    const success = document.querySelector('.message-s');
    success.classList.toggle('active');
    setTimeout(() => success.classList.toggle('active'), 4000);
    setTimeout(() => success.remove(), 5000);
  }

  /**
   * Render Error if some error is encountered
   * @param {Object} error Error Object
   */
  renderError(msg) {
    const markup = `
    <p class="error-msg">
            <span><i class="fas fa-exclamation-circle"></i></span
            >&nbsp;&nbsp;${msg}
          </p>
    `;
    this.#clearAndInsert(markup);
  }

  /**
   * Renders spinner in the parent container
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
   * Event handlers for open/close animation of book-container
   */
  eventHandlers() {
    const overlay = document.querySelector('.overlay');
    const bookInfo = document.querySelector('.book-info');
    const bookInfoClose = document.querySelector('.book-info .close i');

    function removeBookInfo() {
      bookInfo.classList.remove('active');
      setTimeout(() => overlay.classList.remove('active'), 250);
    }

    bookInfoClose.addEventListener('click', removeBookInfo);
    overlay.addEventListener('click', () => removeBookInfo());
    document.addEventListener('keydown', e => {
      if (e.key == 'Escape') removeBookInfo();
    });
  }

  /**
   * Adds click event listner to bookmarks icon inside book-container and calls addBookmarkController when clicked
   * @param {Function} handler addBookmarkController from controller.js
   */
  addBookmarkEventHandler(handler) {
    this.#parentEl.addEventListener('click', e => {
      // bookmarkBtn might not exist yet to handle the event. so, when there is an element closest to a bookmark element in its parent container, run the handler function
      const bookmarkBtn = e.target.closest('.title-bookmark span');
      if (!bookmarkBtn) return;
      handler();
    });
  }

  /**
   * Adds click event listner to save note button inside book-container and calls saveNoteController when clicked
   * @param {Function} handler saveNoteController from controller.js
   */
  addSaveEventHandler(handler) {
    this.#parentEl.addEventListener('click', e => {
      //Save note button might not exist yet to handle the event. so, when there is an element closest to a save note button in its parent container, run the handler function
      const saveBtn = e.target.closest('.save');
      if (!saveBtn) return;
      const note = document.querySelector('#notes').value;
      handler(this.#data.info.key, note);
    });
  }
}

export default new BookView();
