import na from 'url:../../img/na.jpg';

class SearchView {
  #parentEl = document.querySelector('.search-container');
  #data;

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
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentEl.innerHTML = '';
  }

  #generateSearchResults() {
    this.#data.forEach(el => {
      let authors = el.authors
        ? el.authors
            .map(function (author) {
              return `${author[0]}`;
            })
            .join(', ')
        : 'N.A.';
      if (authors.length > 40) authors = authors.substring(0, 40) + '...';
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
        <div slot="title">${el.title ? el.title : 'N.A.'}</div>
        <div slot="author">${authors}</div>
        <div slot="date">${el.publish_date ? el.publish_date : 'N.A.'}</div>
      </book-item-component>
    `;
      this.#parentEl.insertAdjacentHTML('beforeend', markup);
    });
  }
}

export default new SearchView();
