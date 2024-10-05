import * as model from './model.js';
import darkModeView from './views/darkModeView.js';
import publishView from './views/publishView.js';
import deleteView from './views/deleteView.js';
import articleView from './views/articleView.js';
import bookmarkView from './views/bookmarkView.js';
import sortView from './views/sortView.js';
import editView from './views/editView.js';

// -- Article logic
const controlArticle = function () {
   articleView.upload(controlAddArticles);
   articleView.observer();
};

const controlAddArticles = function () {
   model.addArticle(articleView.article);
};

const controlDeleteArticles = function () {
   model.deleteArticle(deleteView.articleH2text);
};

const controlDelete = function () {
   deleteView.deleteArticleMarkup(
      controlDeleteArticles,
      controlRemoveBookmarkData2
   );
   deleteView.deleteMessageOnLoad(model.state.articles);
};

const renderArticlesOnLoad = function () {
   model.state.articles?.map((article) => articleView.render(article));
};

// -- Edit logic
const controlEdit = function () {
   editView.showEditModal(controlEditHandler, model.state.articles);
};

const controlEditHandler = function () {
   model.updateArticle(editView.data, editView.articleH2);
};

// -- Sorting logic
const controlSort = function () {
   sortView.sortByTag(model.state.articles, controlSortHandler);
};

const controlSortHandler = function () {
   model.persistSorting(sortView.selectedTag);
};

// -- Dark mode logic
const controlDarkMode = function () {
   darkModeView.loadTheme();
   darkModeView.toggleTheme();
};

// -- Publish modal logic
const controlPublish = function () {
   publishView.showPublishModal();
   publishView.exitPublishModal();
};

// -- Bookmark logic
const controlBookmarks = function () {
   bookmarkView.createBookmark(controlAddBookmark, controlRemoveBookmarkData);
   bookmarkView.toggleDropdown(model.state.bookmarks);
};

const controlAddBookmark = function () {
   model.addBookmark(bookmarkView.articleH2);
   bookmarkView.renderBookmarks(model.state.bookmarks);
};

const controlRemoveBookmarkData = function () {
   model.deleteBookmarkData(bookmarkView.articleH2);
};

const controlRemoveBookmarkData2 = function () {
   model.deleteBookmarkData2(deleteView.articleH2text);
};

const renderBookmarksOnLoad = function () {
   bookmarkView.renderBookmarks(model.state.bookmarks);
   bookmarkView.persistBookmarkIcon(model.state.articles);
};

const init = function () {
   controlArticle();
   controlSort();
   renderArticlesOnLoad();
   renderBookmarksOnLoad();
   controlBookmarks();
   controlPublish();
   controlDelete();
   controlDarkMode();
   controlEdit();
};
init();
