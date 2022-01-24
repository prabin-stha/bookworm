import { TIMEOUT_SECONDS } from './config.js';
import { getJSON, timeout } from './helpers.js';

export const state = {
  searchData: [],
};

const loadWorkIds = async function (search) {
  /**
   * *Returns Work Ids
   * @param search Takes in user search string
   */

  try {
    const data = await getJSON(
      `http://openlibrary.org/search.json?q=${search}&limit=10`
    );
    const workIds = data.docs.map(el => el.key);
    if (!workIds.length)
      throw new Error(
        `No books with name "${search}" found. Please try another book name!`
      );
    return workIds;
  } catch (err) {
    throw err;
  }
};

const loadAuthorName = async function (array) {
  /**
   * *Takes in array of object/s with key and returns name and key of author
   */
  try {
    let dataAuthor = [];
    if (!array) return undefined;
    for (item of array) {
      const { key } = item;
      const data = await getJSON(`https://openlibrary.org${key}.json`);
      dataAuthor.push([data.name, key]);
    }
    return dataAuthor;
  } catch (err) {
    throw err;
  }
};

const loadSubjects = async function (workId) {
  /**
   * *Takes in a workId and returns it's subjects if available else returns undefined
   */
  try {
    const data = await getJSON(`https://openlibrary.org${workId}.json`);
    if (!data.subjects) return undefined;
    const { subjects } = data;
    return subjects;
  } catch (err) {
    console.error(err);
  }
};

export const loadSearchInfo = async function (search) {
  /**
   * *Returns search data for book-item-component
   * @param search Takes in user search string
   */
  try {
    const workIds = await loadWorkIds(search);

    for (workId of workIds) {
      let info = {
        key: undefined,
        title: undefined,
        authors: undefined,
        publish_date: undefined,
        covers: undefined,
      };

      const res = await Promise.race([
        fetch(`http://openlibrary.org${workId}/editions.json`),
        timeout(TIMEOUT_SECONDS),
      ]);
      const data = await res.json();

      if (!res.ok) continue;
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
      state.searchData.push(info);

      info = {
        key: undefined,
        title: undefined,
        authors: undefined,
        publish_date: undefined,
        covers: undefined,
      };
    }
  } catch (err) {
    throw err;
  }
};

export const loadBookInfo = async function (workId) {
  /**
   * *Returns book information based on workId
   * @param workId Takes in workId of a book
   */
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
      isbn_13: undefined,
      subjects: undefined,
      languages: [],
    };

    //Fetching each editions of a certain work
    const data = await getJSON(`http://openlibrary.org${workId}/editions.json`);

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
  } catch (err) {
    console.error(err);
  }
};
