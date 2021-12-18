export default class AddingCardWindow {

    constructor() {
        this.showWindow();
        this.add();
    }


    showWindow() {
        let dialog = document.getElementById('card-addition');
        document.getElementById('show').onclick = function () {
            dialog.show();
        };
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
            card.textContent = textarea.value;

            const like = document.createElement('div');
            like.className = "like";

            const del = document.createElement('div');
            del.classList.add('delete');
            del.classList.add('hidden');

            const comment = document.createElement('div');
            comment.className = "comment";

            const buttons = document.createElement('div');
            buttons.className = 'buttons';
            buttons.append(like);
            buttons.append(del);
            buttons.append(comment);

            card.append(buttons);

            const addBtn = document.getElementsByClassName('add')[0];
            addBtn.before(card);
        })
    }
}
