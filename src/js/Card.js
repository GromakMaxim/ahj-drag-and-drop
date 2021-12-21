export default class Card {
    // center = 0;

    constructor() {
        this.setIds();
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

    setIds() {
        const columns = Array.from(document.getElementsByClassName('column'));
        for (let i = 0; i < columns.length; i++) {
            const cardsInColumn = columns[i].getElementsByClassName('card');

            for (let j = 0; j < cardsInColumn.length; j++) {
                cardsInColumn[j].id = i + "-" + j;
            }
        }
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
            document.onmousemove = async function (e) {
                moveAt(e);

                await Card.cleanUp();

                await Card.findClosest(card);
            }

            // окончание переноса
            card.onmouseup = function () {
                document.onmousemove = null;
                card.onmouseup = null;

                let allCards = Array.from(document.getElementsByClassName('card'));
                allCards.forEach((item) => {
                    item.style.marginBottom = "";
                    item.style.marginTop = "";
                });

                allCards.forEach((item) => {
                    if (item.classList.contains('insert-before')) {
                        item.before(card);
                    } else if (item.classList.contains('insert-after')) {
                        item.after(card);
                    }
                    item.style.position = "";
                })
            }

            card.ondragstart = function () {
                return false;
            };
        }
    }

    static async findClosest(card) {
        const center = Card.getCenter(card);
        const cards = Array.from(document.getElementsByClassName('card'));
        await Card.cleanUp();

        const showCoords = document.getElementById('curcoords');
        const showNumber = document.getElementById('closest-card-number');
        const showClosestCoords = document.getElementById('closest-card-coords');

        // ищем ближайшую
        let index;

        let diffX = 99_999;
        let diffY = 99_999;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id !== card.id) {
                cards[i].getBoundingClientRect();
                const curCardCenter = this.getCenter(cards[i]);

                if (Math.abs(center.x - curCardCenter.x) <= diffX &&
                    Math.abs(center.y - curCardCenter.y) <= diffY) {

                    diffX = Math.abs(center.x - curCardCenter.x);
                    diffY = Math.abs(center.y - curCardCenter.y);

                    index = i;
                }
            }
        }

        console.log()
        showCoords.textContent = JSON.stringify(center);
        showNumber.textContent = index;
        showClosestCoords.textContent = JSON.stringify(cards[index].getBoundingClientRect());

        const closestCardCenter = this.getCenter(cards[index]);

        if (center.y <= closestCardCenter.y && center.y <= closestCardCenter.y) {
            cards[index].classList.add('insert-before');
            cards[index].style.marginTop = card.getBoundingClientRect().height + "px";
        } else if (center.y >= closestCardCenter.y && center.y >= closestCardCenter.y) {
            cards[index].classList.add('insert-after');
            cards[index].style.marginBottom = card.getBoundingClientRect().height + "px";
        }
    }

    static getCenter(block) {
        const rect = block.getBoundingClientRect();
        // x — абсцисса, y — ордината центра
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

    }

    static cleanUp() {
        const cards = Array.from(document.getElementsByClassName('card'));
        cards.forEach((item) => {
            item.classList.remove('insert-after');
            item.classList.remove('insert-before');
            item.style.marginBottom = "";
            item.style.marginTop = "";
        })
    }
}
