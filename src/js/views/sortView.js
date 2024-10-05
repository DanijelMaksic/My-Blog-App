import View from './view.js';

class SortView extends View {
    sortTagMenu = document.getElementById('sort-tag-menu');
    parentEl = document.querySelector('.main-element');
    selectedTag;
    tags = [];

    sortByTag(articles, handler) {
        const currentTag = localStorage.getItem('currentTag');
        this.sortTagMenu.value = currentTag;

        if (!this.sortTagMenu.value) this.sortTagMenu.value = '#All';

        articles.forEach((article) => this.tags.push(article.tag));

        if (this.sortTagMenu.value !== '#All') {
            setTimeout(() => {
                const allArticlesNodes =
                    document.querySelectorAll('.article-element');
                const allArticlesArray = Array.from(allArticlesNodes);

                // Sorting
                const sortedOutArticles = allArticlesArray.filter(
                    (article) =>
                        article.querySelector('.tag-element').innerText !==
                        currentTag
                );
                sortedOutArticles.forEach((article) => {
                    article.classList.add('hidden');
                });

                // Check if any articles are visible, if they are, don't display message, otherwise display it
                const check = allArticlesArray.every((article) =>
                    article.classList.contains('hidden')
                );
                if (!check) return;

                this.renderSortMessage();

                const message = document.getElementById('message');
                message?.classList.add('hidden');
            }, 1);
        }

        this.sortTagMenu.addEventListener('change', () => {
            this.sortArticles(handler);
        });
    }

    sortArticles(handler) {
        const sortMessage = document.getElementById('sort-message');

        // Sort articles by selected tag
        this.selectedTag = this.sortTagMenu.value;
        handler();

        const allArticlesNodes = document.querySelectorAll('.article-element');
        const allArticlesArray = Array.from(allArticlesNodes);

        // reset article markups
        allArticlesArray.forEach((article) =>
            article.classList.remove('hidden')
        );

        // sorting
        const sortedOutArticles = allArticlesArray.filter(
            (article) =>
                article.querySelector('.tag-element').innerText !==
                this.selectedTag
        );
        sortedOutArticles.forEach((article) => {
            article.classList.add('hidden');
        });

        // When sorting by "All", show all articles
        if (this.selectedTag === '#All') {
            allArticlesArray.forEach((article) => {
                article.classList.remove('hidden');
            });
        }

        sortMessage?.remove();

        // Check if any articles are visible, if they are, don't display message, otherwise display it
        const check = allArticlesArray.every((article) =>
            article.classList.contains('hidden')
        );
        if (!check) return;

        this.renderSortMessage();
        const message = document.getElementById('message');

        message?.classList.add('hidden');

        if (this.selectedTag === '#All') {
            message?.classList.remove('hidden');
            document.getElementById('sort-message').remove();
        }
    }

    renderSortMessage() {
        this.parentEl.insertAdjacentHTML(
            'afterend',
            this.#generateSortMessage()
        );
    }

    #generateSortMessage() {
        return `
         <div
                id="sort-message"
                class="flex flex-col items-center w-2/5 gap-4 px-8 py-10 mt-24 text-center bg-gray-100 2xl:w-3/5 lg:w-4/5 md:w-5/6 rounded-xl sm:mt-16 dark:bg-gray-900 justify-self-center"
            >
                <span class="text-2xl text-gray-500 dark:text-gray-400"
                    >No article was found in this category!</span
                >
                <ion-icon class="w-20 h-20 text-gray-400 dark:text-gray-600" name="warning-outline"></ion-icon>
            </div>
      `;
    }
}

export default new SortView();
