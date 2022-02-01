import { LIMIT, RESULTS_PER_PAGE, TIMEOUT_SECONDS } from './config.js';

// Import helper function
import { getJSON, timeout } from './helpers.js';

export {
  state,
  loadSearchInfo,
  getSearchResultsBasedOnLevel,
  loadBookInfo,
  loadBookmarksInfo,
  addBookmark,
  removeBookmark,
  addNote,
};

// *State for the bookworm website
const state = {
  book: {
    bookmarked: undefined,
    info: {},
  },
  search: {
    query: '',
    results: [],
    level: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: {
    present: [],
    results: [],
  },
  notes: [],
};

/**
 * Get workId's based on search parameter
 * @param {String} search Search data from user input field
 * @returns List of workId's for that search string
 */
const getWorkIds = async function (search) {
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${search}&limit=${LIMIT}`
    );
    const data = await res.json();
    const workId = data.docs.map(el => el.key);

    // Throw error if no books are found for the search
    if (!workId.length)
      throw new Error(
        `No books with name "${search}" found. Please try another book name!`
      );
    return workId;
  } catch (err) {
    // Throw err Object to controller
    throw err;
  }
};

/**
 * Get author names and AuthorIds
 * @param {Object[]} array AuthorIds
 * @returns list inside list of Author names and ids
 */
const getAuthorName = async function (array) {
  try {
    let dataAuthor = [];

    // Return undefined if there are no authors of the book mentioned
    if (!array) return undefined;
    for (item of array) {
      const { key } = item;
      const res = await fetch(`https://openlibrary.org${key}.json`);
      if (!res.ok) continue;
      const data = await res.json();
      dataAuthor.push([data.name, key]);
    }
    return dataAuthor;
  } catch (err) {
    // Throw err Object to controller
    throw err;
  }
};

/**
 * Get Subjects of a certain book
 * @param {String} workId workId of a book
 * @returns Subjects of the respective workId
 */
const getSubjects = async function (workId) {
  try {
    const data = await getJSON(`https://openlibrary.org${workId}.json`);

    // Return undefined if there are no subjects of the book mentioned
    if (!data.subjects) return undefined;
    const { subjects } = data;
    return subjects;
  } catch (err) {
    throw err;
  }
};

/**
 * Perform fetch request for getting book infomation using workId, get data and return it
 * @param {String} workId workId of a Book
 * @returns Book information object
 */
const performSearchOperation = async function (workId) {
  let info = {
    key: undefined,
    title: undefined,
    authors: undefined,
    publish_date: undefined,
    covers: undefined,
  };

  // Race fetch and timeout. If timeout resolves before fetch, timeout error is thrown
  const res = await fetch(`https://openlibrary.org${workId}/editions.json`);
  const data = await res.json();

  // To ensure program doesnot end with an error when a workId is not found, continue for loop
  if (!res.ok) return;
  const { entries } = data;

  entries.forEach(entry => {
    // Break Statement if every object is defined
    if (
      info.key &&
      info.title &&
      info.publish_date &&
      info.authors &&
      info.covers
    )
      return;

    // Take in book information if the language of the book is english or not defined
    if (
      entry.languages === undefined ||
      entry.languages[0].key === '/languages/eng' ||
      !entry.languages
    ) {
      // If the object doesnot contain key value then insert available value
      if (!info.key) info.key = workId;
      if (!info.covers && entry.covers)
        info.covers = entry.covers[0].toString();
      if (!info.title && entry.title) info.title = entry.title;
      if (!info.publish_date && entry.publish_date)
        info.publish_date = entry.publish_date;
      if (!info.authors && entry.authors) info.authors = entry.authors;
    }
  });

  if (info.authors) {
    const authorInfo = await getAuthorName(info.authors);
    info.authors = authorInfo;
  }
  return info;
};

/**
 * loads search information in state.search.results based on user search
 * @param {String} search User search string
 */
const loadSearchInfo = async function (search) {
  try {
    state.search.results = [];

    // Throws an error if user does not search anything
    if (search === '')
      throw new Error('Opps! you forgot to enter a book name.');

    state.search.query = search;
    const workIds = await getWorkIds(search);

    for (workId of workIds) {
      const info = await performSearchOperation(workId);
      if (info) state.search.results.push(info);
    }

    // Reset the level of Load More to 1 every time a book is searched
    state.search.level = 1;
  } catch (err) {
    // Throw err Object to controller
    throw err;
  }
};

/**
 * Gets search results from state.search.results based on the level. Used for loading more books
 * @param {Number} level how much level to go for loading books
 * @returns search information based on the level user want to view books
 */
const getSearchResultsBasedOnLevel = function (level) {
  state.search.level = level;

  const start = (level - 1) * 12;
  const end = start + 12;

  return state.search.results.slice(start, end);
};

/**
 * Loads in book information based on a work id
 * @param {String} workId WorkId of a specific book
 */
const loadBookInfo = async function (workId) {
  try {
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
      subjects: undefined,
    };

    // If the book is bookmarked from the data present in LS then set state.book.bookmarked to true else false
    if (state.bookmarks.present.includes(workId)) state.book.bookmarked = true;
    else state.book.bookmarked = false;

    // If the book contains note from the data present in LS then set state.book.note to data from LS else ''
    if (state.notes.some(el => el.key === workId))
      state.book.note = state.notes.filter(el => el.key === workId)[0].note;
    else state.book.note = '';

    // Fetching each editions of a certain work
    const data = await getJSON(
      `https://openlibrary.org${workId}/editions.json`
    );

    const { entries } = data;

    // For each edition, if there exist a property not available in the info object then insert its value
    for (entry of entries) {
      // Break Statement if every object is defined
      if (
        info.key &&
        info.title &&
        info.subtitle &&
        info.publish_date &&
        info.authors &&
        info.publishers &&
        info.number_of_pages &&
        info.description &&
        info.covers &&
        info.isbn_10
      )
        break;

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
        if (!info.isbn_10 && entry.isbn_10) info.isbn_10 = entry.isbn_10[0];
      }
    }
    const authorInfo = await getAuthorName(info.authors);
    info.authors = authorInfo;
    const subjects = await getSubjects(info.key);
    info.subjects = subjects;
    state.book.info = info;
  } catch (err) {
    throw err;
  }
};

/**
 * Loads bookmarks information based on state.bookmarks.present which gets its data from LS
 */
const loadBookmarksInfo = async function () {
  try {
    state.bookmarks.results = [];
    for (workId of state.bookmarks.present) {
      let info = {
        key: undefined,
        title: undefined,
        authors: undefined,
        publish_date: undefined,
        covers: undefined,
      };

      // Race fetch and timeout. If timeout resolves before fetch, timeout error is thrown
      const res = await Promise.race([
        fetch(`https://openlibrary.org${workId}/editions.json`),
        timeout(TIMEOUT_SECONDS),
      ]);
      const data = await res.json();

      // To ensure program doesnot end with an error when a workId is not found, continue for loop
      if (!res.ok) continue;
      const { entries } = data;

      for (entry of entries) {
        // Break Statement if every object is defined
        if (
          info.key &&
          info.title &&
          info.publish_date &&
          info.authors &&
          info.covers
        )
          break;

        // Take in book information if the language of the book is english or not defined
        if (
          entry.languages === undefined ||
          entry.languages[0].key === '/languages/eng' ||
          !entry.languages
        ) {
          // If the object doesnot contain key value then insert available value
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
        const authorInfo = await getAuthorName(info.authors);
        info.authors = authorInfo;
      }

      // If there is identical result then don't insert the info in state.bookmarks.results
      if (state.bookmarks.results.some(el => el.key === info.key)) continue;
      state.bookmarks.results.push(info);
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Adds a book's work id in Local Storage and state.bookmarks.present, change the state of book.bookmarked to true
 * @param {String} workId Work Id of a Book
 */
const addBookmark = function (workId) {
  //Add Bookmark
  state.bookmarks.present.push(workId);

  //Mark Current book as bookmark
  if (workId === state.book.info.key) state.book.bookmarked = true;

  modifyLocalStorageBookmark();
};

/**
 * Removes a book's work id from Local Storage and state.bookmarks.present, change the state of book.bookmarked to false
 * @param {String} workId Work Id of a Book
 */
const removeBookmark = function (workId) {
  //Remove Bookmark
  state.bookmarks.present = state.bookmarks.present.filter(el => el != workId);

  //Unmark Current book as bookmark
  if (workId === state.book.info.key) state.book.bookmarked = false;

  modifyLocalStorageBookmark();
};

/**
 * Updates Local Storage based on the list present in state.bookmarks.present
 */
const modifyLocalStorageBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks.present));
};

/**
 * Adds an object of with key and note properties to state.notes and Local Storage
 * @param {String} workId Work Id of a Book
 * @param {String} note Note for a certain Book with a work Id
 */
const addNote = function (workId, note) {
  if (state.notes.some(el => el.key === workId)) {
    state.notes.forEach(el => {
      if (el.key === workId) el.note = note;
    });
  } else {
    state.notes.push({ key: workId, note: note });
  }

  modifyLocalStorageNotes();
};

/**
 * Modifies Local Storage based on the state.notes
 */
const modifyLocalStorageNotes = function () {
  localStorage.setItem('notes', JSON.stringify(state.notes));
};

const init = function () {
  //Get bookmarks and notes from Local Storage and insert it into state.bookmarks.present and state.notes at the start of the program
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) state.bookmarks.present = JSON.parse(bookmarks);
  const notes = localStorage.getItem('notes');
  if (notes) state.notes = JSON.parse(notes);
};
init();
