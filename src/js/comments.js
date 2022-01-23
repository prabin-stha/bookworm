// import { _ } from 'core-js';

// try {
//   //Fetching all work id's of user search and storing it in a variable
//   const res = await fetch(
//     `http://openlibrary.org/search.json?q=${search}&limit=30`
//   );
//   const data = await res.json();
//   const workIds = data.docs.map(el => el.key);
// const searchData = [];

// for (workId of workIds) {
//   let info = {
//     key: undefined,
//     title: undefined,
//     subtitle: undefined,
//     publish_date: undefined,
//     authors: undefined,
//     publishers: undefined,
//     number_of_pages: undefined,
//     description: undefined,
//     covers: undefined,
//     isbn_10: undefined,
//     isbn_13: undefined,
//     languages: [],
//   };
//   //Fetching each editions of a certain work
//   const res = await fetch(`http://openlibrary.org${workId}/editions.json`);
//   const data = await res.json();

//   if (data.error) continue;
//   const { entries } = data;

//   // For each edition, if there exist a property not available in the info object then insert its value
//   for (entry of entries) {
//     // If the language of the book is english or if the language property doesnot exist or is undefined then get information from that edition.
//     if (
//       entry.languages === undefined ||
//       entry.languages[0].key === '/languages/eng' ||
//       !entry.languages
//     ) {
//       //Insert value only if info.property is undefined
//       if (!info.key) info.key = workId;
//       if (!info.title && entry.title) info.title = entry.title;
//       if (!info.subtitle && entry.subtitle) info.subtitle = entry.subtitle;
//       if (!info.publish_date && entry.publish_date)
//         info.publish_date = entry.publish_date;
//       if (!info.authors && entry.authors) info.authors = entry.authors;
//       if (!info.publishers && entry.publishers)
//         info.publishers = entry.publishers;
//       if (!info.number_of_pages && entry.number_of_pages)
//         info.number_of_pages = entry.number_of_pages.toString();
//       if (!info.description && entry.description)
//         info.description = entry.description.value;
//       if (!info.covers && entry.covers)
//         info.covers = entry.covers[0].toString();
//       if (
//         !(info.isbn_10 && info.isbn_13) &&
//         entry.isbn_10 &&
//         entry.isbn_13
//       ) {
//         info.isbn_10 = entry.isbn_10[0];
//         info.isbn_13 = entry.isbn_13[0];
//       }
//     } else {
//       // Stores the languages available in certain edition of work
//       if (
//         !info.languages.includes(
//           ...entry.languages[0].key.split('/').splice(-1)
//         )
//       )
//         info.languages.push(
//           ...entry.languages[0].key.split('/').splice(-1)
//         );
//     }
//   }
//   //Inserting info into searchData list which contains book information for the user search. Each element is a different work of a book.

//   searchData.push(info);

//   //Clearing info object
//   info = {
//     key: undefined,
//     title: undefined,
//     subtitle: undefined,
//     publish_date: undefined,
//     authors: undefined,
//     publishers: undefined,
//     number_of_pages: undefined,
//     description: undefined,
//     covers: undefined,
//     isbn_10: undefined,
//     isbn_13: undefined,
//     languages: [],
//   };
//   const data = await loadWorkEditionData(workId);
//   const dataFilter = [data].filter(el => el != undefined);
//   searchData.push(...dataFilter);
// }

// console.log(searchData);
//   return workIds;
// } catch (err) {
//   //TODO: Make a proper error handling
//   console.log(err);
// }

//Loading and Rendering Book Information
// this.shadowRoot.b = undefined;

// async loadInfo(bookId) {
//   const result = await loadBookInfo(bookId);
//   this.shadowRoot.b = result;
// }

// this.loadInfo(bookId);
// const b = this.shadowRoot.b;

// const renderHTMLInfo = `
// <div class="book-header">
//     <div class="title-bookmark">
//       <h1>${b.title ? b.title : '<p>N.A.</p>'}</h1>
//       <span><i class="far fa-bookmark"></i></span>
//     </div>
//     <h2 class="description">
//       ${b.subtitle ? b.subtitle : '<p>N.A.</p>'}
//     </h2>
//     <h3 class="date">This edition was published in ${
//       b.publish_date ? b.publish_date : '<p>N.A.</p>'
//     }</h3>
//   </div>
//   <div class="book-body">
//     <div class="img-BScreen">
//     ${
//       b.covers
//         ? `<img
//           src="https://covers.openlibrary.org/b/id/${b.covers}-M.jpg"
//           height="250"
//           width="150"
//         />`
//         : `<div class="na-BScreen"><p>N.A.</p></div>`
//     }
//     </div>
//     <section class="content">
//       <div class="meta-container">
//         <div class="img-SScreen">
//         ${
//           b.covers
//             ? `<img
//               src="https://covers.openlibrary.org/b/id/${b.covers}-M.jpg"
//               height="150"
//               width="100"
//             />`
//             : `<div class="na-SScreen"><p>N.A.</p></div>`
//         }
//         </div>
//         <div class="meta">
//           <div class="author-publisher">
//             <div>
//               <h2>Author</h2>
//               ${
//                 b.authors
//                   ? b.authors
//                       .map(function (author) {
//                         return `<a href="http://openlibrary.org${author[1]}"><p>${author[0]}</p></a>`;
//                       })
//                       .join('')
//                   : `<p>N.A.</p>`
//               }
//             </div>
//             <div>
//               <h2>Publisher</h2>
//               ${
//                 b.publishers
//                   ? b.publishers
//                       .map(function (publisher) {
//                         return `<p>${publisher}</p>`;
//                       })
//                       .join('')
//                   : '<p>N.A.</p>'
//               }
//             </div>
//           </div>
//           <div class="pages-isbn">
//             <div>
//               <h2>Pages</h2>
//               <p>${
//                 b.number_of_pages ? b.number_of_pages : '<p>N.A.</p>'
//               }</p>
//             </div>
//             <div>
//               <h2>ISBN10</h2>
//               <p>${b.isbn_10 ? b.isbn_10 : '<p>N.A.</p>'}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <hr />
//       <div class="description">
//         <h2>Description</h2>
//         <p>
//           ${b.description ? b.description : '<p>N.A.</p>'}
//         </p>
//       </div>
//       <div class="subjects">
//         <h2>Subjects</h2>
//         <p>
//           ${b.subjects ? b.subjects.join(', ') : '<p>N.A.</p>'}
//         </p>
//       </div>
//       <a href="https://www.pdfdrive.com/search?q=${
//         b.title
//       }" target="_blank">Search for this E-Book in PDF Drive</a>
//       <hr />
//       <div class="find-notes">
//         <div class="find-more">
//           <h2>Want to learn more about this book?</h2>
//           <a href="https://openlibrary.org${b.key}" target="_blank"
//             ><img
//               title="openlibrary"
//               src=${logo}
//               alt="openlibrary logo"
//               width="60px"
//           /></a>
//         </div>
//         <div class="notes">
//           <textarea
//             id="notes"
//             cols="35"
//             rows="8"
//             placeholder="Write some notes about this book here. Don't worry, the data will be saved inside your browser!"
//           ></textarea>
//         </div>
//       </div>
//     </section>
//   </div>
// `;

// bookContainer.innerHTML = '';
// bookContainer.insertAdjacentHTML('afterbegin', renderHTMLInfo);

//HTML
{
  /* <div class="book-header">
          <div class="title-bookmark">
            <h1>Think and Grow Rich</h1>
            <span><i class="far fa-bookmark"></i></span>
          </div>
          <h2 class="description">
            What the rich teach their kids about money that the poor and middle
            class do not!
          </h2>
          <h3 class="date">This edition was published in 2005</h3>
        </div>
        <div class="book-body">
          <div class="img-BScreen">
            <img
              src="https://covers.openlibrary.org/b/id/10528858-M.jpg"
              height="250"
              width="150"
            />
          </div>
          <section class="content">
            <div class="meta-container">
              <div class="img-SScreen">
                <img
                  src="https://covers.openlibrary.org/b/id/10528858-M.jpg"
                  height="150"
                  width="100"
                />
              </div>
              <div class="meta">
                <div class="author-publisher">
                  <div>
                    <h2>Author</h2>
                    <a href="#"><p>Napolean Hill</p></a>
                    <a href="#"><p>Napolean Hill</p></a>
                  </div>
                  <div>
                    <h2>Publisher</h2>
                    <p>Penguin</p>
                  </div>
                </div>
                <div class="pages-isbn">
                  <div>
                    <h2>Pages</h2>
                    <p>125</p>
                  </div>
                  <div>
                    <h2>ISBN10</h2>
                    <p>1235623</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="description">
              <h2>Description</h2>
              <p>
                Think and Grow Rich by Napoleon Hill examines the psychological
                power of thought and the brain in the process of furthering your
                career for both monetary and personal satisfaction. Originally
                published in 1937, this is one of the all-time self-help
                classics and a must read for investors and entrepreneurial
                types.
              </p>
            </div>
            <div class="subjects">
              <h2>Subjects</h2>
              <p>
                Rich People, Rich People, Rich People, Rich People, Rich People
              </p>
            </div>
            <a href="#">Search for this E-Book in PDF Drive</a>
            <hr />
            <div class="find-notes">
              <div class="find-more">
                <h2>Find out more on</h2>
                <a href="#"
                  ><img
                    title="openlibrary"
                    src="src/img/logo/openlibrary.png"
                    alt="openlibrary logo"
                    width="60px"
                /></a>
              </div>
              <div class="notes">
                <textarea
                  id="notes"
                  cols="35"
                  rows="8"
                  placeholder="Write some notes about the book here"
                ></textarea>
              </div>
            </div>
          </section>
        </div> */
}

//Models
// const loadWorkIds = async function (search) {
//   /**
//    * *Returns Work Ids
//    * @param search Takes in user search string
//    */

//   const res = await fetch(
//     `http://openlibrary.org/search.json?q=${search}&limit=10`
//   );
//   const data = await res.json();
//   const workIds = data.docs.map(el => el.key);
//   return workIds;
// };

// const loadAuthorName = async function (array) {
//   /**
//    * *Takes in array of object/s with key and returns name and key of author
//    */
//   let dataAuthor = [];
//   if (!array) return;
//   for (item of array) {
//     const { key } = item;
//     const req = await fetch(`https://openlibrary.org${key}.json`);
//     const data = await req.json();
//     dataAuthor.push([data.name, key]);
//   }
//   return dataAuthor;
// };

// const loadSubjects = async function (workId) {
//   /**
//    * *Takes in a workId and returns it's subjects if available else returns undefined
//    */
//   const res = await fetch(`https://openlibrary.org${workId}.json`);
//   const data = await res.json();
//   if (!data.subjects) return undefined;
//   const { subjects } = data;
//   return subjects;
// };

// const loadSearchInfo = async function (search) {
//   /**
//    * *Returns search data for book-item-component
//    * @param search Takes in user search string
//    */
//   const workIds = await loadWorkIds(search);
//   const searchData = [];

//   for (workId of workIds) {
//     let info = {
//       key: undefined,
//       title: undefined,
//       authors: undefined,
//       publish_date: undefined,
//       covers: undefined,
//     };

//     const res = await fetch(`http://openlibrary.org${workId}/editions.json`);
//     const data = await res.json();

//     if (data.error) continue;
//     const { entries } = data;

//     for (entry of entries) {
//       if (
//         entry.languages === undefined ||
//         entry.languages[0].key === '/languages/eng' ||
//         !entry.languages
//       ) {
//         if (!info.key) info.key = workId;
//         if (!info.covers && entry.covers)
//           info.covers = entry.covers[0].toString();
//         if (!info.title && entry.title) info.title = entry.title;
//         if (!info.publish_date && entry.publish_date)
//           info.publish_date = entry.publish_date;
//         if (!info.authors && entry.authors) info.authors = entry.authors;
//       }
//     }
//     if (info.authors) {
//       const authorInfo = await loadAuthorName(info.authors);
//       info.authors = authorInfo;
//     }
//     // const dataFilter = [info].filter(el => el != undefined);
//     // searchData.push(...dataFilter);
//     searchData.push(info);

//     info = {
//       key: undefined,
//       title: undefined,
//       authors: undefined,
//       publish_date: undefined,
//       covers: undefined,
//     };
//   }
//   return searchData;
// };

// const loadBookInfo = async function (workId) {
//   /**
//    * *Returns book information based on workId
//    * @param workId Takes in workId of a book
//    */
//   let info = {
//     key: undefined,
//     title: undefined,
//     subtitle: undefined,
//     publish_date: undefined,
//     authors: undefined,
//     publishers: undefined,
//     number_of_pages: undefined,
//     description: undefined,
//     covers: undefined,
//     isbn_10: undefined,
//     isbn_13: undefined,
//     subjects: undefined,
//     languages: [],
//   };

//   //Fetching each editions of a certain work
//   const res = await fetch(`http://openlibrary.org${workId}/editions.json`);
//   const data = await res.json();

//   if (data.error) return;
//   const { entries } = data;

//   // For each edition, if there exist a property not available in the info object then insert its value
//   for (entry of entries) {
//     // If the language of the book is english or if the language property doesnot exist or is undefined then get information from that edition.
//     if (
//       entry.languages === undefined ||
//       entry.languages[0].key === '/languages/eng' ||
//       !entry.languages
//     ) {
//       //Insert value only if info.property is undefined
//       if (!info.key) info.key = workId;
//       if (!info.title && entry.title) info.title = entry.title;
//       if (!info.subtitle && entry.subtitle) info.subtitle = entry.subtitle;
//       if (!info.publish_date && entry.publish_date)
//         info.publish_date = entry.publish_date;
//       if (!info.authors && entry.authors) info.authors = entry.authors;
//       if (!info.publishers && entry.publishers)
//         info.publishers = entry.publishers;
//       if (!info.number_of_pages && entry.number_of_pages)
//         info.number_of_pages = entry.number_of_pages.toString();
//       if (!info.description && entry.description)
//         info.description = entry.description.value;
//       if (!info.covers && entry.covers)
//         info.covers = entry.covers[0].toString();
//       if (!(info.isbn_10 && info.isbn_13) && entry.isbn_10 && entry.isbn_13) {
//         info.isbn_10 = entry.isbn_10[0];
//         info.isbn_13 = entry.isbn_13[0];
//       }
//     } else {
//       // Stores the languages available in certain edition of work
//       if (
//         !info.languages.includes(
//           ...entry.languages[0].key.split('/').splice(-1)
//         )
//       )
//         info.languages.push(...entry.languages[0].key.split('/').splice(-1));
//     }
//   }
//   const authorInfo = await loadAuthorName(info.authors);
//   info.authors = authorInfo;
//   const subjects = await loadSubjects(info.key);
//   info.subjects = subjects;
//   return info;
// };

//View
// const markup = `
//   <div class="book-header">
//       <div class="title-bookmark">
//         <h1>${b.title ? b.title : '<p>N.A.</p>'}</h1>
//         <span><i class="far fa-bookmark"></i></span>
//       </div>
//       <h2 class="description">
//         ${b.subtitle ? b.subtitle : '<p>N.A.</p>'}
//       </h2>
//       <h3 class="date">This edition was published in ${
//         b.publish_date ? b.publish_date : '<p>N.A.</p>'
//       }</h3>
//     </div>
//     <div class="book-body">
//       <div class="img-BScreen">
//       ${
//         b.covers
//           ? `<img
//             src="https://covers.openlibrary.org/b/id/${b.covers}-M.jpg"
//             height="250"
//             width="150"
//           />`
//           : `<div class="na-BScreen"><p>N.A.</p></div>`
//       }
//       </div>
//       <section class="content">
//         <div class="meta-container">
//           <div class="img-SScreen">
//           ${
//             b.covers
//               ? `<img
//                 src="https://covers.openlibrary.org/b/id/${b.covers}-M.jpg"
//                 height="150"
//                 width="100"
//               />`
//               : `<div class="na-SScreen"><p>N.A.</p></div>`
//           }
//           </div>
//           <div class="meta">
//             <div class="author-publisher">
//               <div>
//                 <h2>Author</h2>
//                 ${
//                   b.authors
//                     ? b.authors
//                         .map(function (author) {
//                           return `<a href="http://openlibrary.org${author[1]}"><p>${author[0]}</p></a>`;
//                         })
//                         .join('')
//                     : `<p>N.A.</p>`
//                 }
//               </div>
//               <div>
//                 <h2>Publisher</h2>
//                 ${
//                   b.publishers
//                     ? b.publishers
//                         .map(function (publisher) {
//                           return `<p>${publisher}</p>`;
//                         })
//                         .join('')
//                     : '<p>N.A.</p>'
//                 }
//               </div>
//             </div>
//             <div class="pages-isbn">
//               <div>
//                 <h2>Pages</h2>
//                 <p>${
//                   b.number_of_pages ? b.number_of_pages : '<p>N.A.</p>'
//                 }</p>
//               </div>
//               <div>
//                 <h2>ISBN10</h2>
//                 <p>${b.isbn_10 ? b.isbn_10 : '<p>N.A.</p>'}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <hr />
//         <div class="description">
//           <h2>Description</h2>
//           <p>
//             ${b.description ? b.description : '<p>N.A.</p>'}
//           </p>
//         </div>
//         <div class="subjects">
//           <h2>Subjects</h2>
//           <p>
//             ${b.subjects ? b.subjects.join(', ') : '<p>N.A.</p>'}
//           </p>
//         </div>
//         <a href="https://www.pdfdrive.com/search?q=${
//           b.title
//         }" target="_blank">Search for this E-Book in PDF Drive</a>
//         <hr />
//         <div class="find-notes">
//           <div class="find-more">
//             <h2>Want to learn more about this book?</h2>
//             <a href="https://openlibrary.org${b.key}" target="_blank"
//               ><img
//                 title="openlibrary"
//                 src=${logo}
//                 alt="openlibrary logo"
//                 width="60px"
//             /></a>
//           </div>
//           <div class="notes">
//             <textarea
//               id="notes"
//               cols="35"
//               rows="8"
//               placeholder="Write some notes about this book here. Don't worry, the data will be saved inside your browser!"
//             ></textarea>
//           </div>
//         </div>
//       </section>
//     </div>
//   `;

// bookContainer.innerHTML = '';
// bookContainer.insertAdjacentHTML('afterbegin', markup);

// <!-- <book-item-component
//             url="https://covers.openlibrary.org/b/id/10528858-M.jpg"
//             padding="0"
//             justify-content="center"
//             book-id="/works/OL27448W"
//           >
//             <div slot="title">Think and Grow Rich</div>
//             <div slot="author">Napolien Hill</div>
//             <div slot="date">1997</div>
//           </book-item-component> -->
