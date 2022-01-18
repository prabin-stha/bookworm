//Polyfilling JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';

(function () {
  /**
   * *IIFE for Opening/Closing Bookmark Sidebar and Book Information Section
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

const loadBookInfo = async function (search) {
  /**
   * *Loading Books Search Data
   * @param search Takes in user search string from input element
   */
  try {
    //Fetching all work id's of user search and storing it in a variable
    const res = await fetch(
      `http://openlibrary.org/search.json?q=${search}&limit=30`
    );
    const data = await res.json();
    const workIds = data.docs.map(el => el.key);
    const searchData = [];

    for (workId of workIds) {
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
        languages: [],
      };
      //Fetching each editions of a certain work
      const res = await fetch(`http://openlibrary.org${workId}/editions.json`);
      const data = await res.json();

      if (data.error) continue;
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
          if (
            !(info.isbn_10 && info.isbn_13) &&
            entry.isbn_10 &&
            entry.isbn_13
          ) {
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
            info.languages.push(
              ...entry.languages[0].key.split('/').splice(-1)
            );
        }
      }
      //Inserting info into searchData list which contains book information for the user search. Each element is a different work of a book.
      searchData.push(info);
      //Clearing info object
      info = {
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
        languages: [],
      };
    }

    return searchData;
  } catch (err) {
    //TODO: Make a proper error handling
    console.log(err);
  }
};

const loadAuthorName = async function (array) {
  /**
   * *Takes in array of object/s with key and returns name of the author
   */
  let name = [];
  for (item of array) {
    const { key } = item;
    const req = await fetch(`https://openlibrary.org${key}.json`);
    const data = await req.json();
    name.push(data.personal_name);
  }
  return name;
};

// *BookItem Web Component
const template = document.createElement('template');
// slots can be used for adding information inside HTML Elements
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
    <img id='book-img'
      width="70"
      height="100"
    />
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
   * *Creating Custom HTML Element
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

  connectedCallback() {
    // *Event when user clicks to the image - It should show book information
    this.shadowRoot.querySelector('img').addEventListener('click', () => {
      const overlay = document.querySelector('.overlay');
      const bookInfo = document.querySelector('.book-info');

      bookInfo.classList.add('active');
      overlay.classList.add('active');

      // TODO:Render Book Information
    });
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('img').removeEventListener();
  }
}

// *Adding the custom element to document
customElements.get('book-item-component') ||
  customElements.define('book-item-component', BookItem);
