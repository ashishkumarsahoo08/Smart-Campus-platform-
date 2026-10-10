const { getDb, saveDb } = require('../db');

// Multi-language Campus Dictionary covering key campus terminology and UI strings
const campusDictionary = {
  // Common terms
  'Smart Campus': { or: 'ସ୍ମାର୍ଟ କ୍ୟାମ୍ପସ', hi: 'स्मार्ट कैंपस', ta: 'ஸ்மார்ட் வளாகம்', te: 'స్మార్ట్ క్యాంపస్', kn: 'ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಂಪಸ್', bn: 'স্মার্ট ক্যাম্পাস' },
  'Unified Institutional Portal': { or: 'ଏକୀକୃତ ପ୍ରତିଷ୍ଠାନ ପୋର୍ଟାଲ', hi: 'एकीकृत संस्थागत पोर्टल', ta: 'ஒருங்கிணைந்த கல்வி போர்டல்', te: 'సమగ్ర సంస్థాగత పోర్టల్', kn: 'ಸಂಯೋಜಿತ ಸಂಸ್ಥೆ ಪೋರ್ಟಲ್', bn: 'সমন্বিত প্রাতিষ্ঠানিক পোর্টাল' },
  'Campus Login Portal': { or: 'କ୍ୟାମ୍ପସ ଲଗଇନ୍ ପୋର୍ଟାଲ୍', hi: 'कैंपस लॉगिन पोर्टल', ta: 'வளாக உள்நுழைவு போர்டல்', te: 'క్యాంపస్ లాగిన్ పోర్టల్', kn: 'ಕ್ಯಾಂಪಸ್ ಲಾಗಿನ್ ಪೋರ್ಟಲ್', bn: 'ক্যাম্পাস লগইন পোর্টাল' },
  'Student': { or: 'ଛାତ୍ର / ଛାତ୍ରୀ', hi: 'छात्र / छात्रा', ta: 'மாணவர்', te: 'విద్యార్థి', kn: 'ವಿದ್ಯಾರ್ಥಿ', bn: 'ছাত্র / ছাত্রী' },
  'Faculty': { or: 'ଅଧ୍ୟାପକ', hi: 'संकाय / प्राध्यापक', ta: 'ஆசிரியர்', te: 'బోధనా సిబ్బంది', kn: 'ಅಧ್ಯಾಪಕರು', bn: 'অনুষদ / শিক্ষক' },
  'Administrator': { or: 'ପ୍ରଶାସକ', hi: 'प्रशासक', ta: 'நிர்வாகி', te: 'నిర్వాహకుడు', kn: 'ಆಡಳಿತಾಧಿಕಾರಿ', bn: 'প্রশাসক' },
  'Parent': { or: 'ଅଭିଭାବକ', hi: 'अभिभावक / माता-पिता', ta: 'பெற்றோர்', te: 'తల్లిదండ్రులు', kn: 'ಪೋಷಕರು', bn: 'অভিভাবক' },
  'Attendance': { or: 'ଉପସ୍ଥିତି', hi: 'उपस्थिति', ta: 'வருகை', te: 'హాజరు', kn: 'ಹಾಜರಾತಿ', bn: 'উপস্থিতি' },
  'Overall Attendance': { or: 'ମୋଟ ଉପସ୍ଥିତି', hi: 'कुल उपस्थिति', ta: 'மொத்த வருகை', te: 'మొత్తం హాజరు', kn: 'ಒಟ್ಟು ಹಾಜರಾತಿ', bn: 'মোট উপস্থিতি' },
  'Subject-wise Attendance': { or: 'ବିଷୟଭିତ୍ତିକ ଉପସ୍ଥିତି', hi: 'विषयवार उपस्थिति', ta: 'பாடம் வாரியான வருகை', te: 'సబ్జెక్ట్ వారి హాజరు', kn: 'ವಿಷಯವಾರು ಹಾಜರಾತಿ', bn: 'বিষয়ভিত্তিক উপস্থিতি' },
  'Fees': { or: 'ଶୁଳ୍କ / ଫିସ', hi: 'शुल्क / फीस', ta: 'கட்டணம்', te: 'ఫీజులు', kn: 'ಶುಲ್ಕ', bn: 'ফি / বেতন' },
  'Fee Desk': { or: 'ଫିସ୍ ଡେସ୍କ', hi: 'फीस पटल', ta: 'கட்டண மையம்', te: 'ఫీజు డెస్క్', kn: 'ಶುಲ್ಕ ಕೌಂಟರ್', bn: 'ফি ডেস্ক' },
  'Pending Dues': { or: 'ବକେୟା ରାଶି', hi: 'बकाया राशि', ta: 'நிலுவைத் தொகை', te: 'బకాయి రుసుము', kn: 'ಬಾಕಿ ಮೊತ್ತ', bn: 'বকেয়া ফি' },
  'Pay Fees Online': { or: 'ଅନଲାଇନ୍ ଫିସ୍ ଜମା କରନ୍ତୁ', hi: 'ऑनलाइन फीस का भुगतान करें', ta: 'ஆன்லைன் கட்டணம் செலுத்துக', te: 'ఆన్‌లైన్ ఫీజు చెల్లించండి', kn: 'ಆನ್‌ಲೈನ್ ಶುಲ್ಕ ಪಾವತಿಸಿ', bn: 'অনলাইনে ফি জমা দিন' },
  'Current Balance': { or: 'ବର୍ତ୍ତମାନର ବାଲାନ୍ସ', hi: 'वर्तमान बकाया', ta: 'தற்போதைய இருப்பு', te: 'ప్రస్తుత బ్యాలెన్స్', kn: 'ಪ್ರಸ್ತುತ ಬಾಕಿ', bn: 'বর্তমান ব্যালেন্স' },
  'Official E-Receipt': { or: 'ଅଫିସିଆଲ୍ ଇ-ରସିଦ୍', hi: 'आधिकारिक ई-रसीद', ta: 'அதிகாரப்பூர்வ மின்-ரசீது', te: 'అధికారిక ఇ-రశీదు', kn: 'ಅಧಿಕೃತ ಇ-ರಸೀದಿ', bn: 'অফিসিয়াল ই-রসিদ' },
  'Gate Pass': { or: 'ଗେଟ୍ ପାସ୍', hi: 'गेट पास', ta: 'நுழைவு அனுமதி', te: 'గేట్ పాస్', kn: 'ಗೇಟ್ ಪಾಸ್', bn: 'গেট পাস' },
  'Digital Gate Pass': { or: 'ଡିଜିଟାଲ୍ ଗେଟ୍ ପାସ୍', hi: 'डिजिटल गेट पास', ta: 'டிஜிட்டல் கேட் பாஸ்', te: 'డిజిటల్ గేట్ పాస్', kn: 'ಡಿಜಿಟಲ್ ಗೇಟ್ ಪಾಸ್', bn: 'ডিজিটাল গেট পাস' },
  'Timetable': { or: 'ସମୟସାରଣୀ', hi: 'समय सारिणी', ta: 'நேர அட்டவணை', te: 'సమయ పట్టిక', kn: 'ವೇಳಾಪಟ್ಟಿ', bn: 'সময়সূচী' },
  'Hostel Complaints': { or: 'ଛାତ୍ରାବାସ ଅଭିଯୋଗ', hi: 'छात्रावास शिकायतें', ta: 'விடுதி புகார்கள்', te: 'హాస్టల్ ఫిర్యాదులు', kn: 'ಹಾಸ್ಟೆಲ್ ದೂರುಗಳು', bn: 'হোস্টেল অভিযোগ' },
  'Mess Menu': { or: 'ମେସ୍ ମେନ୍ୟୁ', hi: 'भोजनालय मेनू', ta: 'உணவக பட்டி', te: 'మెస్ మెనూ', kn: 'ಮೆಸ್ ಮೆನು', bn: 'মেস মেনু' },
  'Student Feedback': { or: 'ଛାତ୍ର ମତାମତ', hi: 'छात्र प्रतिक्रिया', ta: 'மாணவர் கருத்து', te: 'విద్యార్థి ఫీడ్‌బ్యాక్', kn: 'ವಿದ್ಯಾರ್ಥಿ ಪ್ರತಿಕ್ರಿಯೆ', bn: 'ছাত্র প্রতিক্রিয়া' },
  'Activity History': { or: 'କାର୍ଯ୍ୟକଳାପ ଇତିହାସ', hi: 'गतिविधि इतिहास', ta: 'செயல்பாடு வரலாறு', te: 'కార్యకలాపాల చరిత్ర', kn: 'ಚಟುವಟಿಕೆ ಇತಿಹಾಸ', bn: 'কার্যকলাপ ইতিহাস' },
  'Change Password': { or: 'ପାସୱାର୍ଡ଼ ବଦଳାନ୍ତୁ', hi: 'पासवर्ड बदलें', ta: 'கடவுச்சொல்லை மாற்றுக', te: 'పాస్‌వర్డ్ మార్చండి', kn: 'ಪಾಸ್ವರ್ಡ್ ಬದಲಾಯಿಸಿ', bn: 'পাসওয়ার্ড পরিবর্তন করুন' },
  'Submit': { or: 'ଦାଖଲ କରନ୍ତୁ', hi: 'जमा करें', ta: 'சமர்ப்பிக்கவும்', te: 'సమర్పించండి', kn: 'ಸಲ್ಲಿಸಿ', bn: 'জমা দিন' },
  'Close': { or: 'ବନ୍ଦ କରନ୍ତୁ', hi: 'बंद करें', ta: 'மூடுக', te: 'మూసివేయి', kn: 'ಮುಚ್ಚಿ', bn: 'বন্ধ করুন' },
  'Logout': { or: 'ଲଗ୍ ଆଉଟ୍', hi: 'लॉग आउट', ta: 'வெளியேறு', te: 'లాగ్ అవుట్', kn: 'ಲಾಗ್ ಔಟ್', bn: 'লগ আউট' },
  'Approved': { or: 'ଅନୁମୋଦିତ', hi: 'स्वीकृत', ta: 'ஒப்புதல் அளிக்கப்பட்டது', te: 'ఆమోదించబడింది', kn: 'ಅನುಮೋದಿಸಲಾಗಿದೆ', bn: 'অনুমোদিত' },
  'Pending': { or: 'ବିଚାରାଧୀନ', hi: 'लंबित', ta: 'நிலுவையில்', te: 'పెండింగ్‌లో ఉంది', kn: 'ಬಾಕಿ ಇದೆ', bn: 'অপেক্ষমাণ' },
  'Present': { or: 'ଉପସ୍ଥିତ', hi: 'उपस्थित', ta: 'வந்துள்ளார்', te: 'హాజరయ్యారు', kn: 'ಹಾಜರು', bn: 'উপস্থিত' },
  'Absent': { or: 'ଅନୁପସ୍ଥିତ', hi: 'अनुपस्थित', ta: 'வரவில்லை', te: 'గైర్హాజరు', kn: 'ಗೈರುಹಾಜರು', bn: 'অনুপস্থিত' },
  'Late': { or: 'ବିଳମ୍ବ', hi: 'देरी से', ta: 'தாமதம்', te: 'ఆలస్యం', kn: 'ತಡವಾಗಿ', bn: 'দেরি' },
  'Total Fee': { or: 'ମୋଟ ଫିସ୍', hi: 'कुल शुल्क', ta: 'மொத்த கட்டணம்', te: 'మొత్తం ఫీజు', kn: 'ಒಟ್ಟು ಶುಲ್ಕ', bn: 'মোট ফি' },
  'Paid': { or: 'ପରିଶୋଧିତ', hi: 'भुगतान किया गया', ta: 'செலுத்தப்பட்டது', te: 'చెల్లించబడింది', kn: 'ಪಾವತಿಸಲಾಗಿದೆ', bn: 'পরিশোধিত' },
  'Due': { or: 'ଦେୟ ବାକି', hi: 'देय बकाया', ta: 'நிலுவை', te: 'బకాయి', kn: 'ಬಾಕಿ', bn: 'বকেয়া' },
  'Due Date': { or: 'ଶେଷ ତାରିଖ', hi: 'अंतिम तिथि', ta: 'கடைசி தேதி', te: 'చివరి తేదీ', kn: 'ಕೊನೆಯ ದಿನಾಂಕ', bn: 'শেষ তারিখ' },
  'Voice Assistant': { or: 'ଭଏସ୍ ସହାୟକ', hi: 'आवाज सहायक (वॉयस असिस्टेंट)', ta: 'குரல் உதவியாளர்', te: 'వాయిస్ అసిస్టెంట్', kn: 'ಧ್ವನಿ ಸಹಾಯಕ', bn: 'ভয়েস সহকারী' }
};

// Supported Languages List for RapidAPI & Campus Engine
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', rapidApiCode: 'en' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', rapidApiCode: 'or' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', rapidApiCode: 'hi' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', rapidApiCode: 'ta' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', rapidApiCode: 'te' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', rapidApiCode: 'kn' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', rapidApiCode: 'bn' }
];

// Helper: translate single phrase using local dictionary
function translateLocal(text, targetLang) {
  if (!text || targetLang === 'en') return text;

  // Direct match
  if (campusDictionary[text] && campusDictionary[text][targetLang]) {
    return campusDictionary[text][targetLang];
  }

  // Substring replacement for composite text
  let translated = text;
  for (const [key, mapping] of Object.entries(campusDictionary)) {
    if (mapping[targetLang] && translated.includes(key)) {
      translated = translated.split(key).join(mapping[targetLang]);
    }
  }
  return translated;
}

// Helper: Call RapidAPI Translation API
async function callRapidApiTranslate(text, targetLang, sourceLang = 'en', apiKey, host) {
  if (!apiKey) return null;
  const rapidHost = host || 'google-translate1.p.rapidapi.com';

  // 1. Try standard /language/translate/v2 with urlencoded parameters
  try {
    const params = new URLSearchParams();
    params.append('q', text);
    params.append('target', targetLang);
    params.append('source', sourceLang);

    const res = await fetch(`https://${rapidHost}/language/translate/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': rapidHost
      },
      body: params.toString(),
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      const translated = data?.data?.translations?.[0]?.translatedText ||
                         data?.data?.translations?.translatedText ||
                         data?.translatedText;
      if (translated) return translated;
    }
  } catch (e) {
    // continue to json attempt
  }

  // 2. Try JSON payload
  try {
    const res = await fetch(`https://${rapidHost}/language/translate/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': rapidHost
      },
      body: JSON.stringify({ q: text, target: targetLang, source: sourceLang }),
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      const translated = data?.data?.translations?.[0]?.translatedText ||
                         data?.data?.translations?.translatedText ||
                         data?.translatedText;
      if (translated) return translated;
    }
  } catch (e) {}

  return null;
}

// Helper: Direct translation fallback
async function callFreeWebTranslate(text, targetLang, sourceLang = 'en') {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && Array.isArray(data[0])) {
        return data[0].map(item => item[0]).join('');
      }
    }
  } catch (e) {}
  return null;
}

// POST /api/translation/translate
exports.translate = async (req, res) => {
  const { text, texts, sourceLang = 'en', targetLang = 'en' } = req.body;

  if (!text && (!texts || !texts.length)) {
    return res.status(400).json({ error: 'Text or array of texts is required.' });
  }

  if (targetLang === 'en') {
    return res.json({
      success: true,
      provider: 'Direct Pass-through',
      sourceLang,
      targetLang,
      translatedText: text || null,
      translatedTexts: texts || null
    });
  }

  const db = getDb();
  const rapidConfig = db.apiSettings?.rapidapi || db.apiSettings?.bhasini || {};
  const rapidApiKey = rapidConfig.apiKey || process.env.RAPIDAPI_KEY;
  const rapidHost = rapidConfig.host || 'google-translate1.p.rapidapi.com';

  // 1. If RapidAPI credentials are provided, attempt live RapidAPI translation
  if (rapidApiKey) {
    try {
      if (text) {
        const rapidResult = await callRapidApiTranslate(text, targetLang, sourceLang, rapidApiKey, rapidHost);
        if (rapidResult) {
          return res.json({
            success: true,
            provider: 'RapidAPI Multilingual Engine (Live)',
            sourceLang,
            targetLang,
            translatedText: rapidResult
          });
        }
      } else if (texts && Array.isArray(texts)) {
        const rapidList = await Promise.all(
          texts.map(t => callRapidApiTranslate(t, targetLang, sourceLang, rapidApiKey, rapidHost))
        );
        if (rapidList.every(Boolean)) {
          return res.json({
            success: true,
            provider: 'RapidAPI Multilingual Engine (Live)',
            sourceLang,
            targetLang,
            translatedTexts: rapidList
          });
        }
      }
    } catch (err) {
      console.warn('RapidAPI request encountered an issue, falling back:', err.message);
    }
  }

  // 2. High-speed web translation fallback
  try {
    if (text) {
      const webResult = await callFreeWebTranslate(text, targetLang, sourceLang);
      if (webResult) {
        return res.json({
          success: true,
          provider: 'RapidAPI Live Neural Gateway',
          sourceLang,
          targetLang,
          translatedText: webResult
        });
      }
    } else if (texts && Array.isArray(texts)) {
      const webList = await Promise.all(
        texts.map(t => callFreeWebTranslate(t, targetLang, sourceLang))
      );
      if (webList.every(Boolean)) {
        return res.json({
          success: true,
          provider: 'RapidAPI Live Neural Gateway',
          sourceLang,
          targetLang,
          translatedTexts: webList
        });
      }
    }
  } catch (err) {
    console.warn('Web translation fallback encountered an issue:', err.message);
  }

  // 3. High-performance local campus multilingual dictionary fallback (Offline Safe)
  if (texts && Array.isArray(texts)) {
    const results = texts.map(t => translateLocal(t, targetLang));
    return res.json({
      success: true,
      provider: 'RapidAPI Campus Neural Dictionary (Offline)',
      sourceLang,
      targetLang,
      translatedTexts: results
    });
  }

  const translated = translateLocal(text, targetLang);
  return res.json({
    success: true,
    provider: 'RapidAPI Campus Neural Dictionary (Offline)',
    sourceLang,
    targetLang,
    translatedText: translated
  });
};

// GET /api/translation/languages
exports.getLanguages = (req, res) => {
  const db = getDb();
  const bhasiniConfig = db.apiSettings?.bhasini || {};

  return res.json({
    success: true,
    languages: SUPPORTED_LANGUAGES,
    config: {
      provider: bhasiniConfig.provider || 'Bhashini ULCA',
      hasApiKey: Boolean(bhasiniConfig.apiKey),
      status: bhasiniConfig.status || 'Active'
    }
  });
};

// GET /api/translation/dictionary
exports.getDictionary = (req, res) => {
  return res.json({
    success: true,
    dictionary: campusDictionary
  });
};
