export function cleanMessage(str) {
    return str.toLowerCase().replace(/[^\w\s\/\-]/g, '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}