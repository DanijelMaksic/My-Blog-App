import View from './view.js';

class DeleteView extends View {
    dropdownParent = document.querySelector('.bookmark-parent');
    dropdownBtn = document.querySelector('.dropdown-btn');
    parentEl = document.querySelector('.main-element');
    articleH2text;
    articles;

    deleteMessageOnLoad(article) {
        if (article.length > 0) this.clearMessage();
        this.articles = article;
    }

    deleteArticleMarkup(handler, handleDelete) {
        window.addEventListener('click', (e) => {
            if (e.target.closest('#delete-btn')) {
                const deleteBtn = e.target.closest('#delete-btn');
                const article = deleteBtn.closest('.article-element');

                this.articleH2text =
                    article.querySelector('.article-h2').innerText;
                const h2 = article.querySelector('.article-h2');
                const h3 = article.querySelector('.delete-h3');
                const p = article.querySelector('.delete-p');
                const span = article.querySelector('.delete-span');
                const img = article.querySelector('.delete-img');
                const bookmark = article.querySelector('.bookmarks');
                const edit = article.querySelector('.edit-btn');
                const deleteButton = article.querySelector('.delete-btn');
                const tag = article.querySelector('.tag-element');
                const bookmarkChecked =
                    bookmark.querySelector('.bookmark-full');

                const allElements = [];
                allElements.push(h2, h3, p, span, deleteBtn);
                allElements.map((el) => (el.textContent = ''));

                // - For other devices
                article.classList.add('max-h-0');
                if (article.classList.contains('py-20'))
                    article.classList.remove('py-20');
                if (article.classList.contains('pb-12'))
                    article.classList.remove('pb-12');
                if (article.classList.contains('mt-10'))
                    article.classList.remove('mt-10');

                // - For phones
                if (article.classList.contains('md:pt-16'))
                    article.classList.remove('md:pt-16');
                if (article.classList.contains('md:pb-10'))
                    article.classList.remove('md:pb-10');
                if (article.classList.contains('sm:p-8'))
                    article.classList.remove('sm:p-8');
                if (article.classList.contains('sm:pb-6'))
                    article.classList.remove('sm:pb-6');
                if (article.classList.contains('sm:mt-6'))
                    article.classList.remove('sm:mt-6');

                img.classList.add('opacity-0');
                bookmark.classList.add('opacity-0');
                tag.classList.add('opacity-0');
                edit.classList.add('hidden');
                deleteButton.classList.add('hidden');

                setTimeout(() => {
                    article.remove();
                }, 400);

                handler();

                // - If current article is bookmarked, delete the bookmark too

                if (!bookmarkChecked.classList.contains('hidden')) {
                    // - Get bookmark data
                    const allBookmarks = [
                        ...document.querySelectorAll('.dropdown-item'),
                    ];

                    const bookmarkHeaders = allBookmarks.map((item) =>
                        item?.querySelector('.bookmark-h2').textContent.trim()
                    );

                    const [filteredString] = bookmarkHeaders.filter(
                        (bookmarkH2) => bookmarkH2 === this.articleH2text
                    );

                    const [theItem] = allBookmarks.filter(
                        (item) =>
                            item
                                ?.querySelector('.bookmark-h2')
                                .textContent.trim() === filteredString
                    );

                    handleDelete();
                    theItem.remove();

                    // - Delete currently clicked item's markup from this array
                    const [theBookmarkMarkup] = allBookmarks.filter(
                        (bookmark) =>
                            bookmark
                                .querySelector('.bookmark-h2')
                                .textContent.trim() === this.articleH2text
                    );

                    const theBookmarkMarkupIndex =
                        allBookmarks.indexOf(theBookmarkMarkup);
                    allBookmarks.splice(theBookmarkMarkupIndex, 1);

                    // - Delete clicked bookmark from bookmarkHeaders array
                    const [theBookmark] = bookmarkHeaders.filter(
                        (bookmark) => bookmark === this.articleH2text
                    );
                    const theBookmarkIndex =
                        bookmarkHeaders.indexOf(theBookmark);
                    bookmarkHeaders.splice(theBookmarkIndex, 1);

                    const bookmarkMsg =
                        document.querySelector('.bookmark-message');
                    bookmarkMsg?.remove();

                    if (allBookmarks.length === 0) {
                        this.renderBookmarkMessage();
                    }

                    // Adapt dropdown-btn icon
                    const iconOutline =
                        this.dropdownBtn.querySelector('.icon-outline');
                    const iconFilled =
                        this.dropdownBtn.querySelector('.icon-filled');
                    const allBookmarkFullBtnsNode =
                        document.querySelectorAll('.bookmark-full');
                    const allBookmarkFullBtnsArray = Array.from(
                        allBookmarkFullBtnsNode
                    );

                    bookmarkChecked.classList.add('hidden');

                    // check if all bookmark buttons are thin
                    const check = allBookmarkFullBtnsArray.every((fullBtn) =>
                        fullBtn.classList.contains('hidden')
                    );

                    if (check) {
                        iconFilled.classList.add('hidden');
                        iconOutline.classList.remove('hidden');
                    }
                }

                if (this.articles.length === 0) this.addMessage();
            }
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
}

export default new DeleteView();
