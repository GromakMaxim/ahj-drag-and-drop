export function mouseOver(card) {
    card.addEventListener("mouseover", (event) => {
        event.preventDefault();
        if (card.childNodes.length > 1) {
            card.children[1].children[1].classList.remove('hidden');
        }
    });
}

export function mouseOut(card) {
    card.addEventListener("mouseout", (event) => {
        event.preventDefault();

        if (card.childNodes.length > 1) {
            const cl = card.children[1].children[1];
            if (!cl.classList.contains('hidden')) {
                cl.classList.add('hidden');
            }
        }
    });
}
