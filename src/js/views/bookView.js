import { mark } from 'regenerator-runtime';
import logo from 'url:../../img/logo/openlibrary.png';

class BookView {
  #parentEl = document.querySelector('.book-info .container');
  #data;

  #clear() {
    this.#parentEl.innerHTML = '';
  }

  #clearAndInsert(markup) {
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  #generateMarkup() {
    return `
      <div class="book-header">
          <div class="title-bookmark">
            <h1>${this.#data.title ? this.#data.title : '<p>N.A.</p>'}</h1>
            <span><i class="far fa-bookmark"></i></span>
          </div>
          <h2 class="description">
            ${this.#data.subtitle ? this.#data.subtitle : '<p>N.A.</p>'}
          </h2>
          <h3 class="date">This edition was published in ${
            this.#data.publish_date ? this.#data.publish_date : '<p>N.A.</p>'
          }</h3>
        </div>
        <div class="book-body">
          <div class="img-BScreen">
          ${
            this.#data.covers
              ? `<img
                src="https://covers.openlibrary.org/b/id/${
                  this.#data.covers
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
                this.#data.covers
                  ? `<img
                    src="https://covers.openlibrary.org/b/id/${
                      this.#data.covers
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
                      this.#data.authors
                        ? this.#data.authors
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
                      this.#data.publishers
                        ? this.#data.publishers
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
                      this.#data.number_of_pages
                        ? this.#data.number_of_pages
                        : '<p>N.A.</p>'
                    }</p>
                  </div>
                  <div>
                    <h2>ISBN10</h2>
                    <p>${
                      this.#data.isbn_10 ? this.#data.isbn_10 : '<p>N.A.</p>'
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
                  this.#data.description
                    ? this.#data.description
                    : '<p>N.A.</p>'
                }
              </p>
            </div>
            <div class="subjects">
              <h2>Subjects</h2>
              <p>
                ${
                  this.#data.subjects
                    ? this.#data.subjects.join(', ')
                    : '<p>N.A.</p>'
                }
              </p>
            </div>
            <a href="https://www.pdfdrive.com/search?q=${
              this.#data.title
            }" target="_blank">Search for this E-Book in PDF Drive</a>
            <hr />
            <div class="find-notes">
              <div class="find-more">
                <h2>Want to learn more about this book?</h2>
                <a href="https://openlibrary.org${
                  this.#data.key
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
                ></textarea>
              </div>
            </div>
          </section>
        </div>
      `;
  }

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clearAndInsert(markup);
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
}

export default new BookView();
