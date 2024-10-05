import View from './view.js';
import { MIN, MAX } from '../config.js';

class ArticleView extends View {
    #btnParentEl = document.getElementById('btn-parent');
    article;

    upload(handler) {
        const thisObject = this;

        this.form?.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);

            // - Close modal and delete starter message
            thisObject.togglePublishModal();
            thisObject.clearMessage();

            // Get tag
            const tag = document.getElementById('tag');

            // - Create NEW article
            thisObject.article = data;
            thisObject.article.tag = tag.value;
            thisObject.article.date = thisObject.#date();
            thisObject.article.id = thisObject.#getRandomNumber();
            thisObject.#clearInput();
            thisObject.render(data);

            // Upon creating new article, sort by "All"
            const sortTagMenu = document.getElementById('sort-tag-menu');
            sortTagMenu.value = '#All';

            const allArticlesNodes =
                document.querySelectorAll('.article-element');
            const allArticlesArray = Array.from(allArticlesNodes);

            allArticlesArray.forEach((article) =>
                article.classList.remove('hidden')
            );

            const sortMessage = document.getElementById('sort-message');
            sortMessage?.remove();

            localStorage.setItem('currentTag', sortTagMenu.value);
            handler();
        });
    }

    #clearInput() {
        const inputElements = document.querySelectorAll('.input-element');
        inputElements.forEach((el) => (el.value = ''));
    }

    #getRandomNumber() {
        return Math.round(Math.random() * (MAX - MIN) + MIN);
    }

    render(data) {
        this.#btnParentEl?.insertAdjacentHTML(
            'afterend',
            this.#generateMarkup(data)
        );
        this.styleFirstLetter();
    }

    #date() {
        const now = new Date();
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        };
        const locale = navigator.language;
        return new Intl.DateTimeFormat(locale, options).format(now);
    }

    #generateMarkup(data) {
        return `    
         <article 
         id="${data.id}"
         class="article-element relative flex flex-col justify-self-center w-1/2 gap-8 px-24 py-20 pb-12 mt-10 2xl:w-2/3 xl:w-2/3 lg:w-3/4 md:pt-16 md:pb-10 md:px-12 md:w-full sm:gap-6 sm:mt-6 sm:p-8 sm:pb-6 sm:px-6 bg-gray-100 dark:bg-gray-900 "
         style="transition: all 0.4s">
            <div class="flex flex-col gap-2 sm:gap-2">
               <h2 class="article-h2 text-7xl sm:text-6xl pb-2 sm:pb-0 text-gray-700 dark:text-gray-200">${data.title}
               </h2>
               <h3 class="delete-h3 text-3xl text-gray-500 dark:text-gray-400 sm:text-2xl">${data.description}
               </h3>
            </div>

            <div id="bookmarks" class="bookmarks absolute top-[-9px] right-6 2xl:top-[-10px] md:right-10 sm:top-[-9px] sm:right-1">
               <img class="bookmark-thin cursor-pointer w-14 h-14 2xl:w-16 2xl:h-16 sm:w-14 sm:h-14" src="././src/img/bookmark.png" alt="Bookmark Outline Icon">
               <img class="bookmark-full hidden cursor-pointer w-14 h-14 2xl:w-16 2xl:h-16 sm:w-14 sm:h-14" src="././src/img/bookmark-filled.png" alt="Bookmark Filled Icon">
            </div>
            
            <div
               class="a-div mt-2 sm:mt-0 h-0.5 bg-gradient-to-r from-gray-300 to-gray-100 to-100% dark:from-gray-600 dark:to-gray-900"
            ></div>


            <div class="tag-parent flex justify-between sm:pt-2 items-center">
                <span class="delete-span mt-[-12px] sm:mt-[-20px] text-gray-500 dark:text-gray-300 sm:text-base">Posted on ${data.date}</span>

                <span class="tag-element dark:bg-[#67563e] bg-[#f0debe] px-3 py-1 rounded-full mt-[-12px] sm:mt-[-20px] text-gray-500 dark:text-gray-300 sm:text-base">${data.tag}</span>
            </div>

            <img class="delete-img"  src="${data.imageURL}" alt="Article Image">

            <p class="delete-p text-3xl text-justify sm:leading-[1.7rem] whitespace-pre-line text-gray-600 dark:text-gray-100 sm:text-xl sm:text-gray-700" style="font-family: 'Cormorant Garamond', serif;">${data.content}
            </p>

            <div
                  class="h-0.5 bg-gradient-to-l from-gray-300 to-gray-100 to-100% dark:from-gray-600 dark:to-gray-900 sm:bg-gradient-to-r"
               ></div>


            <div class="flex justify-end sm:justify-start gap-8 sm:mt-2">      
                <button><img id="edit-btn" src="src/img/edit.png" class="edit-btn transition w-12 h-12 hover:brightness-125"></button>

                <button><img id="delete-btn" src="src/img/bin.png" class="delete-btn brightness-110 dark:brightness-100 transition w-12 h-12 hover:brightness-125"></button>
            </div>
         </article>
      `;
    }

    observer() {
        const header = document.querySelector('.header-element');
        const footer = document.querySelector('.footer-element');
        const chevronUp = document.querySelector('.chevron-up');

        const observeChevron = new IntersectionObserver(
            function (entries) {
                const entry = entries[0];

                !entry.isIntersecting
                    ? chevronUp.classList.add('active')
                    : chevronUp.classList.remove('active');
            },
            {
                root: null,
                threshold: 0,
                rootMargin: '0px',
            }
        );

        observeChevron.observe(header);
        observeChevron.observe(footer);
    }
}

export default new ArticleView();
