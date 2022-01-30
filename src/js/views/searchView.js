import { mark } from 'regenerator-runtime';

// Static media import
import na from 'url:../../img/na.jpg';

class SearchView {
  #parentEl = document.querySelector('.search-container');
  #data;

  /**
   * Clear parent element's innerHTML
   */
  #clear() {
    this.#parentEl.innerHTML = '';
  }

  /**
   * Clear and insert HTML markup inside parent container
   * @param {String} markup HTML markup
   */
  #clearAndInsert(markup) {
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Generates and inserts search results in the parent container
   * @returns nothing if #data field is empty list
   */
  #generateSearchResults() {
    let titleCut = '';
    let authorsCut = '';
    if (!this.#data) return;
    this.#data.forEach(el => {
      let authors = el.authors
        ? el.authors
            .map(function (author) {
              return `${author[0]}`;
            })
            .join(', ')
        : 'N.A.';
      authors.length > 40
        ? (authorsCut = authors.substring(0, 40) + '...')
        : (authorsCut = authors);
      let title = el.title ? el.title : 'N.A.';
      title.length > 16
        ? (titleCut = title.substring(0, 16) + '...')
        : (titleCut = title);
      const markup = `
      <book-item-component
        url="${
          el.covers
            ? `https://covers.openlibrary.org/b/id/${el.covers}-M.jpg`
            : `${na}`
        }"
        padding="0"
        justify-content="center"
        book-id="${el.key}"
      >
        <div slot="title" title="${title}">${titleCut}</div>
        <div slot="author" title="${authors}">${authorsCut}</div>
        <div slot="date">${el.publish_date ? el.publish_date : 'N.A.'}</div>
      </book-item-component>
    `;
      this.#parentEl.insertAdjacentHTML('beforeend', markup);
    });
  }

  /**
   * Renders data using data present inside the list of objects
   * @param {Object[]} data List of Book Objects
   * @param {Number} lenSearch total number of results found
   */
  render(data, lenSearch) {
    this.#data = data;
    this.#clear();
    this.#generateSearchResults();
    this.renderSuccess(`${lenSearch} books with similar names found`);
  }

  /**
   * Renders more book-item-component in the parent element
   * @param {Object[]} data List of Book Objects
   */
  renderMore(data) {
    document.querySelector('button.load-more').remove();
    this.#data = data;
    this.#generateSearchResults();
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
   * Render Error if some error is encountered
   * @param {Object} error Error Object
   */
  renderError(error) {
    const markup = `
    <div class="error">
      <p class="msg">
        <span><i class="fas fa-exclamation-circle"></i></span>&nbsp;&nbsp;${error}
      </p>
    </div>
    `;
    this.#clearAndInsert(markup);
  }

  /**
   * Renders success message when some operation is performed sucessfully
   * @param {String} msg Success Message. This is used in render method of this object
   */
  renderSuccess(msg) {
    const markup = `
    <div class="success">
      <p class="msg">
        <span><i class="fas fa-check-circle"></i></span>&nbsp;&nbsp;${msg}
      </p>
    </div>
    `;
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
    const success = document.querySelector('.success');
    success.classList.toggle('active');
    setTimeout(() => success.classList.toggle('active'), 4000);
    setTimeout(() => success.remove(), 5000);
  }

  /**
   * Clears input field
   */
  #clearInput() {
    document.querySelector('input.search__box').value = '';
  }

  /**
   * Gets value of the input search element
   * @returns string present in input field
   */
  getQuery() {
    const query = document.querySelector('input.search__box').value;
    setTimeout(() => this.#clearInput(), 50);
    return query;
  }

  /**
   * Disables input field
   */
  disableSearch() {
    document.querySelector('input.search__box').disabled = true;
  }

  /**
   * Enables input field
   */
  enableSearch() {
    document.querySelector('input.search__box').disabled = false;
  }

  /**
   * Disable search button
   */
  disableButton() {
    document.querySelector('button.search__icon').disabled = true;
  }

  /**
   * Enable search button
   */
  enableButton() {
    document.querySelector('button.search__icon').disabled = false;
  }

  /**
   * Handle click event of search btn, enter event of input field element. Executes searchController when the event is triggered
   * @param {Function} searchController searchController from controller.js
   */
  eventHandlers(searchController) {
    const searchBtn = document.querySelector('button.search__icon');
    const input = document.querySelector('input.search__box');
    searchBtn.addEventListener('click', searchController);
    input.addEventListener('keydown', e => {
      if (e.key == 'Enter') {
        searchController();
        document.querySelector('input.search__box').blur();
      }
    });
  }
}

export default new SearchView();
