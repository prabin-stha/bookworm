//Polyfilling JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';

(function () {
  /**
   * *IIFE for Opening/Closing Bookmark Sidebar
   */
  const bookmarkBtn = document.querySelector('.bookmarks-btn');
  const bookmarks = document.querySelector('.bookmarks');
  const bookmarkOverlay = document.querySelector('.bookmarks-overlay');
  const bookmarksClose = document.querySelector('.bookmarks-header span');

  function addBookmark() {
    bookmarks.classList.add('active');
    bookmarkOverlay.classList.add('active');
  }
  function removeBookmark() {
    bookmarks.classList.remove('active');
    bookmarkOverlay.classList.remove('active');
  }

  // Bookmarks opens when clicked on bookmarks button
  bookmarkBtn.addEventListener('click', addBookmark);

  //Bookmarks closes when clicked outside of bookmark sidebar, when clicked on close icon or when pressed Esc
  bookmarkOverlay.addEventListener('click', removeBookmark);
  bookmarksClose.addEventListener('click', removeBookmark);
  document.addEventListener('keydown', e => {
    if (e.key == 'Escape') {
      removeBookmark();
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
