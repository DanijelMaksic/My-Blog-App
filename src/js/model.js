import { MIN, MAX } from './config.js';

export const state = {
   articles: [],
   bookmarks: [],
};

// -- Article logic

export const addArticle = function (article) {
   state.articles?.push(article);
   persistArticle(article, article?.id);
};

export const deleteArticle = function (articleH2text) {
   const content = state.articles.filter((el) => el.title === articleH2text);
   const contentObject = content[0];
   removeArticleFromStorage(contentObject.id);

   const articleIndex = state.articles.indexOf(contentObject);
   state.articles.splice(articleIndex, 1);
};

export const updateArticle = function (data, articleH2) {
   const [theArticle] = state.articles.filter(
      (item) => item.title === articleH2
   );

   const [theBookmark] = state.bookmarks?.filter(
      (el) => el.title === articleH2
   );

   // Update articles array in state
   const articleIndex = state.articles.indexOf(theArticle);
   state.articles[articleIndex].title = data.title;
   state.articles[articleIndex].description = data.description;
   state.articles[articleIndex].tag = data.tag;
   state.articles[articleIndex].imageURL = data.imageURL;
   state.articles[articleIndex].content = data.content;

   // Update bookmarks array in state
   if (theBookmark) {
      const bookmarkIndex = state.bookmarks.indexOf(theBookmark);
      state.bookmarks[bookmarkIndex].title = data.title;
      state.bookmarks[bookmarkIndex].description = data.description;
      state.bookmarks[bookmarkIndex].imageURL = data.imageURL;
      state.bookmarks[bookmarkIndex].content = data.content;
      state.bookmarks[bookmarkIndex].rendered = false;

      persistBookmark(
         state.bookmarks[bookmarkIndex],
         state.bookmarks[bookmarkIndex].bookmarkID
      );
   }

   // Update storage
   const currentArticle = state.articles[articleIndex];
   const currentArticleID = currentArticle.id.toString();
   persistArticle(currentArticle, currentArticleID);
};

const persistArticle = function (article, id) {
   localStorage.setItem('article-' + id, JSON.stringify(article));
};

const removeArticleFromStorage = function (id) {
   localStorage.removeItem('article-' + id);
};

// -- Bookmark logic

export const addBookmark = function (h2content) {
   // - Fetch current article
   const [theArticle] = state.articles.filter((el) => el.title === h2content);
   const articleIndex = state.articles.indexOf(theArticle);
   const currentArticle = state.articles[articleIndex];
   currentArticle.isBookmarked = true;

   const currentArticleID = currentArticle.id.toString();
   persistArticle(currentArticle, currentArticleID);

   // - Create current bookmark object
   const [bookmark] = state.articles.filter((el) => el.title === h2content);

   state.bookmarks.push(bookmark);
   const bookmarkIndex = state.bookmarks.indexOf(bookmark);

   state.bookmarks[bookmarkIndex].rendered = undefined;
   state.bookmarks[bookmarkIndex].bookmarkID = Math.round(
      Math.random() * (MAX - MIN) + MIN
   );

   persistBookmark(bookmark, bookmark?.bookmarkID);
};

export const deleteBookmarkData = function (articleH2) {
   // - Fetch current article
   const [theArticle] = state.articles.filter((el) => el.title === articleH2);

   const articleIndex = state.articles.indexOf(theArticle);
   const currentArticle = state.articles[articleIndex];
   currentArticle.isBookmarked = false;

   const currentArticleID = currentArticle.id.toString();
   persistArticle(currentArticle, currentArticleID);

   // - Remove current bookmark object
   const [theBookmark] = state.bookmarks.filter(
      (bookmark) => bookmark.title === articleH2
   );
   removeBookmarkFromStorage(theBookmark.bookmarkID);
   const bookmarkIndex = state.bookmarks.indexOf(theBookmark);
   state.bookmarks.splice(bookmarkIndex, 1);
};

export const deleteBookmarkData2 = function (articleh2) {
   // - Find article data to be deleted
   const [theBookmark] = state.bookmarks.filter(
      (bookmark) => bookmark.title === articleh2
   );

   const [theArticle] = state.articles.filter((el) => el.title === articleh2);
   const articleIndex = state.articles.indexOf(theArticle);
   if (!state.articles.length === 0)
      state.articles[articleIndex].isBookmarked = false;

   removeBookmarkFromStorage(theBookmark.bookmarkID);
   const bookmarkIndex = state.bookmarks.indexOf(theBookmark);
   state.bookmarks.splice(bookmarkIndex, 1);
};

const persistBookmark = function (bookmark, bookmarkID) {
   localStorage.setItem('bookmark-' + bookmarkID, JSON.stringify(bookmark));
};

const removeBookmarkFromStorage = function (bookmarkID) {
   localStorage.removeItem('bookmark-' + bookmarkID);
};

// -- Sorting logic

export const persistSorting = function (tag) {
   localStorage.setItem('currentTag', tag);
};

// -- Storage logic

const allStorage = function () {
   let archive = [],
      keys = Object.keys(localStorage),
      i = 0,
      key;

   for (; (key = keys[i]); i++) {
      archive.push(key + '=' + localStorage.getItem(key));
   }

   return archive;
};

const init = function () {
   const allItems = allStorage();

   // Exclude all except article IDs

   const storageArticles = allItems.filter(
      (item) => !item.includes('selectedTheme=light')
   );
   const storageArticles2 = storageArticles.filter(
      (item) => !item.includes('selectedTheme=dark')
   );

   const storageArticles3 = storageArticles2.filter(
      (item) => !item.includes('bookmark-')
   );

   const storageArticles4 = storageArticles3.filter(
      (item) => !item.includes('currentTag')
   );

   const articleIDs = storageArticles4?.map((item) => item.slice(0, 18));

   articleIDs?.forEach((item) =>
      state.articles.push(JSON.parse(localStorage.getItem(item)))
   );

   // Exclude all except bookmark IDs

   const storageBookmarks = allItems.filter(
      (item) => !item.includes('selectedTheme=light')
   );
   const storageBookmarks2 = storageBookmarks.filter(
      (item) => !item.includes('selectedTheme=dark')
   );

   const storageBookmarks3 = storageBookmarks2.filter(
      (item) => !item.includes('article-')
   );

   const storageBookmarks4 = storageBookmarks3.filter(
      (item) => !item.includes('currentTag')
   );

   const bookmarkIDs = storageBookmarks4?.map((item) => item.slice(0, 19));

   bookmarkIDs?.forEach((item) =>
      state.bookmarks.push(JSON.parse(localStorage.getItem(item)))
   );
};
init();

// localStorage.clear();
