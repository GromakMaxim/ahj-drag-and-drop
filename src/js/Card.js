export default class Card {
    center = 0;

    constructor() {
        this.cards = Array.from(document.getElementsByClassName('card'));
        this.columns = Array.from(document.getElementsByClassName('column'));
        this.drag();
        this.mouseOver();
        this.mouseOut();
    }

    async drag() {
        this.cards.forEach(card => {

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
                    this.center = actualCoords.left + actualCoords.width / 2;
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

                        document.cre
                        columns[0].a

                        console.log('1 column');
                    } else if (center >= col2.left && center <= col2.right) {
                        columns[1].appendChild(card);
                        card.style.cssText = '';
                    }
                    if (center >= col3.left && center <= col3.right) {
                        columns[2].appendChild(card);
                        card.style.cssText = '';

                        console.log('3 column');
                    }


                }

                card.ondragstart = function () {
                    return false;
                };
            }
        });
    }

    mouseOver() {
        this.cards.forEach(card => {
            card.addEventListener("mouseover", (event) => {
                event.preventDefault();
                if (card.childNodes.length > 1) {
                    card.children[0].children[1].classList.remove('hidden');
                }
            });
        });
    }

    mouseOut() {
        this.cards.forEach(card => {
            card.addEventListener("mouseout", (event) => {
                event.preventDefault();

                if (card.childNodes.length > 1) {
                    const cl = card.children[0].children[1];
                    if (!cl.classList.contains('hidden')) {
                        cl.classList.add('hidden');
                    }
                }
            });
        });
    }
}
