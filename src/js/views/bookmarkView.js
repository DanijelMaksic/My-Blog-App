import View from './view.js';

class BookmarkView extends View {
    dropdownParent = document.querySelector('.bookmark-parent');
    dropdownBtn = document.querySelector('.dropdown-btn');
    bookmarkContainer = document.querySelector('.bookmark-container');
    dropdownItems = [];
    bookmarkH2s = [];
    articleH2;

    renderBookmarks(bookmarkObjects) {
        bookmarkObjects.forEach((obj) => {
            if (!obj.rendered) {
                this.#render(obj);
                obj.rendered = true;
            }
        });
    }

    toggleDropdown(bookmarks) {
        const thisObject = this;
        thisObject.renderBookmarkMessage();

        this.dropdownBtn?.addEventListener('click', function () {
            // - Check if any bookmarks exist
            if (bookmarks.length === 0) {
                thisObject.bookmarkContainer.classList.toggle(
                    'dropdown-active'
                );
                thisObject.dropdownBtn.classList.add(
                    'focus:dark:brightness-150'
                );
                const backdropDiv = document.querySelector('.backdrop-div');
                backdropDiv.classList.add('backdrop-blur-xl');

                thisObject.exitDropdown();
                return;
            }

            const bookmarkMsg = document.querySelector('.bookmark-message');
            bookmarkMsg?.remove();

            thisObject.bookmarkContainer.classList.toggle('dropdown-active');
            const backdropDiv = document.querySelector('.backdrop-div');
            backdropDiv.classList.add('backdrop-blur-xl');

            thisObject.dropdownBtn.classList.add('focus:dark:brightness-150');

            thisObject.exitDropdown();
        });
    }

    renderBookmarkMessage() {
        this.dropdownParent?.insertAdjacentHTML(
            'afterend',
            this.#generateBookmarkMessage()
        );
    }

    #generateBookmarkMessage() {
        return `
         <span class="bookmark-message select-none border-2 border-gray-300 dark:border-transparent text-3xl text-gray-600 dark:text-gray-300 text-center bg-white dark:bg-gray-950 py-6 px-12 w-1/2 shadow-lg rounded-xl md:w-3/4 md:text-5xl md:py-12 md:px-16 sm:px-12 sm:text-3xl sm:py-6 md:mx-auto md:mt-24 sm:w-11/12">You haven't saved any articles yet!</span>
      `;
    }

    exitDropdown() {
        const thisObject = this;

        // - Remove focus on container on click or mouseleave
        if (window.matchMedia('(pointer: coarse)').matches) {
            this.bookmarkContainer.addEventListener('click', function () {
                thisObject.bookmarkContainer.classList.remove(
                    'dropdown-active'
                );
                thisObject.dropdownBtn.classList.remove(
                    'focus:dark:brightness-150'
                );
                thisObject.dropdownBtn.classList.remove('focus:brightness-50');

                const backdropDiv = document.querySelector('.backdrop-div');
                backdropDiv.classList.remove('backdrop-blur-xl');
            });
        } else {
            //
            this.bookmarkContainer.addEventListener('mouseleave', function () {
                thisObject.bookmarkContainer.classList.remove(
                    'dropdown-active'
                );
                thisObject.dropdownBtn.classList.remove(
                    'focus:dark:brightness-150'
                );
                thisObject.dropdownBtn.classList.remove('focus:brightness-50');

                const backdropDiv = document.querySelector('.backdrop-div');
                backdropDiv.classList.remove('backdrop-blur-xl');
            });
        }
    }

    persistBookmarkIcon(articles) {
        const theArticles = articles.filter(
            (article) => article.isBookmarked === true
        );

        const ids = theArticles.map((article) => article.id);

        const allArticles = [...document.getElementsByTagName('article')];
        const articleIDs = allArticles.map((article) => +article.id);

        const savedArticles = articleIDs.filter((articleID) =>
            ids.includes(articleID)
        );

        const articleStringsID = savedArticles.map((article) =>
            article.toString()
        );

        articleStringsID.map((currentStringID) => {
            const currentMarkup = document.getElementById(`${currentStringID}`);

            // - Change icon
            const bookmarkBtnThin =
                currentMarkup.querySelector('.bookmark-thin');
            const bookmarkBtnFull =
                currentMarkup.querySelector('.bookmark-full');
            bookmarkBtnThin.classList.add('hidden');
            bookmarkBtnFull.classList.remove('hidden');

            // - Change article color
            if (currentMarkup.classList.contains('dark:bg-gray-900')) {
                currentMarkup.classList.remove('dark:bg-gray-900');
                currentMarkup.classList.add('dark:bg-[#0A1021]');
            }

            if (currentMarkup.classList.contains('bg-gray-100')) {
                currentMarkup.classList.remove('bg-gray-100');
                currentMarkup.classList.add('bg-gray-200');
            }

            // Adapt dropdown-btn icon
            const iconOutline = this.dropdownBtn.querySelector('.icon-outline');
            const iconFilled = this.dropdownBtn.querySelector('.icon-filled');

            if (iconOutline.classList.contains('hidden')) {
                iconOutline.classList.remove('hidden');
                iconFilled.classList.add('hidden');
            }
            if (iconFilled.classList.contains('hidden')) {
                iconFilled.classList.remove('hidden');
                iconOutline.classList.add('hidden');
            }
        });
    }

    createBookmark(handleAdd, handleDelete) {
        window.addEventListener('click', (e) => {
            if (e.target.closest('#bookmarks')) {
                const bookmarks = e.target.closest('#bookmarks');
                const bookmarkBtnThin =
                    bookmarks.querySelector('.bookmark-thin');
                const bookmarkBtnFull =
                    bookmarks.querySelector('.bookmark-full');
                const articleMarkup = bookmarks.closest('.article-element');

                if (bookmarkBtnFull.classList.contains('hidden')) {
                    // - Change icon
                    bookmarkBtnThin.classList.add('hidden');
                    bookmarkBtnFull.classList.remove('hidden');

                    // Adapt dropdown-btn icon
                    const iconOutline =
                        this.dropdownBtn.querySelector('.icon-outline');
                    const iconFilled =
                        this.dropdownBtn.querySelector('.icon-filled');

                    iconOutline.classList.add('hidden');
                    iconFilled.classList.remove('hidden');

                    // - Change article color
                    if (articleMarkup.classList.contains('dark:bg-gray-900')) {
                        articleMarkup.classList.remove('dark:bg-gray-900');
                        articleMarkup.classList.add('dark:bg-[#0A1021]');
                    }

                    if (articleMarkup.classList.contains('bg-gray-100')) {
                        articleMarkup.classList.remove('bg-gray-100');
                        articleMarkup.classList.add('bg-gray-200');
                    }

                    // - Get header content
                    this.articleH2 =
                        articleMarkup.querySelector('.article-h2').innerText;

                    handleAdd();
                    //
                } else {
                    // - Get bookmark headers
                    const allDropdownItemsNodes =
                        document.querySelectorAll('.dropdown-item');
                    this.dropdownItems = Array.from(allDropdownItemsNodes);

                    this.bookmarkH2s = this.dropdownItems.map((item) =>
                        item?.querySelector('.bookmark-h2').textContent.trim()
                    );

                    // - Change icon
                    bookmarkBtnFull.classList.add('hidden');
                    bookmarkBtnThin.classList.remove('hidden');

                    // Adapt dropdown-btn icon
                    const iconOutline =
                        this.dropdownBtn.querySelector('.icon-outline');
                    const iconFilled =
                        this.dropdownBtn.querySelector('.icon-filled');
                    const allBookmarkThinBtnsNode =
                        document.querySelectorAll('.bookmark-thin');
                    const allBookmarkThinBtnsArray = Array.from(
                        allBookmarkThinBtnsNode
                    );

                    iconFilled.classList.remove('hidden');
                    iconOutline.classList.add('hidden');

                    // check if all bookmark buttons are thin
                    const check = allBookmarkThinBtnsArray.every(
                        (thinBtn) => !thinBtn.classList.contains('hidden')
                    );

                    if (check) {
                        iconFilled.classList.add('hidden');
                        iconOutline.classList.remove('hidden');
                    }

                    // - Change article color
                    if (!articleMarkup.classList.contains('dark:bg-gray-900')) {
                        articleMarkup.classList.remove('dark:bg-[#0A1021]');
                        articleMarkup.classList.add('dark:bg-gray-900');
                    }

                    if (!articleMarkup.classList.contains('bg-gray-100')) {
                        articleMarkup.classList.remove('bg-gray-200');
                        articleMarkup.classList.add('bg-gray-100');
                    }

                    // - Get header content
                    this.articleH2 =
                        articleMarkup.querySelector('.article-h2').innerText;

                    const [filteredString] = this.bookmarkH2s.filter(
                        (bookmarkH2) => bookmarkH2 === this.articleH2
                    );

                    const [theItem] = this.dropdownItems.filter(
                        (item) =>
                            item
                                ?.querySelector('.bookmark-h2')
                                .textContent.trim() === filteredString
                    );

                    // - Delete currently clicked item's markup from this array
                    const [theBookmarkMarkup] = this.dropdownItems.filter(
                        (bookmark) =>
                            bookmark
                                .querySelector('.bookmark-h2')
                                .textContent.trim() === this.articleH2
                    );

                    const theBookmarkMarkupIndex =
                        this.dropdownItems.indexOf(theBookmarkMarkup);
                    this.dropdownItems.splice(theBookmarkMarkupIndex, 1);

                    // - Delete clicked bookmark from bookmarkh2s array
                    const [theBookmark] = this.bookmarkH2s.filter(
                        (bookmark) => bookmark === this.articleH2
                    );
                    const theBookmarkIndex =
                        this.bookmarkH2s.indexOf(theBookmark);
                    this.bookmarkH2s.splice(theBookmarkIndex, 1);

                    // - Delete bookmark
                    handleDelete();
                    theItem?.remove();

                    const bookmarkMsg =
                        document.querySelector('.bookmark-message');
                    if (!bookmarkMsg) this.renderBookmarkMessage();
                }
            }
        });
    }

    #render(data) {
        this.dropdownParent?.insertAdjacentHTML(
            'afterend',
            this.#generateMarkup(data)
        );
    }

    #generateMarkup(data) {
        return `
         <a href="#${data.id}" class="dropdown-item text-2xl text-gray-300" style="filter: drop-shadow(0 1.5rem 2rem rgba(0, 0, 0, 0.342))">
                  <div class="grid items-center grid-cols-2 transition-all sm:grid-cols-1 hover:brightness-110">
                     <img class="object-cover w-full h-48 sm:h-28" src="${data.imageURL}" alt="Saved Article Image">
                     <div class="p-8 bg-gray-50 dark:bg-gray-800 sm:flex sm:flex-col sm:gap-1 sm:px-12 sm:pt-5 sm:pb-7 sm:bg-white">
                        <h2 class="bookmark-h2 text-3xl transition text-gray-600 dark:text-gray-200 sm:text-2xl ">${data.title}
                        </h2>
                        <h3 class="text-lg sm:text-base text-gray-500 dark:text-[#a9b5c6]">${data.description}
                        </h3>
                     </div>
                  </div>
               </a>
      `;
    }
}

export default new BookmarkView();
