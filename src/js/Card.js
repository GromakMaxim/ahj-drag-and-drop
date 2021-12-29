import {mouseOut, mouseOver} from "./MouseHandler.js";
import {getCenter, getCoords} from "./CoordinatesService";

export default class Card {

    constructor() {
        Card.calculateIds();
        this.cards = Array.from(document.getElementsByClassName('card'));
        this.setDragToAllCards();
        this.mouseOverAllCards();
        this.mouseOutAllCards();
        this.setDeleteButtons();
    }

    static setDragAndDropToCard(card) {
        Card.dragCard(card);
        mouseOut(card);
        mouseOver(card);
    }

    static calculateIds() {
        const columns = Array.from(document.getElementsByClassName('column'));
        for (let i = 0; i < columns.length; i++) {
            const cardsInColumn = columns[i].getElementsByClassName('card');

            for (let j = 0; j < cardsInColumn.length; j++) {
                cardsInColumn[j].id = i + "-" + j;
            }
        }
    }

    static dragCard(card) {
        const titleDnd = card.getElementsByClassName('card-title')[0];
        // отслеживаем нажатие
        titleDnd.onmousedown = function (e) {
            let shiftX = e.pageX - getCoords(card).left;
            let shiftY = e.pageY - getCoords(card).top;

            //готовим к перемещению
            // разместить на том же месте, но в абс координатах
            card.style.position = 'absolute';
            moveAt(e);

            //над другими элементами
            card.style.zIndex = '1_000';

            // передвинуть мяч под коорд курсора
            function moveAt(e) {
                card.style.left = e.pageX - shiftX + 'px';
                card.style.top = e.pageY - shiftY + 'px';
            }

            // перемещение на экране
            document.onmousemove = async function (e) {
                moveAt(e);

                await Card.cleanUp();

                await Card.findClosest(card);
            }

            // окончание переноса
            titleDnd.onmouseup = async function () {
                document.onmousemove = null;
                titleDnd.onmouseup = null;

                let allCards = Array.from(document.getElementsByClassName('card'));
                allCards.forEach((item) => {
                    Card.offBorders(item);
                });

                // сначала ищем колонку для вставки
                const columnToInsert = document.getElementsByClassName('insert-inside')[0];

                if (columnToInsert !== null && columnToInsert !== undefined) {
                    columnToInsert.getElementsByClassName('title')[0].after(card);
                    card.style.position = "";
                    columnToInsert.classList.remove('insert-inside');
                    // Card.cleanUp();
                } else {
                    allCards.forEach((item) => {
                        if (item.classList.contains('insert-before')) {
                            item.before(card);
                        } else if (item.classList.contains('insert-after')) {
                            item.after(card);
                        }
                        item.style.position = "";
                        // Card.cleanUp();
                    })
                }
                await Card.calculateIds();

            }

            card.ondragstart = function () {
                return false;
            };
        }
    }

    static async findClosest(card) {
        const center = getCenter(card);
        const cards = Array.from(document.getElementsByClassName('card'));
        const allColumns = Array.from(document.getElementsByClassName('column'));
        const emptyColumns = allColumns.filter((column) => column.children.length === 2);

        await Card.cleanUp();
        let insertInColumn = false;

        for (let i = 0; i < emptyColumns.length; i++) {
            const curCoords = emptyColumns[i].getBoundingClientRect();
            const showEmpty = document.getElementById('empty-col');
            showEmpty.textContent = JSON.stringify(curCoords);

            if (center.x >= curCoords.left && center.x <= curCoords.right) {
                if (center.y <= curCoords.bottom && center.y >= curCoords.top) {
                    emptyColumns[i].classList.add('insert-inside');
                    insertInColumn = true;
                }
            }
        }

        if (!insertInColumn) {
            const showCoords = document.getElementById('curcoords');
            const showNumber = document.getElementById('closest-card-number');
            const showClosestCoords = document.getElementById('closest-card-coords');

            // ищем ближайшую
            let index;

            let diff = 99_999;

            for (let i = 0; i < cards.length; i++) {
                if (cards[i].id !== card.id) {
                    cards[i].getBoundingClientRect();
                    const curCardCenter = getCenter(cards[i]);

                    if (Math.abs(Math.abs(center.x - curCardCenter.x) - Math.abs(center.y - curCardCenter.y)) <= diff) {

                        diff = Math.abs(Math.abs(center.x - curCardCenter.x) - Math.abs(center.y - curCardCenter.y));
                        index = i;
                    }
                }
            }

            showCoords.textContent = JSON.stringify(center);
            showNumber.textContent = index;
            showClosestCoords.textContent = JSON.stringify(cards[index].getBoundingClientRect());

            const closestCardCenter = getCenter(cards[index]);

            if (center.y <= closestCardCenter.y && center.y <= closestCardCenter.y) {
                cards[index].classList.add('insert-before');
                Card.onBorders(cards[index], card.getBoundingClientRect().height, "top");
            } else if (center.y >= closestCardCenter.y && center.y >= closestCardCenter.y) {
                cards[index].classList.add('insert-after');
                Card.onBorders(cards[index], card.getBoundingClientRect().height, "bot");
            }

        }
    }

    static offBorders(block) {
        block.style.borderTopWidth = "";
        block.style.borderTopStyle = "";
        block.style.borderTopColor = "";

        block.style.borderBottomWidth = "";
        block.style.borderBottomStyle = "";
        block.style.borderBottomColor = "";
    }

    static onBorders(block, px, side) {
        if (side === 'top') {
            block.style.borderTopWidth = px + "px"; /* Толщина линии внизу */
            block.style.borderTopStyle = 'solid';
            block.style.borderTopColor = 'grey';
        } else if (side === 'bot') {
            block.style.borderBottomWidth = px + "px"; /* Толщина линии внизу */
            block.style.borderBottomStyle = 'solid';
            block.style.borderBottomColor = 'grey';
        } else {
            throw new Error('idn what to do!')
        }
    }

    static cleanUp() {
        const cards = Array.from(document.getElementsByClassName('card'));
        cards.forEach((item) => {
            item.classList.remove('insert-after');
            item.classList.remove('insert-before');
            item.style.zIndex = "";
            Card.offBorders(item);
        })

        const columns = Array.from(document.getElementsByClassName('column'));
        columns.forEach((col) => {
            col.classList.remove('insert-inside');
        });
    }

    static setDelete(btn) {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            btn.parentElement.parentElement.remove();
        });
    }

    setDragToAllCards() {
        this.cards.forEach(card => {
            Card.dragCard(card);
        });
    }

    mouseOverAllCards() {
        this.cards.forEach(card => {
            mouseOver(card);
        });
    }

    mouseOutAllCards() {
        this.cards.forEach(card => {
            mouseOut(card);
        });
    }

    setDeleteButtons() {
        const delBtns = Array.from(document.getElementsByClassName('delete'));
        delBtns.forEach((btn) => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                btn.parentElement.parentElement.remove();
            });
        });
    }
}
