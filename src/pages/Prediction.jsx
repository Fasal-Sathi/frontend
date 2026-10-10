import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowDown, ArrowUp, BadgeIndianRupee, BarChart3, CheckCircle2, Droplets, Loader2, MapPin, ShieldCheck, Sparkles, Sprout, Wheat } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { api } from "../utils/api";

const initial = {
  crop: "WHEAT", state: "Madhya Pradesh", soil_type: "VERTIC SOILS", acres: 3,
  mode: "COST_OPTIMIZATION", farmer_input_seed_kg: 150, urea_kg_ha: 180,
  dap_kg_ha: 25, mop_kg_ha: 10, soil_moisture_pct: 26, irrigated_area_ha: 0
};
const states = ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
const crops = ["WHEAT", "RICE", "MAIZE", "SOYBEAN", "COTTON", "CHICKPEA", "MUSTARD", "PULSES"];
const soilTypes = ["VERTIC SOILS", "ALLUVIAL SOILS", "BLACK SOILS", "RED SOILS", "SANDY SOILS", "LOAMY SOILS", "LATERITIC SOILS"];
const pageCopy = {
  en: { support: "AI-powered farm support", intro: "Enter your crop, field, seed, nutrient, and water details to receive a clear input and yield review.", details: "Farm and input details", season: "Use the values from your current season.", profile: "Farm profile", crop: "Crop", state: "State", soil: "Soil type", area: "Farm area", areaHint: "Total area planted with this crop.", goal: "Optimization goal", cost: "Reduce input costs while protecting yield", maximize: "Explore yield improvement options", seedNutrients: "Seed and nutrients", seed: "Seed used", seedHint: "Total seed used across the farm.", urea: "Urea", ureaHint: "Nitrogen fertilizer applied.", dapHint: "Phosphorus fertilizer applied.", mop: "MOP / Potash", mopHint: "Potash fertilizer applied.", water: "Water and soil moisture", moisture: "Current soil moisture", moistureHint: "Enter the latest field or sensor reading.", irrigated: "Irrigated area", irrigatedHint: "Area currently reached by irrigation.", analyze: "Analyzing farm inputs…", generate: "Generate farm analysis", emptyTitle: "Your farm analysis will appear here", empty: "Submit your farm and input details to see yield estimates, savings opportunities, and recommendations.", caution: "The analysis is decision support, not a guaranteed yield or a substitute for local agronomic advice. Verify input changes with a soil test or agricultural expert." },
  hi: { support: "AI आधारित खेती सहायता", intro: "फसल, खेत, बीज, पोषक तत्व और पानी की जानकारी भरें।", details: "खेत और इनपुट की जानकारी", season: "इस मौसम की जानकारी भरें।", profile: "खेत का विवरण", crop: "फसल", state: "राज्य", soil: "मिट्टी का प्रकार", area: "खेत का क्षेत्रफल", areaHint: "इस फसल में बोया गया कुल क्षेत्र।", goal: "अनुकूलन का लक्ष्य", cost: "उपज बनाए रखते हुए लागत घटाएँ", maximize: "उपज बढ़ाने के विकल्प देखें", seedNutrients: "बीज और पोषक तत्व", seed: "इस्तेमाल किया बीज", seedHint: "पूरे खेत में इस्तेमाल किया गया कुल बीज।", urea: "यूरिया", ureaHint: "डाली गई नाइट्रोजन खाद।", dapHint: "डाली गई फॉस्फोरस खाद।", mop: "एमओपी / पोटाश", mopHint: "डाली गई पोटाश खाद।", water: "पानी और मिट्टी की नमी", moisture: "मिट्टी की वर्तमान नमी", moistureHint: "खेत या सेंसर की नवीनतम रीडिंग भरें।", irrigated: "सिंचित क्षेत्र", irrigatedHint: "सिंचाई से पहुँचने वाला क्षेत्र।", analyze: "खेत के इनपुट का विश्लेषण हो रहा है…", generate: "खेत का विश्लेषण करें", emptyTitle: "खेत का विश्लेषण यहाँ दिखेगा", empty: "उपज अनुमान, बचत और सुझाव देखने के लिए खेत की जानकारी भेजें।", caution: "यह विश्लेषण निर्णय लेने में सहायता करता है, उपज की गारंटी नहीं है। बदलाव से पहले मिट्टी की जाँच या कृषि विशेषज्ञ की सलाह लें।" },
  bn: { support: "AI-ভিত্তিক কৃষি সহায়তা", intro: "ফসল, জমি, বীজ, পুষ্টি ও জলের তথ্য দিন।", details: "জমি ও উপকরণের তথ্য", season: "চলতি মরসুমের তথ্য ব্যবহার করুন।", profile: "জমির বিবরণ", crop: "ফসল", state: "রাজ্য", soil: "মাটির ধরন", area: "জমির পরিমাণ", areaHint: "এই ফসলে চাষ করা মোট জমি।", goal: "উন্নতির লক্ষ্য", cost: "ফলন বজায় রেখে খরচ কমান", maximize: "ফলন বাড়ানোর বিকল্প দেখুন", seedNutrients: "বীজ ও পুষ্টি", seed: "ব্যবহৃত বীজ", seedHint: "জমিতে ব্যবহৃত মোট বীজ।", urea: "ইউরিয়া", ureaHint: "প্রয়োগ করা নাইট্রোজেন সার।", dapHint: "প্রয়োগ করা ফসফরাস সার।", mop: "এমওপি / পটাশ", mopHint: "প্রয়োগ করা পটাশ সার।", water: "জল ও মাটির আর্দ্রতা", moisture: "বর্তমান মাটির আর্দ্রতা", moistureHint: "সাম্প্রতিক মাঠ বা সেন্সর রিডিং দিন।", irrigated: "সেচের জমি", irrigatedHint: "সেচের আওতায় থাকা জমি।", analyze: "তথ্য বিশ্লেষণ হচ্ছে…", generate: "কৃষি বিশ্লেষণ তৈরি করুন", emptyTitle: "আপনার বিশ্লেষণ এখানে দেখা যাবে", empty: "ফলনের অনুমান ও পরামর্শ দেখতে জমির তথ্য জমা দিন।", caution: "এই বিশ্লেষণ সিদ্ধান্তে সহায়তা করে, ফলনের নিশ্চয়তা নয়। পরিবর্তনের আগে মাটি পরীক্ষা বা কৃষি বিশেষজ্ঞের পরামর্শ নিন।" },
  ta: { support: "AI விவசாய உதவி", intro: "பயிர், நிலம், விதை, ஊட்டச்சத்து மற்றும் நீர் விவரங்களை உள்ளிடுங்கள்.", details: "பண்ணை மற்றும் உள்ளீட்டு விவரங்கள்", season: "தற்போதைய பருவ விவரங்களைப் பயன்படுத்துங்கள்.", profile: "பண்ணை விவரம்", crop: "பயிர்", state: "மாநிலம்", soil: "மண் வகை", area: "பண்ணை பரப்பு", areaHint: "இந்தப் பயிர் செய்யப்பட்ட மொத்த பரப்பு.", goal: "மேம்பாட்டு இலக்கு", cost: "மகசூலைப் பாதுகாத்து செலவைக் குறைக்கவும்", maximize: "மகசூல் மேம்பாட்டு வழிகளைப் பார்க்கவும்", seedNutrients: "விதை மற்றும் ஊட்டச்சத்து", seed: "பயன்படுத்திய விதை", seedHint: "பண்ணை முழுவதும் பயன்படுத்திய விதை.", urea: "யூரியா", ureaHint: "இட்ட நைட்ரஜன் உரம்.", dapHint: "இட்ட பாஸ்பரஸ் உரம்.", mop: "MOP / பொட்டாஷ்", mopHint: "இட்ட பொட்டாஷ் உரம்.", water: "நீர் மற்றும் மண் ஈரப்பதம்", moisture: "தற்போதைய மண் ஈரப்பதம்", moistureHint: "சமீபத்திய வயல் அல்லது சென்சார் அளவை உள்ளிடுங்கள்.", irrigated: "பாசனப் பரப்பு", irrigatedHint: "பாசனம் கிடைக்கும் பரப்பு.", analyze: "பண்ணை விவரங்கள் பகுப்பாய்வு செய்யப்படுகின்றன…", generate: "பண்ணை பகுப்பாய்வை உருவாக்கு", emptyTitle: "பண்ணை பகுப்பாய்வு இங்கே தோன்றும்", empty: "மகசூல் கணிப்பு மற்றும் பரிந்துரைகளைக் காண விவரங்களைச் சமர்ப்பிக்கவும்.", caution: "இது முடிவெடுக்க உதவும் மதிப்பீடு; மகசூல் உத்தரவாதம் அல்ல. மாற்றங்களுக்கு முன் மண் பரிசோதனை அல்லது வேளாண் நிபுணரிடம் ஆலோசிக்கவும்." },
  te: { support: "AI వ్యవసాయ సహాయం", intro: "పంట, పొలం, విత్తనం, పోషకాలు, నీటి వివరాలను నమోదు చేయండి.", details: "పొలం మరియు ఇన్‌పుట్ వివరాలు", season: "ప్రస్తుత సీజన్ వివరాలను ఉపయోగించండి.", profile: "పొలం వివరాలు", crop: "పంట", state: "రాష్ట్రం", soil: "నేల రకం", area: "పొలం విస్తీర్ణం", areaHint: "ఈ పంట సాగు చేసిన మొత్తం విస్తీర్ణం.", goal: "మెరుగుదల లక్ష్యం", cost: "దిగుబడిని కాపాడుతూ ఖర్చు తగ్గించండి", maximize: "దిగుబడి పెంపు మార్గాలను చూడండి", seedNutrients: "విత్తనం మరియు పోషకాలు", seed: "వాడిన విత్తనం", seedHint: "పొలం మొత్తం వాడిన విత్తనం.", urea: "యూరియా", ureaHint: "వేసిన నైట్రోజన్ ఎరువు.", dapHint: "వేసిన ఫాస్ఫరస్ ఎరువు.", mop: "MOP / పొటాష్", mopHint: "వేసిన పొటాష్ ఎరువు.", water: "నీరు మరియు నేల తేమ", moisture: "ప్రస్తుత నేల తేమ", moistureHint: "తాజా పొలం లేదా సెన్సార్ రీడింగ్ ఇవ్వండి.", irrigated: "నీటిపారుదల విస్తీర్ణం", irrigatedHint: "నీటిపారుదల అందే విస్తీర్ణం.", analyze: "పొలం వివరాలు విశ్లేషిస్తున్నాం…", generate: "పొలం విశ్లేషణ రూపొందించండి", emptyTitle: "పొలం విశ్లేషణ ఇక్కడ కనిపిస్తుంది", empty: "దిగుబడి అంచనా మరియు సూచనలు చూడటానికి వివరాలు సమర్పించండి.", caution: "ఇది నిర్ణయాలకు సహాయపడే అంచనా మాత్రమే; దిగుబడి హామీ కాదు. మార్పులకు ముందు నేల పరీక్ష లేదా వ్యవసాయ నిపుణుడిని సంప్రదించండి." },
  mr: { support: "AI शेती सहाय्य", intro: "पीक, शेत, बियाणे, पोषक घटक आणि पाण्याची माहिती भरा.", details: "शेत आणि निविष्ठांची माहिती", season: "सध्याच्या हंगामातील माहिती वापरा.", profile: "शेताचा तपशील", crop: "पीक", state: "राज्य", soil: "मातीचा प्रकार", area: "शेताचे क्षेत्र", areaHint: "या पिकाखालील एकूण क्षेत्र.", goal: "सुधारणेचे उद्दिष्ट", cost: "उत्पादन टिकवून खर्च कमी करा", maximize: "उत्पादन वाढीचे पर्याय पाहा", seedNutrients: "बियाणे आणि पोषक घटक", seed: "वापरलेले बियाणे", seedHint: "शेतात वापरलेले एकूण बियाणे.", urea: "युरिया", ureaHint: "वापरलेले नायट्रोजन खत.", dapHint: "वापरलेले फॉस्फरस खत.", mop: "MOP / पोटॅश", mopHint: "वापरलेले पोटॅश खत.", water: "पाणी आणि मातीतील ओलावा", moisture: "सध्याचा मातीतील ओलावा", moistureHint: "अलीकडील शेत किंवा सेन्सर वाचन भरा.", irrigated: "सिंचित क्षेत्र", irrigatedHint: "सिंचन पोहोचणारे क्षेत्र.", analyze: "शेताच्या माहितीचे विश्लेषण सुरू आहे…", generate: "शेताचे विश्लेषण करा", emptyTitle: "शेताचे विश्लेषण येथे दिसेल", empty: "उत्पादनाचा अंदाज आणि शिफारसी पाहण्यासाठी माहिती पाठवा.", caution: "हे निर्णयासाठी सहाय्यक अंदाज आहे; उत्पादनाची हमी नाही. बदल करण्यापूर्वी माती तपासा किंवा कृषी तज्ज्ञांचा सल्ला घ्या." },
  gu: { support: "AI ખેતી સહાય", intro: "પાક, ખેતર, બીજ, પોષક તત્ત્વો અને પાણીની માહિતી દાખલ કરો.", details: "ખેતર અને ઇનપુટની વિગતો", season: "ચાલુ મોસમની માહિતી વાપરો.", profile: "ખેતરની વિગતો", crop: "પાક", state: "રાજ્ય", soil: "જમીનનો પ્રકાર", area: "ખેતરનું ક્ષેત્રફળ", areaHint: "આ પાક હેઠળનું કુલ ક્ષેત્રફળ.", goal: "સુધારાનો હેતુ", cost: "ઉત્પાદન જાળવી ખર્ચ ઘટાડો", maximize: "ઉત્પાદન વધારવાના વિકલ્પો જુઓ", seedNutrients: "બીજ અને પોષક તત્ત્વો", seed: "વપરાયેલ બીજ", seedHint: "ખેતરમાં વપરાયેલ કુલ બીજ.", urea: "યુરિયા", ureaHint: "વપરાયેલ નાઇટ્રોજન ખાતર.", dapHint: "વપરાયેલ ફોસ્ફરસ ખાતર.", mop: "MOP / પોટાશ", mopHint: "વપરાયેલ પોટાશ ખાતર.", water: "પાણી અને જમીનની ભેજ", moisture: "જમીનની હાલની ભેજ", moistureHint: "તાજેતરનું ખેતર અથવા સેન્સર રીડિંગ દાખલ કરો.", irrigated: "સિંચાઈ હેઠળનું ક્ષેત્ર", irrigatedHint: "સિંચાઈ પહોંચતું ક્ષેત્ર.", analyze: "ખેતરની માહિતીનું વિશ્લેષણ થઈ રહ્યું છે…", generate: "ખેતરનું વિશ્લેષણ બનાવો", emptyTitle: "ખેતરનું વિશ્લેષણ અહીં દેખાશે", empty: "ઉત્પાદનનો અંદાજ અને સલાહ જોવા વિગતો મોકલો.", caution: "આ નિર્ણયમાં મદદરૂપ અંદાજ છે, ઉત્પાદનની ખાતરી નહીં. ફેરફાર કરતાં પહેલાં જમીન પરીક્ષણ અથવા કૃષિ નિષ્ણાતની સલાહ લો." },
  kn: { support: "AI ಕೃಷಿ ಸಹಾಯ", intro: "ಬೆಳೆ, ಜಮೀನು, ಬೀಜ, ಪೋಷಕಾಂಶ ಮತ್ತು ನೀರಿನ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.", details: "ಜಮೀನು ಮತ್ತು ಒಳಾಂಶಗಳ ವಿವರ", season: "ಪ್ರಸ್ತುತ ಋತುವಿನ ವಿವರಗಳನ್ನು ಬಳಸಿ.", profile: "ಜಮೀನಿನ ವಿವರ", crop: "ಬೆಳೆ", state: "ರಾಜ್ಯ", soil: "ಮಣ್ಣಿನ ವಿಧ", area: "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ", areaHint: "ಈ ಬೆಳೆಯಡಿ ಬಿತ್ತಿದ ಒಟ್ಟು ವಿಸ್ತೀರ್ಣ.", goal: "ಸುಧಾರಣೆಯ ಗುರಿ", cost: "ಇಳುವರಿ ಕಾಪಾಡಿ ವೆಚ್ಚ ಕಡಿಮೆ ಮಾಡಿ", maximize: "ಇಳುವರಿ ಹೆಚ್ಚಿಸುವ ಆಯ್ಕೆಗಳನ್ನು ನೋಡಿ", seedNutrients: "ಬೀಜ ಮತ್ತು ಪೋಷಕಾಂಶಗಳು", seed: "ಬಳಸಿದ ಬೀಜ", seedHint: "ಜಮೀನಿನಲ್ಲಿ ಬಳಸಿದ ಒಟ್ಟು ಬೀಜ.", urea: "ಯೂರಿಯಾ", ureaHint: "ಬಳಸಿದ ಸಾರಜನಕ ಗೊಬ್ಬರ.", dapHint: "ಬಳಸಿದ ರಂಜಕ ಗೊಬ್ಬರ.", mop: "MOP / ಪೊಟ್ಯಾಶ್", mopHint: "ಬಳಸಿದ ಪೊಟ್ಯಾಶ್ ಗೊಬ್ಬರ.", water: "ನೀರು ಮತ್ತು ಮಣ್ಣಿನ ತೇವಾಂಶ", moisture: "ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ ತೇವಾಂಶ", moistureHint: "ಇತ್ತೀಚಿನ ಹೊಲ ಅಥವಾ ಸೆನ್ಸರ್ ಓದನ್ನು ನಮೂದಿಸಿ.", irrigated: "ನೀರಾವರಿ ಪ್ರದೇಶ", irrigatedHint: "ನೀರಾವರಿ ತಲುಪುವ ಪ್ರದೇಶ.", analyze: "ಜಮೀನಿನ ಮಾಹಿತಿ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ…", generate: "ಜಮೀನಿನ ವಿಶ್ಲೇಷಣೆ ರಚಿಸಿ", emptyTitle: "ಜಮೀನಿನ ವಿಶ್ಲೇಷಣೆ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ", empty: "ಇಳುವರಿ ಅಂದಾಜು ಮತ್ತು ಸಲಹೆಗಳನ್ನು ನೋಡಲು ವಿವರಗಳನ್ನು ಸಲ್ಲಿಸಿ.", caution: "ಇದು ನಿರ್ಧಾರಕ್ಕೆ ಸಹಾಯಕ ಅಂದಾಜು; ಇಳುವರಿಯ ಖಾತರಿ ಅಲ್ಲ. ಬದಲಾವಣೆಗೂ ಮೊದಲು ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಅಥವಾ ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ." },
  or: { support: "AI କୃଷି ସହାୟତା", intro: "ଫସଲ, ଜମି, ବିହନ, ପୋଷକତତ୍ତ୍ୱ ଓ ଜଳର ବିବରଣୀ ଦିଅନ୍ତୁ।", details: "ଜମି ଓ ଉପକରଣ ବିବରଣୀ", season: "ଚଳିତ ଋତୁର ବିବରଣୀ ବ୍ୟବହାର କରନ୍ତୁ।", profile: "ଜମିର ବିବରଣୀ", crop: "ଫସଲ", state: "ରାଜ୍ୟ", soil: "ମାଟିର ପ୍ରକାର", area: "ଜମିର କ୍ଷେତ୍ରଫଳ", areaHint: "ଏହି ଫସଲ ଅଧୀନରେ ଥିବା ମୋଟ କ୍ଷେତ୍ର।", goal: "ଉନ୍ନତିର ଲକ୍ଷ୍ୟ", cost: "ଅମଳ ବଜାୟ ରଖି ଖର୍ଚ୍ଚ କମାନ୍ତୁ", maximize: "ଅମଳ ବୃଦ୍ଧି ବିକଳ୍ପ ଦେଖନ୍ତୁ", seedNutrients: "ବିହନ ଓ ପୋଷକତତ୍ତ୍ୱ", seed: "ବ୍ୟବହୃତ ବିହନ", seedHint: "ଜମିରେ ବ୍ୟବହୃତ ମୋଟ ବିହନ।", urea: "ୟୁରିଆ", ureaHint: "ଦିଆଯାଇଥିବା ନାଇଟ୍ରୋଜେନ ସାର।", dapHint: "ଦିଆଯାଇଥିବା ଫସଫରସ ସାର।", mop: "MOP / ପଟାସ", mopHint: "ଦିଆଯାଇଥିବା ପଟାସ ସାର।", water: "ଜଳ ଓ ମାଟିର ଆର୍ଦ୍ରତା", moisture: "ବର୍ତ୍ତମାନ ମାଟିର ଆର୍ଦ୍ରତା", moistureHint: "ନିକଟତମ କ୍ଷେତ୍ର କିମ୍ବା ସେନ୍ସର ତଥ୍ୟ ଦିଅନ୍ତୁ।", irrigated: "ଜଳସେଚିତ କ୍ଷେତ୍ର", irrigatedHint: "ଜଳସେଚନ ପହଞ୍ଚୁଥିବା କ୍ଷେତ୍ର।", analyze: "ଜମିର ତଥ୍ୟ ବିଶ୍ଳେଷଣ ହେଉଛି…", generate: "ଜମି ବିଶ୍ଳେଷଣ କରନ୍ତୁ", emptyTitle: "ଆପଣଙ୍କ ଜମି ବିଶ୍ଳେଷଣ ଏଠାରେ ଦେଖାଯିବ", empty: "ଅମଳ ଆକଳନ ଓ ପରାମର୍ଶ ପାଇଁ ବିବରଣୀ ଦାଖଲ କରନ୍ତୁ।", caution: "ଏହା ନିଷ୍ପତ୍ତି ପାଇଁ ସହାୟକ ଆକଳନ, ଅମଳର ନିଶ୍ଚିତତା ନୁହେଁ। ପରିବର୍ତ୍ତନ ପୂର୍ବରୁ ମାଟି ପରୀକ୍ଷା କିମ୍ବା କୃଷି ବିଶେଷଜ୍ଞଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।" }
};
const numericFields = ["acres", "farmer_input_seed_kg", "urea_kg_ha", "dap_kg_ha", "mop_kg_ha", "soil_moisture_pct", "irrigated_area_ha"];
const fmt = (value, digits = 1) => Number.isFinite(Number(value)) ? Number(value).toLocaleString(undefined, { maximumFractionDigits: digits }) : "—";
const rupees = value => `₹${fmt(value, 0)}`;

function InputField({ label, hint, value, onChange, unit, min = 0, step = "any" }) {
  return <label className="block min-w-0">
    <span className="text-sm font-bold text-gray-800">{label}{unit && <span className="ml-1 font-medium text-gray-500">({unit})</span>}</span>
    {hint && <span className="mt-1 block text-xs leading-5 text-gray-500">{hint}</span>}
    <input type="number" min={min} step={step} value={value} onChange={onChange} className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base font-medium focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" />
  </label>;
}

function Stat({ label, value, note, accent = "green" }) {
  const color = accent === "amber" ? "text-amber-800" : accent === "blue" ? "text-blue-800" : "text-emerald-800";
  return <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <p className="text-sm font-semibold text-gray-500">{label}</p>
    <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
    {note && <p className="mt-1 text-xs leading-5 text-gray-500">{note}</p>}
  </div>;
}

function ActionPill({ action }) {
  const increase = String(action || "").toUpperCase() === "INCREASE";
  const Icon = increase ? ArrowUp : ArrowDown;
  return <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${increase ? "bg-blue-50 text-blue-800" : "bg-amber-50 text-amber-800"}`}><Icon size={14}/>{action || "REVIEW"}</span>;
}

function DetailedResult({ result }) {
  const summary = result.plot_summary || {};
  const seed = result.seed_audit || {};
  const shap = result.shap_explainability || {};
  const scorecard = result.scorecard || {};
  const factors = Array.isArray(result.factor_breakdown) ? result.factor_breakdown : [];
  const boosters = [shap.top_booster, shap.top_bottleneck].filter(Boolean);
  const maxImpact = Math.max(1, ...boosters.map(item => Math.abs(Number(item.impact_q_acre) || 0)));

  return <div className="space-y-6">
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-800 p-6 text-white shadow-lg sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-sm font-bold uppercase tracking-[.14em] text-emerald-200">Farm analysis</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">{summary.crop || "Crop"} · Yield and input plan</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-emerald-50"><span className="inline-flex items-center gap-1.5"><MapPin size={15}/>{summary.state || "Location not provided"}</span><span>{fmt(summary.acres)} acres</span><span>{summary.soil_type || "Soil not provided"}</span></div>
        </div>
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold">{String(summary.mode || "ANALYSIS").replaceAll("_", " ")}</span>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-semibold text-emerald-100">Current harvest</p><p className="mt-1 text-2xl font-black">{fmt(summary.base_harvest_total_q)} q</p><p className="text-xs text-emerald-100">{fmt(summary.base_yield_q_acre, 2)} q/acre</p></div>
        <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-semibold text-emerald-100">Optimized harvest</p><p className="mt-1 text-2xl font-black">{fmt(summary.optimal_harvest_total_q)} q</p><p className="text-xs text-emerald-100">{fmt(summary.optimal_yield_q_acre, 2)} q/acre</p></div>
        <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-semibold text-emerald-100">Harvest difference</p><p className="mt-1 text-2xl font-black">{fmt(summary.harvest_gain_total_q)} q</p><p className="text-xs text-emerald-100">{fmt(summary.pct_increase, 1)}% change</p></div>
        <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-semibold text-emerald-100">Primary focus</p><p className="mt-2 text-base font-extrabold leading-5">{summary.primary_driver || "Farm input efficiency"}</p></div>
      </div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
      <article className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 sm:p-7">
        <div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-amber-800"><Sprout size={23}/></span><div><p className="text-sm font-bold uppercase tracking-wider text-amber-800">Seed audit</p><h3 className="mt-1 text-xl font-black text-gray-900">Seed rate review</h3></div></div>
        <div className="mt-5 grid grid-cols-2 gap-3"><Stat label="Seed entered" value={`${fmt(seed.farmer_input_seed_kg)} kg`} accent="amber"/><Stat label="Suggested total" value={`${fmt(seed.recommended_total_seed_kg)} kg`} accent="amber"/></div>
        <div className="mt-3 rounded-2xl bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><ActionPill action={seed.action}/><strong className="text-sm text-emerald-800">{seed.financial_verdict || "Review seed costs"}</strong></div><p className="mt-3 text-sm leading-6 text-gray-700">{seed.diagnosis || "No seed-rate explanation was returned."}</p></div>
        {seed.sowing_protocol && <p className="mt-3 rounded-xl border border-amber-200/70 bg-white/80 p-3 text-sm leading-6 text-gray-700"><strong>Sowing guidance: </strong>{seed.sowing_protocol}</p>}
      </article>

      <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-800"><BarChart3 size={22}/></span><div><p className="text-sm font-bold uppercase tracking-wider text-blue-800">Model explanation</p><h3 className="mt-1 text-xl font-black text-gray-900">What is affecting the estimate?</h3></div></div>
        {shap.active && boosters.length ? <div className="mt-5 space-y-4">
          <p className="text-sm text-gray-600">Regional baseline: <strong className="text-gray-900">{fmt(shap.regional_baseline_q_acre, 2)} q/acre</strong></p>
          {boosters.map((item, index) => { const positive = Number(item.impact_q_acre) >= 0; return <div key={`${item.feature}-${index}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-bold text-gray-800">{String(item.feature || "Factor").replaceAll("_", " ")}</span><span className={`font-extrabold ${positive ? "text-emerald-700" : "text-rose-700"}`}>{positive ? "+" : ""}{fmt(item.impact_q_acre, 2)} q/acre · {item.direction}</span></div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${positive ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${Math.max(8, Math.abs(Number(item.impact_q_acre) || 0) / maxImpact * 100)}%` }}/></div>
          </div>; })}
        </div> : <p className="mt-5 text-sm text-gray-500">Explainability details were not provided for this result.</p>}
      </article>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-700"/><h3 className="text-xl font-black">What is going well</h3></div>
        {scorecard.pros?.length ? <ul className="mt-4 space-y-3">{scorecard.pros.map((item, index) => <li key={index} className="flex gap-3 rounded-xl bg-emerald-50/70 p-3 text-sm leading-6 text-gray-700"><CheckCircle2 className="mt-1 shrink-0 text-emerald-700" size={17}/>{item}</li>)}</ul> : <p className="mt-4 text-sm text-gray-500">No strengths were listed.</p>}
      </article>
      <article className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center gap-3"><AlertTriangle className="text-rose-700"/><h3 className="text-xl font-black">Items to review</h3></div>
        {scorecard.cons?.length ? <ul className="mt-4 space-y-3">{scorecard.cons.map((item, index) => <li key={index} className="flex gap-3 rounded-xl bg-rose-50/70 p-3 text-sm leading-6 text-gray-700"><AlertTriangle className="mt-1 shrink-0 text-rose-700" size={17}/>{item}</li>)}</ul> : <p className="mt-4 text-sm text-gray-500">No issues were listed.</p>}
        {(scorecard.highest_wasted_effort || scorecard.highest_missed_return) && <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-900">Watch: {scorecard.highest_wasted_effort}</span><span className="rounded-full bg-blue-100 px-3 py-1.5 text-blue-900">Opportunity: {scorecard.highest_missed_return}</span></div>}
      </article>
    </section>

    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-emerald-800">Input plan</p><h3 className="mt-1 text-xl font-black">Factor-by-factor recommendations</h3></div><span className="text-sm text-gray-500">Values and units as returned by the analysis</span></div>
      {factors.length ? <div className="mt-5 space-y-3">{factors.map((factor, index) => <article key={`${factor.factor_name}-${index}`} className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><h4 className="text-base font-extrabold text-gray-900">{factor.factor_name}</h4><ActionPill action={factor.action}/></div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><p className="text-xs font-semibold text-gray-500">Current</p><p className="mt-1 font-bold">{fmt(factor.current_value)} {factor.unit}</p></div>
          <div><p className="text-xs font-semibold text-gray-500">Target</p><p className="mt-1 font-bold">{fmt(factor.target_value)} {factor.unit}</p></div>
          <div><p className="text-xs font-semibold text-gray-500">Adjustment</p><p className="mt-1 font-bold">{fmt(factor.delta_units)} {factor.unit}</p></div>
          <div><p className="text-xs font-semibold text-gray-500">Estimated yield change</p><p className="mt-1 font-bold">{fmt(factor.marginal_yield_delta_q_acre, 2)} q/acre</p></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"><span className="font-bold text-emerald-800">{factor.financial_impact || ""}</span>{factor.pump_hours != null && <span className="text-gray-600">Pump time: {fmt(factor.pump_hours)} hours</span>}{factor.pump_relay_trigger && <span className="inline-flex items-center gap-1 font-bold text-blue-800"><Droplets size={16}/> Irrigation trigger</span>}</div>
        {factor.biological_why && <p className="mt-3 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600"><strong className="text-gray-800">Why it matters: </strong>{factor.biological_why}</p>}
      </article>)}</div> : <p className="mt-5 text-sm text-gray-500">Detailed factor recommendations were not provided.</p>}
    </section>

    {summary.gross_grain_value_inr != null && Number(summary.gross_grain_value_inr) > 0 && <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-950"><BadgeIndianRupee/><p>Estimated gross grain value: <strong>{rupees(summary.gross_grain_value_inr)}</strong></p></div>}
    <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Use as decision support.</strong> Model recommendations are estimates. Confirm fertilizer and irrigation decisions with a soil test and a local agricultural expert before making changes.</p>
  </div>;
}

function LegacyResult({ result }) {
  return <div className="space-y-5">
    <section className="rounded-3xl bg-gradient-to-br from-emerald-950 to-green-800 p-7 text-white shadow-lg"><p className="text-sm font-bold uppercase tracking-wider text-emerald-200">Prediction result</p><h2 className="mt-3 text-4xl font-black">{fmt(result.predicted_yield, 2)} q/ha</h2><p className="mt-2 text-emerald-100">Potential yield: <strong>{fmt(result.optimized_yield, 2)} q/ha</strong></p></section>
    {result.factors?.length > 0 && <section className="rounded-3xl border bg-white p-6"><h3 className="text-xl font-black">Farm factors</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{result.factors.map((factor, index) => <div key={index} className="rounded-xl bg-gray-50 p-4"><p className="font-bold">{factor.name}</p><p className="mt-1 text-sm text-gray-600">{factor.status}</p></div>)}</div></section>}
    {result.recommendations?.length > 0 && <section className="rounded-3xl border bg-white p-6"><h3 className="text-xl font-black">Suggested next steps</h3><ul className="mt-3 space-y-2">{result.recommendations.map((item, index) => <li key={index} className="flex gap-2 text-sm leading-6 text-gray-700"><CheckCircle2 className="mt-1 shrink-0 text-emerald-700" size={17}/>{item}</li>)}</ul></section>}
  </div>;
}

export default function Prediction() {
  const { t, i18n } = useTranslation();
  const copy = pageCopy[i18n.resolvedLanguage?.split("-")[0]] || pageCopy.en;
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (key, value) => setForm(current => ({ ...current, [key]: numericFields.includes(key) ? (value === "" ? "" : Number(value)) : value }));

  const run = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      const input = {
        ...form,
        acres: Number(form.acres),
        farmer_input_seed_kg: Number(form.farmer_input_seed_kg),
        urea_kg_ha: Number(form.urea_kg_ha), dap_kg_ha: Number(form.dap_kg_ha),
        mop_kg_ha: Number(form.mop_kg_ha), soil_moisture_pct: Number(form.soil_moisture_pct),
        irrigated_area_ha: Number(form.irrigated_area_ha),
        // Compatibility fields for the current demo FastAPI endpoint.
        location: form.state, area: Number(form.acres) * 0.404686, soil: form.soil_type,
        irrigation: Number(form.soil_moisture_pct), fertilizer: Number(form.urea_kg_ha)
      };
      const { data } = await api.post("/prediction/predict", input);
      setResult(data);
      toast.success(t("prediction.generated"));
    } catch (error) {
      toast.error(error.response?.data?.detail || t("prediction.failed"));
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base font-medium focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";
  const field = (key, label, unit, hint, step) => <InputField key={key} label={label} unit={unit} hint={hint} value={form[key]} onChange={event => set(key, event.target.value)} step={step}/>;

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
    <header className="max-w-3xl"><p className="font-bold text-emerald-800">{copy.support}</p><h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">{t("prediction.title")}</h1><p className="mt-3 text-base leading-7 text-gray-600 sm:text-lg">{copy.intro}</p></header>

    <div className="mt-8 grid items-start gap-7 xl:grid-cols-[minmax(340px,.78fr)_minmax(0,1.22fr)]">
      <form onSubmit={run} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-gov sm:p-7">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800"><Wheat size={22}/></span><div><h2 className="text-xl font-black text-gray-950">{copy.details}</h2><p className="text-sm text-gray-500">{copy.season}</p></div></div>

        <section className="mt-6"><h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">{copy.profile}</h3><div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-gray-800">{copy.crop}<select value={form.crop} onChange={event => set("crop", event.target.value)} className={selectClass}>{crops.map(crop => <option key={crop}>{crop}</option>)}</select></label>
          <label className="block text-sm font-bold text-gray-800">{copy.state}<select value={form.state} onChange={event => set("state", event.target.value)} className={selectClass}>{states.map(state => <option key={state}>{state}</option>)}</select></label>
          <label className="block text-sm font-bold text-gray-800">{copy.soil}<select value={form.soil_type} onChange={event => set("soil_type", event.target.value)} className={selectClass}>{soilTypes.map(soil => <option key={soil}>{soil}</option>)}</select></label>
          {field("acres", copy.area, "acres", copy.areaHint, "0.1")}
          <label className="block text-sm font-bold text-gray-800 sm:col-span-2">{copy.goal}<select value={form.mode} onChange={event => set("mode", event.target.value)} className={selectClass}><option value="COST_OPTIMIZATION">{copy.cost}</option><option value="YIELD_MAXIMIZATION">{copy.maximize}</option></select></label>
        </div></section>

        <section className="mt-6 border-t border-gray-100 pt-5"><h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">{copy.seedNutrients}</h3><div className="mt-3 grid gap-4 sm:grid-cols-2">
          {field("farmer_input_seed_kg", copy.seed, "kg total", copy.seedHint, "0.1")}
          {field("urea_kg_ha", copy.urea, "kg/ha", copy.ureaHint, "0.1")}
          {field("dap_kg_ha", "DAP", "kg/ha", copy.dapHint, "0.1")}
          {field("mop_kg_ha", copy.mop, "kg/ha", copy.mopHint, "0.1")}
        </div></section>

        <section className="mt-6 border-t border-gray-100 pt-5"><h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">{copy.water}</h3><div className="mt-3 grid gap-4 sm:grid-cols-2">
          {field("soil_moisture_pct", copy.moisture, "%", copy.moistureHint, "0.1")}
          {field("irrigated_area_ha", copy.irrigated, "hectares", copy.irrigatedHint, "0.1")}
        </div></section>

        <button disabled={loading} className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-base font-extrabold text-white transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-70">{loading ? <><Loader2 className="animate-spin" size={19}/>{copy.analyze}</> : <><Sparkles size={19}/>{copy.generate}</>}</button>
      </form>

      <div className="min-w-0">
        {!result ? <div className="flex min-h-[460px] items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-amber-50 p-8 text-center"><div><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-emerald-800 shadow-sm"><Sprout size={32}/></span><h2 className="mt-5 text-2xl font-black text-gray-950">{copy.emptyTitle}</h2><p className="mx-auto mt-2 max-w-md leading-6 text-gray-600">{copy.empty}</p></div></div>
          : <motion.div key={result} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            {result.plot_summary ? <DetailedResult result={result}/> : <LegacyResult result={result}/>}
          </motion.div>}
      </div>
    </div>
    <p className="mt-7 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><ShieldCheck className="mt-0.5 shrink-0" size={18}/>{copy.caution}</p>
  </div>;
}
