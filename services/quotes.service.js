import Quotes from '../models/Quotes.js';

export async function getQuote(id) {
    const quote = await Quotes.findOne({
        where: { id },
        attributes: ['quote', 'author']  
    });

    return quote;
}
