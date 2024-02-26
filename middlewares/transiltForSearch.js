export function translitForCat(text) {
    const translitRusMap = {
        'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е',
        'jo': 'ё', 'zh': 'ж', 'z': 'з', 'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о',
        'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'f': 'ф', 'h': 'х', 'c': 'ц', 'ch': 'ч', 'sh': 'ш',
        'sch': 'щ', "'": 'ъ', 'y': 'ы', 'ee': 'э', "'": 'ь', 'yu': 'ю', 'ya': 'я'
    };

    let russianText = '';
    let i = 0;
    while (i < text.length) {
        if (translitRusMap[text.substr(i, 2)]) {
            russianText += translitRusMap[text.substr(i, 2)];
            i += 2;
        } else if (translitRusMap[text.substr(i, 1)]) {
            russianText += translitRusMap[text.substr(i, 1)];
            i += 1;
        } else {
            russianText += text[i];
            i += 1;
        }
    }

    return russianText;
}