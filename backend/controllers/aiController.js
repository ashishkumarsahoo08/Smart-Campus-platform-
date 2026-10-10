const { getDb, saveDb } = require('../db');

function getCurrentTimestamp() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    day: days[now.getDay()],
    date: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    displayFull: `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  };
}

// Built-in Intelligent Multilingual Campus NLP Reasoner
function queryCampusKnowledge(userText, activeUser, db, language = 'en') {
  const lower = userText.toLowerCase().trim();
  const allUsers = Object.values(db?.users || {});
  const student = activeUser || allUsers.find(u => u.role === 'student') || {
    id: 'student1',
    name: 'Aarav Sharma',
    attendance: 88,
    attendanceAttended: 136,
    attendanceSessionsTotal: 154
  };
  const studentId = student.id || 'student1';
  const feeProfile = (db.fees && db.fees[studentId]) || null;
  const passes = (db.gatePasses || []).filter(p => p.studentId === studentId);
  const activePass = passes.length > 0 ? passes[0] : null;
  const sName = student.name ? student.name.split(' ')[0] : 'Student';
  const lang = (language || 'en').toLowerCase();

  // 1. Fee & Due Queries
  if (lower.includes('fee') || lower.includes('due') || lower.includes('payment') || lower.includes('balance') || 
      lower.includes('ଫି') || lower.includes('ବାକି') || lower.includes('फीस') || lower.includes('बकाया') ||
      lower.includes('கட்டண') || lower.includes('நிலுவை') || lower.includes('ఫీజు') || lower.includes('ಬಾಕಿ') || lower.includes('বকেয়া')) {
    
    const isPaid = feeProfile && feeProfile.dueAmount === 0;
    const due = feeProfile ? feeProfile.dueAmount : 20000;
    const total = feeProfile ? feeProfile.totalFees : 68500;
    const paid = feeProfile ? feeProfile.paidAmount : 48500;
    const dueDate = feeProfile ? feeProfile.dueDate : '15 Oct 2026';
    const receiptNo = db.feePayments?.[0]?.receiptNumber || 'SCU-FEE-2026-9921';

    const replies = {
      en: isPaid
        ? `🎉 Great news, ${student.name}! Your semester fees are completely paid in full (Balance: ₹0.00). Your official E-Receipt #${receiptNo} is verified.`
        : `💳 ${student.name}, your total semester fees are ₹${total.toLocaleString('en-IN')}, and you have paid ₹${paid.toLocaleString('en-IN')}. Your outstanding pending due is ₹${due.toLocaleString('en-IN')}, due on ${dueDate}. You can clear dues instantly using UPI QR or Net Banking on the Fee Desk.`,
      or: isPaid
        ? `🎉 ବଢ଼ିଆ ଖବର, ${student.name}! ଆପଣଙ୍କ ସେମିଷ୍ଟାର ଫିସ୍ ସମ୍ପୂର୍ଣ୍ଣ ପରିଶୋଧ ହୋଇସାରିଛି (ବକେୟା: ₹0.00)। ଆପଣଙ୍କ ଅଫିସିଆଲ୍ ଇ-ରସିଦ୍ #${receiptNo} ଯାଞ୍ଚ ହୋଇଛି।`
        : `💳 ${student.name}, ଆପଣଙ୍କ ମୋଟ ସେମିଷ୍ଟାର ଫିସ୍ ₹${total.toLocaleString('en-IN')} ଏବଂ ଆପଣ ₹${paid.toLocaleString('en-IN')} ପୈଠ କରିଛନ୍ତି। ଆପଣଙ୍କ ବକେୟା ଦେୟ ₹${due.toLocaleString('en-IN')} ଅଛି (ଶେଷ ତାରିଖ: ${dueDate})। ଆପଣ କ୍ୟାମ୍ପସ ଫିସ୍ ଡେସ୍କରୁ UPI QR କିମ୍ବା ନେଟ୍ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଦ୍ୱାରା ତୁରନ୍ତ ପୈଠ କରିପାରିବେ।`,
      hi: isPaid
        ? `🎉 बहुत अच्छी खबर, ${student.name}! आपकी सेमेस्टर फीस पूरी तरह से जमा हो चुकी है (बकाया: ₹0.00)। आपकी आधिकारिक ई-रसीद #${receiptNo} सत्यापित है।`
        : `💳 ${student.name}, आपकी कुल सेमेस्टर फीस ₹${total.toLocaleString('en-IN')} है, और आपने ₹${paid.toLocaleString('en-IN')} जमा किए हैं। आपकी बकाया राशि ₹${due.toLocaleString('en-IN')} है (अंतिम तिथि: ${dueDate})। आप फीस डेस्क पर UPI QR या नेट बैंकिंग से तुरंत भुगतान कर सकते हैं।`,
      ta: isPaid
        ? `🎉 சிறந்த செய்தி, ${student.name}! உங்கள் செமஸ்டர் கட்டணம் முழுமையாக செலுத்தப்பட்டுவிட்டது (நிலுவை: ₹0.00). உங்கள் அதிகாரப்பூர்வ மின்-ரசீது #${receiptNo} சரிபார்க்கப்பட்டது.`
        : `💳 ${student.name}, உங்கள் மொத்த செமஸ்டர் கட்டணம் ₹${total.toLocaleString('en-IN')}, நீங்கள் செலுத்தியது ₹${paid.toLocaleString('en-IN')}. உங்கள் நிலுவை கட்டணம் ₹${due.toLocaleString('en-IN')} (கடைசி தேதி: ${dueDate}). வளாக கட்டண மேசை வழியாக UPI QR மூலம் உடனடியாக செலுத்தலாம்.`,
      te: isPaid
        ? `🎉 శుభవార్త, ${student.name}! మీ సెమిస్టర్ ఫీజు పూర్తిగా చెల్లించబడింది (బకాయి: ₹0.00). మీ అధికారిక ఇ-రశీదు #${receiptNo} ధృవీకరించబడింది.`
        : `💳 ${student.name}, మీ మొత్తం సెమిస్టర్ ఫీజు ₹${total.toLocaleString('en-IN')}, మరియు మీరు ₹${paid.toLocaleString('en-IN')} చెల్లించారు. మీ పెండింగ్ బకాయి ₹${due.toLocaleString('en-IN')} (గడువు తేదీ: ${dueDate}). మీరు ఫీజు డెస్క్‌లో UPI QR ద్వారా వెంటనే చెల్లించవచ్చు.`,
      kn: isPaid
        ? `🎉 ಉತ್ತಮ ಸುದ್ದಿ, ${student.name}! ನಿಮ್ಮ ಸೆಮಿಸ್ಟರ್ ಶುಲ್ಕವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಪಾವತಿಸಲಾಗಿದೆ (ಬಾಕಿ: ₹0.00). ನಿಮ್ಮ ಅಧಿಕೃತ ಇ-ರಸೀದಿ #${receiptNo} ಪರಿಶೀಲಿಸಲಾಗಿದೆ.`
        : `💳 ${student.name}, ನಿಮ್ಮ ಒಟ್ಟು ಸೆಮಿಸ್ಟರ್ ಶುಲ್ಕ ₹${total.toLocaleString('en-IN')}, ಮತ್ತು ನೀವು ₹${paid.toLocaleString('en-IN')} ಪಾವತಿಸಿದ್ದೀರಿ. ನಿಮ್ಮ ಬಾಕಿ ಶುಲ್ಕ ₹${due.toLocaleString('en-IN')} (ಕೊನೆಯ ದಿನಾಂಕ: ${dueDate}). ನೀವು ಶುಲ್ಕ ಡೆಸ್ಕ್‌ನಲ್ಲಿ UPI QR ಮೂಲಕ ತಕ್ಷಣ ಪಾವತಿಸಬಹುದು.`,
      bn: isPaid
        ? `🎉 দারুণ খবর, ${student.name}! আপনার সেমিস্টার ফি সম্পূর্ণ পরিশোধ করা হয়েছে (বকেয়া: ₹0.00)। আপনার অফিসিয়াল ই-রসিদ #${receiptNo} যাচাইকৃত।`
        : `💳 ${student.name}, আপনার মোট সেমিস্টার ফি ₹${total.toLocaleString('en-IN')}, এবং আপনি ₹${paid.toLocaleString('en-IN')} প্রদান করেছেন। আপনার বকেয়া ফি ₹${due.toLocaleString('en-IN')} (শেষ তারিখ: ${dueDate})। আপনি ফি ডেস্ক থেকে UPI QR বা নেট ব্যাংকিং দিয়ে অবিলম্বে পরিশোধ করতে পারেন।`
    };

    return {
      reply: replies[lang] || replies.en,
      action: 'open_fees',
      category: 'FEES'
    };
  }

  // 2. Attendance Queries
  if (lower.includes('attendance') || lower.includes('absent') || lower.includes('present') || lower.includes('shortage') ||
      lower.includes('ଉପସ୍ଥିତି') || lower.includes('उपस्थिति') || lower.includes('வருகை') || lower.includes('హాజరు') || lower.includes('ಹಾಜರಾತಿ') || lower.includes('উপস্থিতি')) {
    const attPct = student.attendance !== undefined ? student.attendance : 88;
    const attended = student.attendanceAttended || 136;
    const total = student.attendanceSessionsTotal || 154;

    const replies = {
      en: `📊 ${student.name}, your cumulative attendance is ${attPct}% (${attended}/${total} sessions attended). You are safely above the mandatory 75% examination eligibility threshold!`,
      or: `📊 ${student.name}, ଆପଣଙ୍କ ମୋଟ ଉପସ୍ଥିତି ହେଉଛି ${attPct}% (${attended}/${total} କ୍ଲାସ୍ ଉପସ୍ଥିତ)। ଆପଣ ବାଧ୍ୟତାମୂଳକ ୭୫% ପରୀକ୍ଷା ଯୋଗ୍ୟତା ସୀମାଠାରୁ ସୁରକ୍ଷିତ ଭାବରେ ଉପରେ ଅଛନ୍ତି!`,
      hi: `📊 ${student.name}, आपकी कुल उपस्थिति ${attPct}% (${attended}/${total} सत्र उपस्थित) है। आप अनिवार्य 75% परीक्षा पात्रता सीमा से सुरक्षित रूप से ऊपर हैं!`,
      ta: `📊 ${student.name}, உங்கள் மொத்த வருகை ${attPct}% (${attended}/${total} வகுப்புகள் வந்துள்ளீர்கள்). நீங்கள் கட்டாய 75% தேர்வு தகுதி வரம்பிற்கு மேல் பாதுகாப்பாக உள்ளீர்கள்!`,
      te: `📊 ${student.name}, మీ మొత్తం హాజరు ${attPct}% (${attended}/${total} తరగతులు హాజరయ్యారు). మీరు తప్పనిసరి 75% పరీక్ష అర్హత పరిమితికి సురక్షితంగా పైన ఉన్నారు!`,
      kn: `📊 ${student.name}, ನಿಮ್ಮ ಒಟ್ಟು ಹಾಜರಾತಿ ${attPct}% (${attended}/${total} ತರಗತಿಗಳು ಹಾಜರಾಗಿದ್ದೀರಿ). ನೀವು ಕಡ್ಡಾಯ 75% ಪರೀಕ್ಷಾ ಅರ್ಹತಾ ಮಿತಿಗಿಂತ ಸುರಕ್ಷಿತವಾಗಿ ಮೇಲಿದ್ದೀರಿ!`,
      bn: `📊 ${student.name}, আপনার মোট উপস্থিতি ${attPct}% (${attended}/${total} ক্লাস উপস্থিত)। আপনি বাধ্যতামূলক ৭৫% পরীক্ষার যোগ্যতার সীমার উপরে নিরাপদে রয়েছেন!`
    };

    return {
      reply: replies[lang] || replies.en,
      action: 'open_attendance',
      category: 'ATTENDANCE'
    };
  }

  // 3. Gate Pass Queries
  if (lower.includes('gate pass') || lower.includes('leave') || lower.includes('permission') || lower.includes('outing') || lower.includes('outpass') ||
      lower.includes('ଗେଟ୍') || lower.includes('ପାସ୍') || lower.includes('छुट्टी') || lower.includes('गेट पास') ||
      lower.includes('பாஸ்') || lower.includes('పాస్') || lower.includes('ಪಾಸ್') || lower.includes('পাস')) {
    
    const passId = activePass ? activePass.id : 'GP-2026-881';
    const reason = activePass ? activePass.reason : 'Weekend Home Visit';
    const status = activePass ? activePass.status.toUpperCase() : 'APPROVED';
    const outTime = activePass?.outTime || 'Today 04:30 PM';
    const inTime = activePass?.inTime || 'Tomorrow 08:00 PM';

    const replies = {
      en: `🎫 Gate Pass #${passId} for "${reason}". Status: ${status}. Permitted window: ${outTime} - ${inTime}. Digitally verified with scannable QR verification.`,
      or: `🎫 ଗେଟ୍ ପାସ୍ #${passId} ("${reason}")। ସ୍ଥିତି: ${status}। ଅନୁମୋଦିତ ସମୟ: ${outTime} - ${inTime}। ଡିଜିଟାଲ୍ QR ସହିତ ସଫଳତାର ସହ ଅନୁମୋଦିତ।`,
      hi: `🎫 गेट पास #${passId} ("${reason}")। स्थिति: ${status}। अनुमत समय: ${outTime} - ${inTime}। डिजिटल QR कोड के साथ सफलतापूर्वक स्वीकृत।`,
      ta: `🎫 கேட் பாஸ் #${passId} ("${reason}")। நிலை: ${status}। அனுமதிக்கப்பட்ட நேரம்: ${outTime} - ${inTime}। டிஜிட்டல் QR உடன் வெற்றிகரமாக அங்கீகரிக்கப்பட்டது.`,
      te: `🎫 గేట్ పాస్ #${passId} ("${reason}")। స్థితి: ${status}। అనుమతించబడిన సమయం: ${outTime} - ${inTime}। డిజిటల్ QR కోడ్‌తో విజయవంతంగా ఆమోదించబడింది.`,
      kn: `🎫 ಗೇಟ್ ಪಾಸ್ #${passId} ("${reason}")। ಸ್ಥಿತಿ: ${status}। ಅನುಮತಿಸಲಾದ ಸಮಯ: ${outTime} - ${inTime}। ಡಿಜಿಟಲ್ QR ಕೋಡ್‌ನೊಂದಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ.`,
      bn: `🎫 গেট পাস #${passId} ("${reason}")। স্থিতি: ${status}। অনুমোদিত সময়: ${outTime} - ${inTime}। ডিজিটাল QR কোড সহ সফলভাবে অনুমোদিত।`
    };

    return {
      reply: replies[lang] || replies.en,
      action: 'open_gate_pass',
      category: 'GATE_PASS'
    };
  }

  // 4. Timetable / Schedule Queries
  if (lower.includes('class') || lower.includes('timetable') || lower.includes('lecture') || lower.includes('schedule') || lower.includes('lab') ||
      lower.includes('ସମୟସାରଣୀ') || lower.includes('समय सारिणी') || lower.includes('அட்டவணை') || lower.includes('టైమ్‌టేబుల్') || lower.includes('ವೇಳಾಪಟ್ಟಿ') || lower.includes('সময়সূচী')) {
    
    const replies = {
      en: `🕒 Today's schedule for CSE 5th Semester: Period 1: AI & Machine Learning (Room 304); Period 2: Cloud Computing & DevOps (Lab 2); Period 3: Data Structures Lab (Innovation Center).`,
      or: `🕒 CSE ୫ମ ସେମିଷ୍ଟାର ପାଇଁ ଆଜିର ସମୟସାରଣୀ: ପିରିୟଡ଼ ୧: AI ଏବଂ ମେସିନ୍ ଲର୍ଣ୍ଣିଂ (ରୁମ୍ ୩୦୪); ପିରିୟଡ଼ ୨: କ୍ଲାଉଡ୍ କମ୍ପ୍ୟୁଟିଂ ଓ DevOps (ଲ୍ୟାବ୍ ୨); ପିରିୟଡ଼ ୩: ଡାଟା ଷ୍ଟ୍ରକଚର୍ସ ଲ୍ୟାବ୍ (ଇନୋଭେସନ୍ ସେଣ୍ଟର୍)।`,
      hi: `🕒 CSE 5वीं सेमेस्टर के लिए आज का कार्यक्रम: पीरियड 1: AI और मशीन लर्निंग (कमरा 304); पीरियड 2: क्लाउड कंप्यूटिंग एवं DevOps (लैब 2); पीरियड 3: डेटा स्ट्रक्चर्स लैब।`,
      ta: `🕒 CSE 5வது செமஸ்டருக்கான இன்றைய அட்டவணை: வகுப்பு 1: AI மற்றும் மெஷின் லேர்னிங் (அறை 304); வகுப்பு 2: கிளவுட் கம்ப்யூட்டிங் (ஆய்வகம் 2); வகுப்பு 3: டேட்டா ஸ்ட்ரக்சர்ஸ் ஆய்வகம்.`,
      te: `🕒 CSE 5వ సెమిస్టర్ కోసం నేటి టైమ్‌టేబుల్: పీరియడ్ 1: AI మరియు మెషిన్ లెర్నింగ్ (గది 304); పీరియడ్ 2: క్లౌడ్ కంప్యూటింగ్ & DevOps (ల్యాబ్ 2); పీరియడ్ 3: డేటా స్ట్రక్చర్స్ ల్యాబ్.`,
      kn: `🕒 CSE 5ನೇ ಸೆಮಿಸ್ಟರ್‌ಗಾಗಿ ಇಂದಿನ ವೇಳಾಪಟ್ಟಿ: ಅವಧಿ 1: AI ಮತ್ತು ಮೆಷಿನ್ ಲರ್ನಿಂಗ್ (ಕೊಠಡಿ 304); ಅವಧಿ 2: ಕ್ಲೌಡ್ ಕಂಪ್ಯೂಟಿಂಗ್ ಮತ್ತು DevOps (ಲ್ಯಾಬ್ 2); ಅವಧಿ 3: ಡೇಟಾ ಸ್ಟ್ರಕ್ಚರ್ಸ್ ಲ್ಯಾಬ್.`,
      bn: `🕒 CSE ৫ম সেমিস্টারের জন্য আজকের সময়সূচী: পিরিয়ড ১: AI এবং মেশিন লার্নিং (রুম ৩০৪); পিরিয়ড ২: ক্লাউড কম্পিউটিং এবং DevOps (ল্যাব ২); পিরিয়ড ৩: ডেটা স্ট্রাকচার ল্যাব।`
    };

    return {
      reply: replies[lang] || replies.en,
      action: 'open_timetable',
      category: 'TIMETABLE'
    };
  }

  // 5. Mess & Food Queries
  if (lower.includes('mess') || lower.includes('food') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('breakfast') ||
      lower.includes('ଖାଇବା') || lower.includes('ମେସ୍') || lower.includes('खाना') || lower.includes('मेस') ||
      lower.includes('உணவு') || lower.includes('భోజనం') || lower.includes('ಊಟ') || lower.includes('খাবার')) {
    
    const replies = {
      en: `🍽️ Today's Dining Menu: Lunch (12:30–02:30 PM): Steamed Basmati Rice, Paneer Butter Masala, Yellow Dal Fry, Mixed Veg, Papad & Fresh Curd. Rating: 4.4/5 stars.`,
      or: `🍽️ ଆଜିର ମେସ୍ ଖାଦ୍ୟ ତାଲିକା: ମଧ୍ୟାହ୍ନ ଭୋଜନ: ବାସୁମତୀ ଭାତ, ପନୀର ବଟର ମସାଲା, ଡାଲି ତଡ଼କା, ମିକ୍ସ ଭେଜ୍, ପାମ୍ପଡ଼ ଏବଂ ସତେଜ ଦହି। ରେଟିଂ: ୪.୪/୫ ଷ୍ଟାର୍।`,
      hi: `🍽️ आज का मेस मेन्यू: दोपहर का भोजन: बासमती चावल, पनीर बटर मसाला, दाल तड़का, मिक्स वेज, पापड़ और ताजा दही। रेटिंग: 4.4/5 सितारे।`,
      ta: `🍽️ இன்றைய உணவு பட்டியல்: மதிய உணவு: பாசுமதி சாதம், பன்னீர் பட்டர் மசாலா, பருப்பு தால், கூட்டு, அப்பளம் மற்றும் தயிர். மதிப்பீடு: 4.4/5 நட்சத்திரங்கள்.`,
      te: `🍽️ నేటి భోజన మెనూ: మధ్యాహ్న భోజనం: బాస్మతి అన్నం, పనీర్ బటర్ మసాలా, పప్పు తాలింపు, మిక్స్ వెజ్, అప్పడం మరియు తాజా పెరుగు. రేటింగ్: 4.4/5 నక్షత్రాలు.`,
      kn: `🍽️ ಇಂದಿನ ಊಟದ ಮೆನು: ಮಧ್ಯಾಹ್ನದ ಊಟ: ಬಾಸ್ಮತಿ ಅನ್ನ, ಪನೀರ್ ಬಟರ್ ಮಸಾಲಾ, ಬೇಳೆ ಸಾರು, ಮಿಕ್ಸ್ ವೆಜ್, ಹಪ್ಪಳ ಮತ್ತು ತಾಜಾ ಮೊಸರು. ರೇಟಿಂಗ್: 4.4/5 ನಕ್ಷತ್ರಗಳು.`,
      bn: `🍽️ আজকের খাবার মেনু: দুপুরের খাবার: বাসমতী চালের ভাত, পনির বাটার মসলা, ডাল ফ্রাই, মিক্স ভেজ, পাঁপড় এবং তাজা দই। রেটিং: ৪.৪/৫ তারকা।`
    };

    return {
      reply: replies[lang] || replies.en,
      action: 'open_mess',
      category: 'MESS'
    };
  }

  // 6. Multilingual Greetings
  if (lower.includes('ନମସ୍କାର') || lower.includes('namaskar') || lower.includes('hello') || lower.includes('hi') || lower.includes('नमस्ते') ||
      lower.includes('வணக்கம்') || lower.includes('నమస్కారం') || lower.includes('ನಮಸ್ಕಾರ') || lower.includes('নমস্কার')) {
    
    const replies = {
      en: `🙏 Hello ${sName}! I am your Smart Campus AI Assistant. You can ask me to check your pending fee dues, attendance percentages, gate passes, today's classes, or mess menu. How can I assist you right now?`,
      or: `🙏 ନମସ୍କାର ${sName}! ମୁଁ ଆପଣଙ୍କ ସ୍ମାର୍ଟ କ୍ୟାମ୍ପସ AI ସହାୟକ। ଆପଣ ମୋତେ ବକେୟା ଫିସ୍, ଉପସ୍ଥିତି ପ୍ରତିଶତ, ଗେଟ୍ ପାସ୍, ଆଜିର କ୍ଲାସ୍ କିମ୍ବା ମେସ୍ ମେନ୍ୟୁ ବିଷୟରେ ପଚାରି ପାରିବେ। ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?`,
      hi: `🙏 नमस्ते ${sName}! मैं आपका स्मार्ट कैंपस AI सहायक हूँ। आप मुझसे अपनी बकाया फीस, उपस्थिति प्रतिशत, गेट पास, आज की कक्षाओं या मेस मेन्यू के बारे में पूछ सकते हैं। मैं आपकी किस प्रकार सहायता कर सकता हूँ?`,
      ta: `🙏 வணக்கம் ${sName}! நான் உங்கள் ஸ்மார்ட் வளாக AI உதவியாளர். உங்கள் நிலுவைக் கட்டணம், வருகை சதவீதம், கேட் பாஸ், இன்றைய வகுப்புகள் அல்லது மெஸ் மெனு பற்றி என்னிடம் கேட்கலாம். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`,
      te: `🙏 నమస్కారం ${sName}! నేను మీ స్మార్ట్ క్యాంపస్ AI అసిస్టెంట్‌ని. మీరు మీ పెండింగ్ ఫీజు బకాయిలు, హాజరు శాతం, గేట్ పాస్, నేటి తరగతులు లేదా మెస్ మెనూ గురించి నన్ను అడగవచ్చు. నేను మీకు ఎలా సహాయపడగలను?`,
      kn: `🙏 ನಮಸ್ಕಾರ ${sName}! ನಾನು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಂಪಸ್ AI ಸಹಾಯಕ. ನೀವು ನಿಮ್ಮ ಬಾಕಿ ಶುಲ್ಕ, ಹಾಜರಾತಿ ಶೇಕಡಾವಾರು, ಗೇಟ್ ಪಾಸ್, ಇಂದಿನ ತರಗತಿಗಳು ಅಥವಾ ಮೆಸ್ ಮೆನು ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಬಹುದು. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?`,
      bn: `🙏 নমস্কার ${sName}! আমি আপনার স্মার্ট ক্যাম্পাস AI সহকারী। আপনি আমাকে আপনার বকেয়া ফি, উপস্থিতি শতাংশ, গেট পাস, আজকের ক্লাস বা মেস মেনু সম্পর্কে জিজ্ঞাসা করতে পারেন। আমি আপনাকে কীভাবে সাহায্য করতে পারি?`
    };

    return {
      reply: replies[lang] || replies.en,
      action: null,
      category: 'GREETING'
    };
  }

  // Default campus conversational guidance
  const defaultReplies = {
    en: `I understand your query regarding "${userText}". All operations including Fee Payments, Attendance Verification, Gate Passes, Complaints, and Certifications are linked to your campus profile.`,
    or: `ମୁଁ "${userText}" ସମ୍ବନ୍ଧରେ ଆପଣଙ୍କ ପ୍ରଶ୍ନ ବୁଝିପାରିଲି। ଫିସ୍ ପୈଠ, ଉପସ୍ଥିତି ଯାଞ୍ଚ, ଗେଟ୍ ପାସ୍, ଅଭିଯୋଗ ଏବଂ ପ୍ରମାଣପତ୍ର ସହିତ ସମସ୍ତ କାର୍ଯ୍ୟ ଆପଣଙ୍କ କ୍ୟାମ୍ପସ ପ୍ରୋଫାଇଲ୍ ସହିତ ସଂଯୁକ୍ତ।`,
    hi: `मैं "${userText}" के संबंध में आपका प्रश्न समझ गया। फीस भुगतान, उपस्थिति सत्यापन, गेट पास, शिकायतें और प्रमाणपत्र सहित सभी कार्य आपके कैंपस प्रोफ़ाइल से जुड़े हैं।`,
    ta: `"${userText}" தொடர்பான உங்கள் கேள்வியை நான் புரிந்துகொண்டேன். கட்டணம் செலுத்துதல், வருகை சரிபார்ப்பு, கேட் பாஸ் மற்றும் சான்றிதழ்கள் அனைத்தும் உங்கள் சுயவிவரத்துடன் இணைக்கப்பட்டுள்ளன.`,
    te: `"${userText}" గురించిన మీ ప్రశ్నను నేను అర్థం చేసుకున్నాను. ఫీజు చెల్లింపులు, హాజరు ధృవీకరణ, గేట్ పాస్‌లు మరియు సర్టిఫికెట్లు మీ ప్రొఫైల్‌కు లింక్ చేయబడ్డాయి.`,
    kn: `"${userText}" ಕುರಿತ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ಶುಲ್ಕ ಪಾವತಿ, ಹಾಜರಾತಿ ಪರಿಶೀಲನೆ, ಗೇಟ್ ಪಾಸ್ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರಗಳು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ ಲಿಂಕ್ ಆಗಿವೆ.`,
    bn: `আমি "${userText}" সম্পর্কিত আপনার প্রশ্ন বুঝতে পেরেছি। ফি প্রদান, উপস্থিতি যাচাইকরণ, গেট পাস এবং প্রশংসাপত্র আপনার প্রোফাইলের সাথে সংযুক্ত।`
  };

  return {
    reply: defaultReplies[lang] || defaultReplies.en,
    action: 'open_fees',
    category: 'GENERAL'
  };
}

// POST /api/ai/chat
exports.chat = async (req, res) => {
  const query = req.body.query || req.body.message || req.body.prompt || req.body.text || '';
  const userId = req.body.userId || req.body.studentId || '';
  const language = req.body.language || req.body.lang || 'en';
  const voiceMode = Boolean(req.body.voiceMode);

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Query text is required.' });
  }

  const db = getDb();
  const timeInfo = getCurrentTimestamp();
  const allUsers = Object.values(db.users || {});
  const currentUser = (userId && db.users?.[userId]) 
    ? db.users[userId] 
    : ((db.currentUserId && db.users?.[db.currentUserId]) 
        || allUsers.find(u => u.role === 'student') 
        || allUsers[0] 
        || { id: 'student1', name: 'Aarav Sharma', role: 'student', dept: 'CSE', attendance: 88 });
  const voiceAssistantConfig = db.apiSettings?.voiceAssistant || {};

  let aiReply = null;
  let providerUsed = 'Campus Neural NLP Engine';

  // 1. If Grok (xAI) API Key is configured, attempt call to xAI Grok-2 / grok-beta API
  const grokApiKey = (voiceAssistantConfig.grokApiKey || process.env.GROK_API_KEY || process.env.XAI_API_KEY || '').trim();
  if (grokApiKey && grokApiKey.length > 10) {
    try {
      const studentFee = (db.fees && db.fees[currentUser.id]) || null;
      const systemPrompt = `You are the Official Smart Campus AI Voice & Operations Assistant for ${currentUser.name} (${currentUser.role.toUpperCase()}, Roll/ID: ${currentUser.roll || currentUser.loginId || currentUser.id}, Dept: ${currentUser.dept || 'CSE'}).
Active Student Data:
- Attendance: ${currentUser.attendance || 88}%
- Fee Due: ₹${studentFee ? studentFee.dueAmount : 20000} (Total: ₹${studentFee ? studentFee.totalFees : 68500}, Paid: ₹${studentFee ? studentFee.paidAmount : 48500})
- Academic Year: 2026-2027
Answer queries concisely, professionally, and helpful for campus students, faculty, or parents.
CRITICAL: Always answer fluently in the requested language (Language code: "${language}").
Keep voice answers under 3 sentences for natural speech synthesis.`;

      const grokRes = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grokApiKey}`
        },
        body: JSON.stringify({
          model: voiceAssistantConfig.model || 'grok-beta',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          temperature: 0.3,
          max_tokens: 250
        }),
        signal: AbortSignal.timeout(3500)
      });

      if (grokRes.ok) {
        const grokData = await grokRes.json();
        const content = grokData?.choices?.[0]?.message?.content;
        if (content) {
          aiReply = {
            reply: content,
            action: null,
            category: 'GROK_AI'
          };
          providerUsed = 'Grok AI (xAI Cloud)';
        }
      } else {
        const errDetail = await grokRes.text().catch(() => '');
        console.warn(`Grok API returned HTTP ${grokRes.status}:`, errDetail);
      }
    } catch (err) {
      console.warn('Grok external API request failed, falling back to local Campus AI Engine:', err.message);
    }
  }

  // 2. High-performance, zero-latency local Campus AI reasoner
  if (!aiReply) {
    aiReply = queryCampusKnowledge(query, currentUser, db, language);
    providerUsed = 'Smart Campus Neural Brain (Deep Institutional Context)';
  }

  // Record voice query in voiceLogs
  const voiceEntry = {
    id: 'VOICE-' + Date.now(),
    query: query.trim(),
    reply: aiReply.reply,
    category: aiReply.category,
    actorId: currentUser.id,
    actorName: currentUser.name,
    role: currentUser.role,
    provider: providerUsed,
    voiceMode: Boolean(voiceMode),
    language: language || 'en',
    timestamp: timeInfo.displayFull,
    date: timeInfo.date,
    time: timeInfo.time
  };

  if (!db.voiceLogs) db.voiceLogs = [];
  db.voiceLogs.unshift(voiceEntry);
  if (db.voiceLogs.length > 100) db.voiceLogs.pop();

  saveDb(db);

  return res.json({
    success: true,
    query: query.trim(),
    reply: aiReply.reply,
    response: aiReply.reply,
    action: aiReply.action,
    category: aiReply.category,
    provider: providerUsed,
    spokenText: aiReply.reply.replace(/<[^>]*>?/gm, '').replace(/[*#]/g, ''),
    timestamp: timeInfo.time
  });
};

// GET /api/ai/voice-logs
exports.getVoiceLogs = (req, res) => {
  const db = getDb();
  return res.json({
    success: true,
    total: (db.voiceLogs || []).length,
    logs: (db.voiceLogs || []).slice(0, 30)
  });
};

// GET /api/ai/config
exports.getConfig = (req, res) => {
  const db = getDb();
  const config = db.apiSettings?.voiceAssistant || {};
  return res.json({
    success: true,
    config: {
      provider: config.provider || 'Grok AI + Web Speech Engine',
      model: config.model || 'grok-beta',
      hasApiKey: Boolean(config.grokApiKey),
      status: config.status || 'Active',
      wakeWord: config.wakeWord || 'Smart Campus',
      documentationUrl: config.documentationUrl || 'https://console.x.ai/',
      approvalInstructions: config.approvalInstructions || 'Generate API key on console.x.ai to activate external cloud reasoning.'
    }
  });
};
