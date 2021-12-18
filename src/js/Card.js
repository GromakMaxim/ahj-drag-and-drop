export default class Card {
    // center = 0;

    constructor() {
        this.cards = Array.from(document.getElementsByClassName('card'));
        // this.columns = Array.from(document.getElementsByClassName('column'));
        this.dragAllCards();
        this.mouseOverAllCards();
        this.mouseOutAllCards();
    }

    static setDragAndDropToCard(card) {
        Card.dragCard(card);
        Card.mouseOut(card);
        Card.mouserOver(card);
    }

    dragAllCards() {
        this.cards.forEach(card => {
            Card.dragCard(card);
        });
    }

    mouseOverAllCards() {
        this.cards.forEach(card => {
            Card.mouserOver(card);
        });
    }

    static mouserOver(card) {
        card.addEventListener("mouseover", (event) => {
            event.preventDefault();
            if (card.childNodes.length > 1) {
                card.children[0].children[1].classList.remove('hidden');
            }
        });
    }

    mouseOutAllCards() {
        this.cards.forEach(card => {
            Card.mouseOut(card);
        });
    }

    static mouseOut(card) {
        card.addEventListener("mouseout", (event) => {
            event.preventDefault();

            if (card.childNodes.length > 1) {
                const cl = card.children[0].children[1];
                if (!cl.classList.contains('hidden')) {
                    cl.classList.add('hidden');
                }
            }
        });
    }

    static dragCard(card) {
        // отслеживаем нажатие
        card.onmousedown = function (e) {
            let shiftX = e.pageX - getCoords(card).left;
            let shiftY = e.pageY - getCoords(card).top;

            //готовим к перемещению
            // разместить на том же месте, но в абс координатах
            card.style.position = 'absolute';
            moveAt(e);

            let curColumn = card.parentNode;
            curColumn.appendChild(card);

            //над другими элементами
            card.style.zIndex = 1000;

            // передвинуть мяч под коорд курсора
            function moveAt(e) {
                card.style.left = e.pageX - shiftX + 'px';
                card.style.top = e.pageY - shiftY + 'px';
            }

            function getCoords(elem) {   // кроме IE8-
                let box = elem.getBoundingClientRect();
                return {
                    top: box.top - 14,
                    left: box.left - 14
                };
            }

            // перемещение на экране
            document.onmousemove = function (e) {
                moveAt(e);

                let actualCoords = card.getBoundingClientRect();
                let center = actualCoords.left + actualCoords.width / 2;

                let columns = Array.from(document.getElementsByClassName('column'));
                let col1 = columns[0].getBoundingClientRect();
                let col2 = columns[1].getBoundingClientRect();
                let col3 = columns[2].getBoundingClientRect();

                if (center >= col1.left && center <= col1.right) {
                    Card.setVerticalPosition(columns[0], card);
                } else if (center >= col2.left && center <= col2.right) {
                    Card.setVerticalPosition(columns[1], card);
                }
                if (center >= col3.left && center <= col3.right) {
                    Card.setVerticalPosition(columns[2], card);
                }

            }

            // окончание переноса
            card.onmouseup = function () {
                document.onmousemove = null;
                card.onmouseup = null;

                let actualCoords = card.getBoundingClientRect();
                let center = actualCoords.left + actualCoords.width / 2;

                let columns = Array.from(document.getElementsByClassName('column'));
                let col1 = columns[0].getBoundingClientRect();
                let col2 = columns[1].getBoundingClientRect();
                let col3 = columns[2].getBoundingClientRect();

                if (center >= col1.left && center <= col1.right) {
                    const addBtn = document.getElementsByClassName('add')[0];
                    addBtn.before(card);
                    card.style.cssText = '';
                } else if (center >= col2.left && center <= col2.right) {
                    columns[1].appendChild(card);
                    card.style.cssText = '';
                }
                if (center >= col3.left && center <= col3.right) {
                    columns[2].appendChild(card);
                    card.style.cssText = '';
                }
            }

            card.ondragstart = function () {
                return false;
            };
        }
    }

    static setVerticalPosition(column, card) {
        const cards = Array.from(column.getElementsByClassName('card'));
        if (cards.length > 1) {

            let actualCoords = card.getBoundingClientRect();
            console.log(actualCoords)
            let center = actualCoords.top + actualCoords.height / 2;

            let bot = 0;
            let top = 0;

            for (let i = 1; i < cards.length; i++) {
                console.log("----------------------")
                let currentElem = cards[i];
                console.log(currentElem)
                let prevElem = cards[i - 1];
                console.log(prevElem)

                let curCoords = currentElem.getBoundingClientRect();
                let prevCoords = prevElem.getBoundingClientRect();

                bot = curCoords.top;
                top = prevCoords.bottom;

                console.log("t: " + top)
                console.log("c: " + center)
                console.log("b: " + bot)
                console.log("----------------------")

                if (center >= (bot-10) && center <= (top+10)) {
                    console.log('worked')
                    prevElem.style.border = '20px solid black';
                    //prevElem.after(card);
                }
            }
        }
    }
}
