//Polyfilling JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//Import static/dyncmic content
import logo from 'url:../img/logo/openlibrary.png';
import na from 'url:../img/na.jpg';

(function () {
  /**
   * *IIFE for Opening/Closing Bookmark Sidebar and Show Work/Book Information Section
   */
  const bookmarkBtn = document.querySelector('.bookmarks-btn');
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
  bookmarkBtn.addEventListener('click', addBookmark);

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

const loadWorkIds = async function (search) {
  /**
   * *Returns Work Ids
   * @param search Takes in user search string
   */

  const res = await fetch(
    `http://openlibrary.org/search.json?q=${search}&limit=10`
  );
  const data = await res.json();
  const workIds = data.docs.map(el => el.key);
  return workIds;
};

const loadAuthorName = async function (array) {
  /**
   * *Takes in array of object/s with key and returns name and key of author
   */
  let dataAuthor = [];
  for (item of array) {
    const { key } = item;
    const req = await fetch(`https://openlibrary.org${key}.json`);
    const data = await req.json();
    dataAuthor.push([data.personal_name, key]);
  }
  return dataAuthor;
};

const loadSubjects = async function (workId) {
  /**
   * *Takes in a workId and returns it's subjects if available else returns undefined
   */
  const res = await fetch(`https://openlibrary.org${workId}.json`);
  const data = await res.json();
  if (!data.subjects) return undefined;
  const { subjects } = data;
  return subjects;
};

const loadSearchInfo = async function (search) {
  /**
   * *Returns search data for book-item-component
   * @param search Takes in user search string
   */
  const workIds = await loadWorkIds(search);
  const searchData = [];

  for (workId of workIds) {
    let info = {
      key: undefined,
      title: undefined,
      authors: undefined,
      publish_date: undefined,
      covers: undefined,
    };

    const res = await fetch(`http://openlibrary.org${workId}/editions.json`);
    const data = await res.json();

    if (data.error) continue;
    const { entries } = data;

    for (entry of entries) {
      if (
        entry.languages === undefined ||
        entry.languages[0].key === '/languages/eng' ||
        !entry.languages
      ) {
        if (!info.key) info.key = workId;
        if (!info.covers && entry.covers)
          info.covers = entry.covers[0].toString();
        if (!info.title && entry.title) info.title = entry.title;
        if (!info.publish_date && entry.publish_date)
          info.publish_date = entry.publish_date;
        if (!info.authors && entry.authors) info.authors = entry.authors;
      }
    }
    if (info.authors) {
      const authorInfo = await loadAuthorName(info.authors);
      info.authors = authorInfo;
    }
    // const dataFilter = [info].filter(el => el != undefined);
    // searchData.push(...dataFilter);
    searchData.push(info);

    info = {
      key: undefined,
      title: undefined,
      authors: undefined,
      publish_date: undefined,
      covers: undefined,
    };
  }
  return searchData;
};

const loadBookInfo = async function (workId) {
  /**
   * *Returns book information based on workId
   * @param workId Takes in workId of a book
   */
  let info = {
    key: undefined,
    title: undefined,
    subtitle: undefined,
    publish_date: undefined,
    authors: undefined,
    publishers: undefined,
    number_of_pages: undefined,
    description: undefined,
    covers: undefined,
    isbn_10: undefined,
    isbn_13: undefined,
    subjects: undefined,
    languages: [],
  };

  //Fetching each editions of a certain work
  const res = await fetch(`http://openlibrary.org${workId}/editions.json`);
  const data = await res.json();

  if (data.error) return;
  const { entries } = data;

  // For each edition, if there exist a property not available in the info object then insert its value
  for (entry of entries) {
    // If the language of the book is english or if the language property doesnot exist or is undefined then get information from that edition.
    if (
      entry.languages === undefined ||
      entry.languages[0].key === '/languages/eng' ||
      !entry.languages
    ) {
      //Insert value only if info.property is undefined
      if (!info.key) info.key = workId;
      if (!info.title && entry.title) info.title = entry.title;
      if (!info.subtitle && entry.subtitle) info.subtitle = entry.subtitle;
      if (!info.publish_date && entry.publish_date)
        info.publish_date = entry.publish_date;
      if (!info.authors && entry.authors) info.authors = entry.authors;
      if (!info.publishers && entry.publishers)
        info.publishers = entry.publishers;
      if (!info.number_of_pages && entry.number_of_pages)
        info.number_of_pages = entry.number_of_pages.toString();
      if (!info.description && entry.description)
        info.description = entry.description.value;
      if (!info.covers && entry.covers)
        info.covers = entry.covers[0].toString();
      if (!(info.isbn_10 && info.isbn_13) && entry.isbn_10 && entry.isbn_13) {
        info.isbn_10 = entry.isbn_10[0];
        info.isbn_13 = entry.isbn_13[0];
      }
    } else {
      // Stores the languages available in certain edition of work
      if (
        !info.languages.includes(
          ...entry.languages[0].key.split('/').splice(-1)
        )
      )
        info.languages.push(...entry.languages[0].key.split('/').splice(-1));
    }
  }
  const authorInfo = await loadAuthorName(info.authors);
  info.authors = authorInfo;
  const subjects = await loadSubjects(info.key);
  info.subjects = subjects;
  return info;
};

// *BookItem Web Component
const template = document.createElement('template');
// slots are used for adding information inside HTML Elements
template.innerHTML = `
<style>
*{
  margin: 0;
  box-sizing: border-box;
}
.search-item {
  display: flex;
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
<div class="search-item" data-bookId="#">
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

  renderSpinner(parentEl) {
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
    parentEl.innerHTML = '';
    parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  async showBookInfo(bookId) {
    //loading Book Info
    const bookContainer = document.querySelector('.book-info .container');
    // Rendering Loading Spinner
    this.renderSpinner(bookContainer);
    const b = await loadBookInfo(bookId);

    //Rendering Book Info
    const markup = `
      <div class="book-header">
          <div class="title-bookmark">
            <h1>${b.title ? b.title : '<p>N.A.</p>'}</h1>
            <span><i class="far fa-bookmark"></i></span>
          </div>
          <h2 class="description">
            ${b.subtitle ? b.subtitle : '<p>N.A.</p>'}
          </h2>
          <h3 class="date">This edition was published in ${
            b.publish_date ? b.publish_date : '<p>N.A.</p>'
          }</h3>
        </div>
        <div class="book-body">
          <div class="img-BScreen">
          ${
            b.covers
              ? `<img
                src="https://covers.openlibrary.org/b/id/${b.covers}-M.jpg"
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
                b.covers
                  ? `<img
                    src="https://covers.openlibrary.org/b/id/${b.covers}-M.jpg"
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
                      b.authors
                        ? b.authors
                            .map(function (author) {
                              return `<a href="http://openlibrary.org${author[1]}"><p>${author[0]}</p></a>`;
                            })
                            .join('')
                        : `<p>N.A.</p>`
                    }
                  </div>
                  <div>
                    <h2>Publisher</h2>
                    ${
                      b.publishers
                        ? b.publishers
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
                      b.number_of_pages ? b.number_of_pages : '<p>N.A.</p>'
                    }</p>
                  </div>
                  <div>
                    <h2>ISBN10</h2>
                    <p>${b.isbn_10 ? b.isbn_10 : '<p>N.A.</p>'}</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="description">
              <h2>Description</h2>
              <p>
                ${b.description ? b.description : '<p>N.A.</p>'}
              </p>
            </div>
            <div class="subjects">
              <h2>Subjects</h2>
              <p>
                ${b.subjects ? b.subjects.join(', ') : '<p>N.A.</p>'}
              </p>
            </div>
            <a href="https://www.pdfdrive.com/search?q=${
              b.title
            }" target="_blank">Search for this E-Book in PDF Drive</a>
            <hr />
            <div class="find-notes">
              <div class="find-more">
                <h2>Want to learn more about this book?</h2>
                <a href="https://openlibrary.org${b.key}" target="_blank"
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

    bookContainer.innerHTML = '';
    bookContainer.insertAdjacentHTML('afterbegin', markup);
  }

  connectedCallback() {
    // *Event when user clicks to the image - It should show book information
    this.shadowRoot.querySelector('img').addEventListener('click', () => {
      // Adding animation to book container
      const overlay = document.querySelector('.overlay');
      const bookInfo = document.querySelector('.book-info');

      bookInfo.classList.add('active');
      overlay.classList.add('active');

      // *Showing Book Information
      const bookId = this.getAttribute('book-id');
      this.showBookInfo(bookId);
    });
  }

  // disconnectedCallback() {
  //   this.shadowRoot.querySelector('img').removeEventListener('click');
  // }
}

// *Adding the custom element to document
customElements.get('book-item-component') ||
  customElements.define('book-item-component', BookItem);

// *Showing Search Results
function renderSpinner(parentEl) {
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
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
}

const showSearch = async function (s) {
  const inputData = document.querySelector('input.search__box').value;
  const searchContainer = document.querySelector('.search-container');

  renderSpinner(searchContainer);
  const datas = await loadSearchInfo(inputData);
  searchContainer.innerHTML = '';

  for (d of datas) {
    const markup = `
      <book-item-component
        url="${
          d.covers
            ? `https://covers.openlibrary.org/b/id/${d.covers}-M.jpg`
            : `${na}`
        }"
        padding="0"
        justify-content="center"
        book-id="${d.key}"
      >
        <div slot="title">${d.title ? d.title : 'N.A.'}</div>
        <div slot="author">${
          d.authors
            ? d.authors
                .map(function (author) {
                  return `${author[0]}`;
                })
                .join(', ')
            : 'N.A.'
        }</div>
        <div slot="date">${d.publish_date ? d.publish_date : 'N.A.'}</div>
      </book-item-component>
    `;
    searchContainer.insertAdjacentHTML('afterbegin', markup);
  }
};
const searchBtn = document.querySelector('button.search__icon');
searchBtn.addEventListener('click', showSearch);
