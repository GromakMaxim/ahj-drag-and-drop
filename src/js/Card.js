export default class Card {

    constructor() {
        this.cards = Array.from(document.getElementsByClassName('card'));
        this.drag();
        this.mouseOver();
        this.mouseOut();
    }

    drag(){
        this.cards.forEach(card => {

            // отслеживаем нажатие
            card.onmousedown = function(e) {
                    
                let shiftX = e.pageX - getCoords(card).left;
                // console.log(shiftX)
                let shiftY = e.pageY - getCoords(card).top;

                //готовим к перемещению
                // разместить на том же месте, но в абс координатах
                card.style.position = 'absolute';
                moveAt(e);

                let curColumn = card.parentNode;
                console.log(curColumn)
                curColumn.appendChild(card);

                //над другими элементами
                card.style.zIndex = 1000;

                // передвинуть мяч под коорд курсора
                function moveAt(e) {
                    card.style.left = e.pageX  - shiftX + 'px';
                    card.style.top = e.pageY  - shiftY + 'px';
                }

                function getCoords(elem) {   // кроме IE8-
                    let box = elem.getBoundingClientRect();
                    return {
                        top: box.top - 14,
                        left: box.left - 14
                    };
                }
                
                // перемещение на экране
                document.onmousemove = function(e) {
                    moveAt(e);
                }

                // окончание переноса
                card.onmouseup = function() {
                    document.onmousemove = null;
                    card.onmouseup = null;
                }

                card.ondragstart = function() {
                    return false;
                };
            }
        });
    }

    mouseOver() {
        this.cards.forEach(card => {
            card.addEventListener("mouseover", (event)=> {
                event.preventDefault();
                if (card.childNodes.length > 1){
                    card.children[0].children[1].classList.remove('hidden');
                }
            });
        });
    }

    mouseOut() {
        this.cards.forEach(card => {
            card.addEventListener("mouseout", (event)=> {
                event.preventDefault();
                
                if (card.childNodes.length > 1){
                    const cl = card.children[0].children[1];
                    if (!cl.classList.contains('hidden')) {
                        cl.classList.add('hidden');
                    }
                }
            });
        });
    }
}