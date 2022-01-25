class LoadMoreView {
  #parentEl = document.querySelector('.search-container');

  #generateMarkup() {
    return `
      <button class="load-more">
        <p>
      Load More&nbsp;<span><i class="fas fa-arrow-down"></i></span>
        </p>
      </button>  
    `;
  }

  eventHandlers(handler) {
    const loadMoreBtn = document.querySelector('button.load-more');
    loadMoreBtn.addEventListener('click', handler);
  }

  render() {
    const markup = this.#generateMarkup();
    this.#parentEl.insertAdjacentHTML('beforeend', markup);
  }
}

export default new LoadMoreView();
