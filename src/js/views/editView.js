import View from './view.js';

class EditView extends View {
   data;
   articleH2;

   submitForm(article, handlerData) {
      const thisObject = this;
      const form = document.getElementById('edit-content');

      form?.addEventListener('submit', function (e) {
         e.preventDefault();
         const dataArr = [...new FormData(this)];
         const data = Object.fromEntries(dataArr);

         const sortTagMenu = document.getElementById('edit-tag');
         data.tag = sortTagMenu.value;

         // Update article markup
         article.querySelector('.article-h2').innerText = data.title;
         article.querySelector('.delete-h3').innerText = data.description;
         article.querySelector('.delete-img').src = data.imageURL;
         article.querySelector('.delete-p').textContent = data.content;
         article.querySelector('.tag-element').innerText = data.tag;

         // Update bookmark markup
         const bookmarkMarkups = [];
         const dropdownItemsNodes = document.querySelectorAll('.dropdown-item');
         dropdownItemsNodes.forEach((el) => bookmarkMarkups.push(el));

         let theBookmark;
         if (bookmarkMarkups) {
            [theBookmark] = bookmarkMarkups.filter(
               (item) =>
                  item.querySelector('.bookmark-h2').textContent.trim() ===
                  thisObject.articleH2
            );

            if (theBookmark) {
               theBookmark.querySelector('.bookmark-h2').textContent =
                  data.title;
               theBookmark.querySelector('.bookmark-h3').textContent =
                  data.description;
               theBookmark.querySelector('.bookmark-image').src = data.imageURL;
            }
         }

         thisObject.styleFirstLetter();
         thisObject.data = data;
         handlerData();

         // Close modal
         const editModal = document.getElementById('edit-modal');
         editModal.classList.add('hide');
         thisObject.timeoutExit();
      });
   }

   showEditModal(handlerData, articleObjects) {
      window.addEventListener('click', (e) => {
         const thisObject = this;

         if (e.target.closest('#edit-btn')) {
            const editBtn = e.target.closest('#edit-btn');
            const article = editBtn.closest('.article-element');

            const [articleObject] = articleObjects.filter(
               (item) =>
                  item.title === article.querySelector('.article-h2').innerText
            );

            const articleData = {
               title: articleObject.title,
               description: articleObject.description,
               tag: articleObject.tag,
               imageURL: articleObject.imageURL,
               content: articleObject.content,
            };

            thisObject.articleH2 = articleData.title;
            this.showModal(articleData);

            // Show current tag
            const selectEl = document.getElementById('tag');
            const optionsHTML = selectEl.getElementsByTagName('option');
            const options = Array.from(optionsHTML);

            const [filteredOption] = options.filter(
               (option) => option.value === articleData.tag
            );

            const sortTagMenu = document.getElementById('edit-tag');

            sortTagMenu.value = filteredOption?.value;
            articleData.tag = sortTagMenu.value;

            // Submit form and exit modal
            this.submitForm(article, handlerData);
            this.exitEditModal();
         }
      });
   }

   showModal(data) {
      document.body.insertAdjacentHTML(
         'afterbegin',
         this.#generateEditModal(data)
      );
   }

   #generateEditModal(data) {
      return `
        <section
            id="edit-modal"
            class="fixed top-0 left-0 z-40 flex justify-center w-full h-full pt-62 xl:pt-8 2xl:pt-8 lg:pt-4 md:pt-20 sm:pt-0 backdrop-blur-xl bg-[#61636760]"
            style="transition: 0.4s"
        >
            <form
                id="edit-content"
                class="relative flex flex-col w-1/2 gap-4 p-8 pb-10 bg-gray-100 sm:gap-4 2xl:w-2/3 2xl:p-6 xl:p-10 lg:p-6 md:w-5/6 md:py-10 sm:px-4 sm:py-8 sm:pb-8 h-min sm:h-screen dark:bg-gray-900 sm:w-full"
            >
                <span
                    id="exit-edit-btn"
                    class="absolute h-20 text-5xl text-gray-500 transition opacity-75 cursor-pointer top-4 right-5 hover:text-gray-600 2xl:top-2 2xl:right-3 sm:text-4xl sm:top-1 sm:right-1"
                    ><ion-icon name="close-outline"></ion-icon
                ></span>

                <!-- Heading -->
                <div class="flex flex-col gap-4">
                    <h2
                        class="text-6xl text-center bg-gray-600 2xl:text-5xl lg:text-5xl sm:text-4xl dark:text-gray-500 dark:bg-gray-200"
                        style="
                            background-clip: text;
                            -webkit-text-fill-color: transparent;
                        "
                    >
                        Edit Article
                    </h2>
                </div>

                <!-- Input fields -->
                <div
                     class="flex flex-col gap-8 mb-2 text-sm tracking-wider uppercase font-medium sm:gap-4 xl:gap-6 md:gap-8 text-gray-400 sm:mb-[-1px]"
                >
                    <div class="flex flex-col gap-2 sm:gap-[0.1rem]">
                        <span>Title</span>
                        <input
                            type="text"
                            name="title"
                            required
                            id="title"
                            class="text-[1.6rem] sm:text-xl text-gray-600 dark:text-gray-300 rounded-md input-element bg-gray-100 dark:bg-gray-900 outline-shadow"
                            value="${data.title}"
                        />
                        <div
                            class="w-full mt-[-5px] h-[1px] sm:mt-[-0.9px] bg-gray-300 dark:bg-gray-700"
                        ></div>
                    </div>

                    <div class="flex flex-col gap-2 sm:gap-[0.1rem]">
                        <span>Description</span>
                        <input
                            type="text"
                            name="description"
                            required
                            id="description"
                            class="text-[1.6rem] sm:text-xl text-gray-600 dark:text-gray-300 rounded-md input-element bg-gray-100 dark:bg-gray-900 outline-shadow"
                            value="${data.description}"
                        />
                        <div
                            class="w-full mt-[-5px] h-[1px] sm:mt-[-0.9px] bg-gray-300 dark:bg-gray-700"
                        ></div>
                    </div>

                    <div class="grid items-center gap-20 two-columns sm:grid-cols-2 sm:gap-4">
                        <div class="flex flex-col gap-2 sm:gap-[0.1rem]">
                            <span>Image (insert URL)</span>
                            <input
                                type="text"
                                name="imageURL"
                                required
                                id="image"
                                class="text-[1.6rem] sm:text-xl text-gray-600 dark:text-gray-300 rounded-md input-element bg-gray-100 dark:bg-gray-900 outline-shadow"
                                value="${data.imageURL}"
                            />
                            <div
                                class="w-full mt-[-5px] h-[1px] sm:mt-[-0.9px] bg-gray-300 dark:bg-gray-700"
                            ></div>
                        </div>

                        <div
                            class="flex flex-col gap-1 py-2 pl-4 pr-3 rounded-full"
                            >
                                <label
                                    class="text-gray-400 sm:text-base"
                                    for="tag"
                                    >Category</label
                                >
                                <select
                                    class="pb-[0.2rem] pl-3 rounded-full rounded-tl-none text-2xl w-3/4 shadow-sm dark:shadow-none cursor-pointer sm:w-full sm:text-xl input-element bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 outline-shadow"
                                    id="edit-tag"
                                >
                                    <option value="#History">History</option>
                                    <option value="#Politics">Politics</option>
                                    <option value="#Cooking">Cooking</option>
                                    <option value="#Health">Health</option>
                                    <option value="#Sport">Sport</option>
                                    <option value="#Gaming">Gaming</option>
                                    <option value="#Movies">Movies</option>
                                    <option value="#Fitness">Fitness</option>
                                    <option value="#Religion">Religion</option>
                                    <option value="#IT">IT</option>
                                    <option value="#Other">Other</option>
                                </select>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2 sm:gap-[0.1rem]">
                        <span>Content</span>
                        <textarea
                            name="content"
                            id="content"
                            required
                            class="h-48 text-[1.6rem] sm:text-xl leading-8 sm:h-[27.4vh] text-gray-600 dark:text-gray-300 rounded-md input-element bg-gray-100 dark:bg-gray-900 outline-shadow"
                        >
${data.content}</textarea
                        >
                        <div
                            class="w-full mt-[-5px] h-[1px] sm:mt-[-0.9px] bg-gray-300 dark:bg-gray-700"
                        ></div>
                    </div>
                </div>

                <!-- Buttons -->
                 <div
                        class="flex items-center justify-center gap-4 mt-8 text-3xl 2xl:mt-4 lg:mt-0 md:mt-8 sm:mb-2 sm:mt-2"
                    >
                        <div
                            class="text-gray-600 transition duration-75 rounded-md bg-gray-50 hover:text-gray-500 hover:bg-gray-200"
                        >
                            <button
                                style="border-color: #b5a382"
                                class="px-10 py-4 text-5xl transition border-2 rounded-md sm:text-4xl dark:bg-gray-700 dark:text-gray-50 dark:hover:bg-gray-600 outline-shadow"
                            >
                                Update
                            </button>
                        </div>
                    </div>
            </form>
        </section>
        `;
   }

   exitEditModal() {
      const thisObject = this;
      const exitModalBtn = document.getElementById('exit-edit-btn');
      const form = document.getElementById('edit-content');
      const editModal = document.getElementById('edit-modal');

      // When ESC is pressed
      window.onkeydown = (e) => {
         if (e.key === 'Escape') {
            editModal.classList.add('hide');
            this.timeoutExit();
         }
      };

      // When clicking outside
      editModal?.addEventListener('click', function () {
         editModal.classList.add('hide');
         thisObject.timeoutExit();
      });

      form?.addEventListener('click', (e) => e.stopPropagation());

      exitModalBtn?.addEventListener('click', function () {
         const editModal = document.getElementById('edit-modal');
         editModal.classList.add('hide');
         thisObject.timeoutExit();
      });
   }

   timeoutExit() {
      setTimeout(() => {
         const editModal = document.getElementById('edit-modal');
         editModal?.remove();
      }, 400);
   }
}

export default new EditView();
