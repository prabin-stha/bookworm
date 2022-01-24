import { mark } from 'regenerator-runtime';
import na from 'url:../../img/na.jpg';

class SearchView {
  #parentEl = document.querySelector('.search-container');
  #data;

  #clear() {
    this.#parentEl.innerHTML = '';
  }

  #clearAndInsert(markup) {
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  #generateSearchResults() {
    if (!this.#data) return;
    this.#data.forEach(el => {
      let authors = el.authors
        ? el.authors
            .map(function (author) {
              return `${author[0]}`;
            })
            .join(', ')
        : 'N.A.';
      if (authors.length > 40) authors = authors.substring(0, 40) + '...';
      let title = el.title ? el.title : 'N.A.';
      if (title.length > 16) title = title.substring(0, 16) + '...';
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
        <div slot="title">${title}</div>
        <div slot="author">${authors}</div>
        <div slot="date">${el.publish_date ? el.publish_date : 'N.A.'}</div>
      </book-item-component>
    `;
      this.#parentEl.insertAdjacentHTML('beforeend', markup);
      const lenSearch = this.#data.length;
      this.renderSuccess(`${lenSearch} books with similar names found`);
    });
  }

  render(data) {
    this.#data = data;
    this.#clear();
    this.#generateSearchResults();
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

  #clearInput() {
    document.querySelector('input.search__box').value = '';
  }

  getQuery() {
    const query = document.querySelector('input.search__box').value;
    this.#clearInput();
    return query;
  }

  eventHandlers(searchController) {
    const searchBtn = document.querySelector('button.search__icon');
    const input = document.querySelector('input.search__box');
    searchBtn.addEventListener('click', searchController);
    input.addEventListener('keydown', e => {
      if (e.key == 'Enter') searchController();
    });
  }
}

export default new SearchView();
