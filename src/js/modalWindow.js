import Card from "./Card";

export default class AddingCardWindow {

    constructor() {
        this.showWindow();
        this.add();
    }


    showWindow() {
        let dialog = document.getElementById('card-addition');
        const addBtns = Array.from(document.getElementsByClassName('add'));
        addBtns.forEach((btn) => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                btn.id = 'new-card-insert-here';
                dialog.show();
            });
        })

        document.getElementById('exit').onclick = function () {
            dialog.close();
        };
    }

    add() {
        const addBtn = document.getElementById('confirm-add-new-card');
        addBtn.addEventListener('click', (event) => {
            event.preventDefault();

            const textarea = document.getElementsByClassName('new-card-content')[0];

            const card = document.createElement('div');
            card.className = "card";

            const title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = textarea.value;
            card.append(title);

            const like = document.createElement('div');
            like.className = "like";

            const del = document.createElement('div');
            del.classList.add('delete');
            del.classList.add('hidden');
            Card.setDelete(del);

            const comment = document.createElement('div');
            comment.className = "comment";

            const buttons = document.createElement('div');
            buttons.className = 'buttons';
            buttons.append(like);
            buttons.append(del);
            buttons.append(comment);

            card.append(buttons);

            const target = document.getElementById('new-card-insert-here');
            target.before(card);
            target.id = '';

            Card.setDragAndDropToCard(card);

            textarea.value = "";

            let dialog = document.getElementById('card-addition');
            dialog.close();
            Card.calculateIds();
        })
    }
}
