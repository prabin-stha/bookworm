class LoadMoreView {
  #parentEl = document.querySelector('.search-container');

  /**
   * Generates HTML markup for load more button
   * @returns HTML markup
   */
  #generateMarkup() {
    return `
      <button class="load-more">
        <p>
      Load More&nbsp;<span><i class="fas fa-arrow-down"></i></span>
        </p>
      </button>  
    `;
  }

  /**
   * Add click event handler to load more button and run loadMoreController when clicked
   * @param {Function} handler loadMoreController from controller.js
   */
  eventHandlers(handler) {
    const loadMoreBtn = document.querySelector('button.load-more');
    loadMoreBtn.addEventListener('click', handler);
  }

  /**
   * Remove click event handler from load more button
   * @param {Function} handler loadMoreController from controller.js
   */
  removeHandlers(handler) {
    const loadMoreBtn = document.querySelector('button.load-more');
    loadMoreBtn.removeEventListener('click', handler);
  }

  /**
   * Render load more button inside the parent container
   */
  render() {
    const markup = this.#generateMarkup();
    this.#parentEl.insertAdjacentHTML('beforeend', markup);
  }
}

export default new LoadMoreView();
