export default class Card {

    drag(){
        const elements = document.getElementsByClassName('card');
        const cards = Array.from(elements);
        console.log(cards)

        cards.forEach(card => {

            // отслеживаем нажатие
            card.onmousedown = function(e) {

                //готовим к перемещению
                // разместить на том же месте, но в абс координатах
                card.style.position = 'absolute';
                moveAt(e);

                document.body.appendChild(card);

                //над другими элементами
                card.style.zIndex = 1000;

                // передвинуть мяч под коорд курсора
                function moveAt(e) {
                    card.style.left = e.pageX - card.offsetWidth / 2 + 'px';
                    card.style.top = e.pageY - card.offsetHeight / 2 + 'px';
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
}