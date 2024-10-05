export default class View {
    form = document.getElementById('modal-content');
    publishModal = document.getElementById('modal');
    message = document.getElementById('message');

    clearMessage() {
        this.message?.classList.add('hidden');
    }

    addMessage() {
        this.message?.classList.remove('hidden');
    }

    togglePublishModal() {
        this.publishModal.classList.toggle('active');
    }

    styleFirstLetter() {
        const articlesNodeList = document.querySelectorAll('.article-element');
        const articlesArray = Array.from(articlesNodeList);

        articlesArray.forEach((article) => {
            const p = article.querySelector('.delete-p');
            const firstLetter = p.textContent.slice(0, 1);
            const otherLetters = p.textContent.substring(1);
            p.innerHTML = `<span class="text-[8rem] pr-2 text-gray-500 leading-[0.7] mt-[0.6rem] float-left sm:text-[6rem]">${firstLetter}</span>${otherLetters}`;
        });
    }
}
