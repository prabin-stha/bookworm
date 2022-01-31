// Polyfilling JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//Importing model
import * as model from './model.js';

//Importing views
import bookView from './views/bookView';
import searchView from './views/searchView';
import bookmarksView from './views/bookmarksView';
import loadMoreView from './views/loadMoreView';
import {
  BookItem,
  defineWebComponent,
} from './views/bookItemWebComponentView.js';

/**
 * Controller for showing book information when a certain book-item-component is clicked
 * @param {String} workId Work Id of Book
 */
const bookController = async function (workId) {
  try {
    // Rendering Loading Spinner
    bookView.renderSpinner();

    // Loading Book Info
    await model.loadBookInfo(workId);
    const data = model.state.book;

    //Rendering Book Info
    bookView.render(data);
  } catch (err) {
    bookView.renderError(err);
  }
};

/**
 * Controller for controlling search results when search icon is clicked or enter is pressed while inside input field
 */
const searchController = async function () {
  try {
    const query = searchView.getQuery();

    // Render Spinner
    searchView.renderSpinner();

    // Disable search when search results is loading
    searchView.disableSearch();
    searchView.disableButton();

    // Load Search Results
    await model.loadSearchInfo(query);

    // Enable search after the search results have been loaded
    searchView.enableSearch();
    searchView.enableButton();

    // Render Search Result
    searchView.render(
      model.getSearchResultsBasedOnLevel(model.state.search.level),
      model.state.search.results.length
    );
    model.state.search.level += 1;

    // Render Load More
    const maxLevel = Math.ceil(
      model.state.search.results.length / model.state.search.resultsPerPage
    );

    //Display load more button only if there are more books present to load
    if (maxLevel > 1) {
      loadMoreView.render(model.state.search);
      loadMoreView.eventHandlers(loadMoreController);
    }
  } catch (err) {
    // Enable search after the search results have been loaded
    searchView.enableSearch();
    searchView.enableButton();
    searchView.renderError(err);
  }
};

/**
 * Remove click event handler for old load more button and add it again to a new load more button because the btn needs to be removed and added to the bottom of the search results every time it is pressed
 */
const addLoadMoreHandler = function () {
  loadMoreView.removeHandlers(loadMoreController);
  loadMoreView.eventHandlers(loadMoreController);
};

/**
 * Controller to load more button and data when load more button is clicked
 */
const loadMoreController = function () {
  const maxLevel = Math.ceil(
    model.state.search.results.length / model.state.search.resultsPerPage
  );

  // Load More Books based on model.state.search.level
  searchView.renderMore(
    model.getSearchResultsBasedOnLevel(model.state.search.level)
  );

  // Render Load More button and call addLoadMoreHandler if there are more data present in the state
  if (model.state.search.level < maxLevel) {
    loadMoreView.render();
    addLoadMoreHandler();
  }

  //Increase the level of book every time load more btn is clicked
  model.state.search.level += 1;
};

/**
 * Controller to control adding and removong bookmarks from a book info container when bookmark icon is clicked
 */
const addBookmarkController = function () {
  if (model.state.book.bookmarked) {
    model.removeBookmark(model.state.book.info.key);
  } else if (!model.state.book.bookmarked) {
    model.addBookmark(model.state.book.info.key);
  }

  // This update method only re-renders the bookmark button and not the entire DOM when there is a change in the DOM
  bookView.update(model.state.book);
};

/**
 * Controls bookmark when bookmark button is clicked
 */
const bookmarkController = async function () {
  try {
    if (model.state.bookmarks.present.length >= 1) {
      // Render Spinner
      bookmarksView.renderSpinner();

      // Load Data
      if (
        model.state.bookmarks.present.length !=
        model.state.bookmarks.results.length
      )
        await model.loadBookmarksInfo();

      // Add Event Listner for click again
      bookmarksView.bookmarkEventHandler(bookmarkController);

      // Render Data
      bookmarksView.render(model.state.bookmarks.results);
    } else {
      bookmarksView.renderEmptyMessage();
    }
  } catch (err) {
    bookmarksView.renderError(err);
  }
};

/**
 * Controller for saving notes when save note button is clicked
 * @param {String} workId Work Id of a Book
 * @param {String} note Note from textbox
 */
const saveNoteController = function (workId, note) {
  model.addNote(workId, note);
  bookView.renderSuccess();
};

const init = function () {
  // Defining book-item-component
  class BookItemComponent extends BookItem {
    bookController = bookController;
  }
  defineWebComponent(BookItemComponent);

  //Event handlers
  bookView.eventHandlers();
  bookView.addBookmarkEventHandler(addBookmarkController);
  bookView.addSaveEventHandler(saveNoteController);
  searchView.eventHandlers(searchController);
  bookmarksView.eventHandlers();
  bookmarksView.bookmarkEventHandler(bookmarkController);
};

init();
