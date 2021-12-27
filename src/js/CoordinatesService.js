export function getCenter(block) {
    const rect = block.getBoundingClientRect();
    // x — абсцисса, y — ордината центра
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
    };
}

export function getCoords(elem) {   // кроме IE8-
    let box = elem.getBoundingClientRect();
    return {
        top: box.top - 14,
        left: box.left - 14
    };
}
