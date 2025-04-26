// Old mockTranslate function with partial phrase replacement

function mockTranslate(text, sourceLanguage, targetLanguage) {
    // Simple dictionary for demonstration (expanded vocabulary)
    const englishToTamil = {
        'hello': 'வணக்கம்',
        'hi': 'வணக்கம்',
        'how are you': 'நீங்கள் எப்படி இருக்கிறீர்கள்',
        'good morning': 'காலை வணக்கம்',
        'good afternoon': 'மதிய வணக்கம்',
        'good evening': 'மாலை வணக்கம்',
        'good night': 'இரவு வணக்கம்',
        'thank you': 'நன்றி',
        'thanks': 'நன்றி',
        'yes': 'ஆம்',
        'no': 'இல்லை',
        'what is your name': 'உங்கள் பெயர் என்ன',
        'my name is': 'என் பெயர்',
        'nice to meet you': 'உங்களை சந்தித்ததில் மகிழ்ச்சி',
        'goodbye': 'பிரியாவிடை',
        'bye': 'பிரியாவிடை',
        'see you later': 'பின்னர் சந்திப்போம்',
        'how is the weather': 'வானிலை எப்படி உள்ளது',
        'i am fine': 'நான் நன்றாக இருக்கிறேன்',
        'what time is it': 'என்ன நேரம்',
        'i love you': 'நான் உன்னை காதலிக்கிறேன்',
        'please': 'தயவுசெய்து',
        'sorry': 'மன்னிக்கவும்',
        'excuse me': 'மன்னிக்கவும்',
        'help': 'உதவி',
        'food': 'உணவு',
        'water': 'தண்ணீர்',
        'today': 'இன்று',
        'tomorrow': 'நாளை',
        'yesterday': 'நேற்று',
        'friend': 'நண்பர்',
        'family': 'குடும்பம்',
        'home': 'வீடு',
        'work': 'வேலை',
        'school': 'பள்ளி',
        'book': 'புத்தகம்',
        'read': 'படி',
        'write': 'எழுது',
        'speak': 'பேசு',
        'listen': 'கேள்',
        'understand': 'புரிந்துகொள்',
        'know': 'தெரியும்',
        'don\'t know': 'தெரியாது',
        'money': 'பணம்',
        'time': 'நேரம்',
        'day': 'நாள்',
        'week': 'வாரம்',
        'month': 'மாதம்',
        'year': 'வருடம்',
        'one': 'ஒன்று',
        'two': 'இரண்டு',
        'three': 'மூன்று',
        'four': 'நான்கு',
        'five': 'ஐந்து'
    };

    const tamilToEnglish = Object.entries(englishToTamil).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {});
    
    try {
        const lowerText = text.toLowerCase();
        
        // Check if we're translating from English to Tamil
        if (sourceLanguage === 'english' && targetLanguage === 'tamil') {
            // Check for direct matches in our dictionary
            if (englishToTamil[lowerText]) {
                return englishToTamil[lowerText];
            }
            
            // Look for partial matches (for demonstration purposes)
            let translated = text;
            
            // Sort entries by length (descending) to match longer phrases first
            const sortedEntries = Object.entries(englishToTamil)
                .sort((a, b) => b[0].length - a[0].length);
            
            for (const [engPhrase, tamilPhrase] of sortedEntries) {
                const phraseRegex = new RegExp('\\b' + engPhrase + '\\b', 'gi');
                translated = translated.replace(phraseRegex, tamilPhrase);
            }
            
            // If we made any replacements, return the partially translated text
            if (translated !== text) {
                return translated;
            }
            
            // Default message when no translation is available
            return `[தமிழில்: "${text}"]`;
        }
        
        // Check if we're translating from Tamil to English
        if (sourceLanguage === 'tamil' && targetLanguage === 'english') {
            // Check for direct matches in our dictionary
            if (tamilToEnglish[text]) {
                return tamilToEnglish[text];
            }
            
            // Look for partial matches (for demonstration purposes)
            let translated = text;
            
            // Sort entries by length (descending) to match longer phrases first
            const sortedEntries = Object.entries(tamilToEnglish)
                .sort((a, b) => b[0].length - a[0].length);
            
            for (const [tamilPhrase, engPhrase] of sortedEntries) {
                if (text.includes(tamilPhrase)) {
                    translated = translated.replace(tamilPhrase, engPhrase);
                }
            }
            
            // If we made any replacements, return the partially translated text
            if (translated !== text) {
                return translated;
            }
            
            // Default message when no translation is available
            return `[In English: "${text}"]`;
        }
        
        // If languages are not recognized
        return `[Translation not available]`;
        
    } catch (error) {
        console.error('Mock translation error:', error);
        return `[Translation error]`;
    }
}

module.exports = {
    mockTranslate
};
