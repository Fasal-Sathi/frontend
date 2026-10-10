import { useEffect, useState } from "react";
import { ArrowUpRight, BadgeIndianRupee, ExternalLink, MapPin, RefreshCw, ShieldCheck, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../utils/api";

const pageCopy = {
  en: { eyebrow: "Government support for farmers", title: "Schemes for farmers", intro: "A simple guide to selected central agriculture schemes, what they offer, and where to check if you can benefit.", central: "Central government", note: "Featured schemes: These are selected central schemes. Availability and application steps can depend on your state, district, crop, and eligibility. Confirm details through the official links or your local agriculture office.", who: "Who may benefit?", official: "Official details and application", last: "Scheme rules, dates, and eligibility can change. Check the official scheme page before applying.", updates: "Check for updates", checking: "Checking updates", categories: { pmddky: "New programme · 2025", "pulses-mission": "New programme · 2025–26 to 2030–31", "pm-kisan": "Income support", pmfby: "Crop protection" }, names: { pmddky: "PM Dhan-Dhaanya Krishi Yojana", "pulses-mission": "Self-Reliance in Pulses Mission", "pm-kisan": "PM-KISAN income support", pmfby: "Crop insurance" }, schemes: {
    pmddky: ["A development programme for 100 selected agriculture-focused districts. It brings existing government support together to improve farm productivity, irrigation, storage, crop variety, and access to credit.", "Farmers in the selected districts. Ask your district agriculture office or Krishi Vigyan Kendra whether your district is included and what support is available locally."],
    "pulses-mission": ["Support to grow more pulses, including Tur, Urad, and Masoor. The mission includes improved seeds and training. Registered farmers in participating states may offer these crops for government procurement at MSP, subject to the programme rules.", "Farmers growing pulses, especially Tur, Urad, or Masoor. Ask your state agriculture department, NAFED, or NCCF about seed support and farmer registration in your area."],
    "pm-kisan": ["Eligible landholding farmer families can receive ₹6,000 per year, paid directly to the bank account in three instalments of ₹2,000.", "Eligible farmer families with cultivable land, subject to the scheme’s exclusion rules. Aadhaar-linked bank details and e-KYC may be needed to receive payments."],
    pmfby: ["Crop insurance that can help protect farmers against specified crop losses, such as losses from natural risks. Coverage depends on the notified crop, area, season, and policy conditions.", "Farmers growing notified crops in an insured area. Check whether your crop and village are covered, the enrolment window, and the policy terms before applying."]
  }},
  hi: { eyebrow: "किसानों के लिए सरकारी सहायता", title: "किसानों के लिए योजनाएँ", intro: "चुनी हुई केंद्रीय कृषि योजनाओं, उनके लाभ और पात्रता जाँचने के तरीकों की सरल जानकारी।", central: "केंद्र सरकार", note: "प्रमुख योजनाएँ: लाभ और आवेदन की प्रक्रिया राज्य, ज़िले, फ़सल और पात्रता के अनुसार अलग हो सकती है। आधिकारिक लिंक या स्थानीय कृषि कार्यालय से पुष्टि करें।", who: "किसे लाभ मिल सकता है?", official: "आधिकारिक जानकारी और आवेदन", last: "योजना के नियम, तारीखें और पात्रता बदल सकती हैं। आवेदन से पहले आधिकारिक जानकारी जाँचें।", updates: "अपडेट देखें", checking: "अपडेट देख रहे हैं", categories: { pmddky: "नई योजना · 2025", "pulses-mission": "नई योजना · 2025–26 से 2030–31", "pm-kisan": "आय सहायता", pmfby: "फ़सल सुरक्षा" }, names: { pmddky: "पीएम धन-धान्य कृषि योजना", "pulses-mission": "दाल आत्मनिर्भरता मिशन", "pm-kisan": "पीएम-किसान आय सहायता", pmfby: "फ़सल बीमा" }, schemes: {
    pmddky: ["यह कृषि पर ध्यान देने वाले चुने हुए 100 ज़िलों के लिए विकास कार्यक्रम है। इसका उद्देश्य खेती की उत्पादकता, सिंचाई, भंडारण, फ़सल विविधता और ऋण की उपलब्धता बेहतर करना है।", "चुने हुए ज़िलों के किसान। अपने ज़िला कृषि कार्यालय या कृषि विज्ञान केंद्र से पूछें कि आपका ज़िला शामिल है या नहीं और वहाँ कौन-सी सहायता उपलब्ध है।"],
    "pulses-mission": ["तुअर, उड़द और मसूर सहित दालों की खेती बढ़ाने के लिए बीज और प्रशिक्षण सहायता। भाग लेने वाले राज्यों में पंजीकृत किसान नियमों के अनुसार MSP पर सरकारी खरीद के लिए उपज दे सकते हैं।", "दाल उगाने वाले किसान, खासकर तुअर, उड़द या मसूर के किसान। बीज सहायता और पंजीकरण के लिए राज्य कृषि विभाग, NAFED या NCCF से पूछें।"],
    "pm-kisan": ["पात्र भूमिधारक किसान परिवारों को सालाना ₹6,000 मिल सकते हैं। यह राशि ₹2,000 की तीन किस्तों में सीधे बैंक खाते में भेजी जाती है।", "खेती योग्य भूमि वाले पात्र किसान परिवार, योजना के अपवर्जन नियमों के अधीन। भुगतान के लिए आधार से जुड़ा बैंक खाता और e-KYC आवश्यक हो सकते हैं।"],
    pmfby: ["फ़सल बीमा प्राकृतिक जोखिमों सहित अधिसूचित कारणों से होने वाले फ़सल नुकसान में सुरक्षा दे सकता है। कवरेज अधिसूचित फ़सल, क्षेत्र, मौसम और पॉलिसी की शर्तों पर निर्भर करता है।", "बीमित क्षेत्र में अधिसूचित फ़सल उगाने वाले किसान। आवेदन से पहले फ़सल, गाँव, आवेदन अवधि और पॉलिसी की शर्तें जाँचें।"]
  }},
  ta: { eyebrow: "விவசாயிகளுக்கான அரசு ஆதரவு", title: "விவசாயிகளுக்கான திட்டங்கள்", intro: "தேர்ந்தெடுக்கப்பட்ட மத்திய வேளாண் திட்டங்கள், அவற்றின் உதவி, தகுதியை அறியும் எளிய வழிகாட்டி.", central: "மத்திய அரசு", note: "தேர்ந்தெடுக்கப்பட்ட திட்டங்கள்: உதவியும் விண்ணப்ப முறையும் மாநிலம், மாவட்டம், பயிர், தகுதி ஆகியவற்றைப் பொறுத்து மாறலாம். அதிகாரப்பூர்வ இணைப்புகள் அல்லது உள்ளூர் வேளாண் அலுவலகத்தில் உறுதிப்படுத்தவும்.", who: "யாருக்கு உதவி கிடைக்கலாம்?", official: "அதிகாரப்பூர்வ விவரங்கள் மற்றும் விண்ணப்பம்", last: "திட்ட விதிகள், தேதிகள், தகுதி மாறலாம். விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ தகவலைப் பார்க்கவும்.", updates: "புதுப்பிப்புகளைப் பார்க்க", checking: "புதுப்பிப்புகள் சரிபார்க்கப்படுகின்றன", categories: { pmddky: "புதிய திட்டம் · 2025", "pulses-mission": "புதிய திட்டம் · 2025–26 முதல் 2030–31", "pm-kisan": "வருமான உதவி", pmfby: "பயிர் பாதுகாப்பு" }, names: { pmddky: "பிரதமர் தன்-தான்ய கிருஷி யோஜனா", "pulses-mission": "பருப்பு தன்னிறைவு இயக்கம்", "pm-kisan": "PM-KISAN வருமான உதவி", pmfby: "பயிர் காப்பீடு" }, schemes: {
    pmddky: ["வேளாண்மையில் கவனம் செலுத்தும் 100 தேர்ந்தெடுக்கப்பட்ட மாவட்டங்களுக்கான வளர்ச்சித் திட்டம். உற்பத்தித்திறன், பாசனம், சேமிப்பு, பயிர் பல்வகைமை, கடன் அணுகலை மேம்படுத்தும்.", "தேர்ந்தெடுக்கப்பட்ட மாவட்ட விவசாயிகள். உங்கள் மாவட்டம் சேர்க்கப்பட்டுள்ளதா, உள்ளூர் உதவி என்ன என்பதை மாவட்ட வேளாண் அலுவலகம் அல்லது கிருஷி விக்யான் கேந்திராவில் கேளுங்கள்."],
    "pulses-mission": ["துவரம், உளுந்து, மசூர் உள்ளிட்ட பருப்பு உற்பத்தியை அதிகரிக்க விதை மற்றும் பயிற்சி ஆதரவு. பங்கேற்கும் மாநிலங்களில் பதிவு செய்த விவசாயிகள் விதிகளுக்கு உட்பட்டு MSP-யில் விற்பனை செய்யலாம்.", "பருப்பு பயிரிடும் விவசாயிகள், குறிப்பாக துவரம், உளுந்து, மசூர். விதை உதவி மற்றும் பதிவுக்கு மாநில வேளாண் துறை, NAFED அல்லது NCCF-ஐ அணுகவும்."],
    "pm-kisan": ["தகுதியுள்ள நிலம் வைத்துள்ள விவசாயக் குடும்பங்களுக்கு ஆண்டுக்கு ₹6,000 கிடைக்கலாம். ₹2,000 வீதம் மூன்று தவணைகளாக வங்கிக் கணக்கில் செலுத்தப்படும்.", "விவசாய நிலம் கொண்ட தகுதியுள்ள குடும்பங்கள்; திட்ட விலக்கு விதிகள் பொருந்தும். ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கும் e-KYC-யும் தேவைப்படலாம்."],
    pmfby: ["குறிப்பிட்ட இயற்கை அபாயங்களால் ஏற்படும் பயிர் இழப்புகளுக்கு பயிர் காப்பீடு உதவலாம். பாதுகாப்பு அறிவிக்கப்பட்ட பயிர், பகுதி, பருவம், காப்பீட்டு நிபந்தனைகளைப் பொறுத்தது.", "காப்பீடு செய்யப்பட்ட பகுதியில் அறிவிக்கப்பட்ட பயிர்களை விளைவிக்கும் விவசாயிகள். விண்ணப்பிக்கும் முன் பயிர், கிராமம், காலக்கெடு, நிபந்தனைகளைச் சரிபார்க்கவும்."]
  }},
  te: { eyebrow: "రైతులకు ప్రభుత్వ సహాయం", title: "రైతుల కోసం పథకాలు", intro: "ఎంచుకున్న కేంద్ర వ్యవసాయ పథకాలు, వాటి ప్రయోజనాలు, అర్హత తెలుసుకోవడానికి సరళమైన సమాచారం.", central: "కేంద్ర ప్రభుత్వం", note: "ఎంచుకున్న పథకాలు: ప్రయోజనాలు, దరఖాస్తు విధానం రాష్ట్రం, జిల్లా, పంట, అర్హతపై ఆధారపడి మారవచ్చు. అధికారిక లింకులు లేదా స్థానిక వ్యవసాయ కార్యాలయంలో నిర్ధారించుకోండి.", who: "ఎవరికి ప్రయోజనం ఉండవచ్చు?", official: "అధికారిక వివరాలు మరియు దరఖాస్తు", last: "పథకం నియమాలు, తేదీలు, అర్హత మారవచ్చు. దరఖాస్తుకు ముందు అధికారిక సమాచారాన్ని చూడండి.", updates: "అప్‌డేట్‌లను చూడండి", checking: "అప్‌డేట్‌లు తనిఖీ అవుతున్నాయి", categories: { pmddky: "కొత్త పథకం · 2025", "pulses-mission": "కొత్త పథకం · 2025–26 నుండి 2030–31", "pm-kisan": "ఆదాయ సహాయం", pmfby: "పంట రక్షణ" }, names: { pmddky: "ప్రధానమంత్రి ధన్-ధాన్య కృషి యోజన", "pulses-mission": "పప్పుధాన్యాల స్వయం సమృద్ధి మిషన్", "pm-kisan": "PM-KISAN ఆదాయ సహాయం", pmfby: "పంట బీమా" }, schemes: {
    pmddky: ["వ్యవసాయంపై దృష్టి పెట్టిన ఎంపిక చేసిన 100 జిల్లాల అభివృద్ధి కార్యక్రమం. ఉత్పాదకత, నీటిపారుదల, నిల్వ, పంట వైవిధ్యం, రుణ సదుపాయాన్ని మెరుగుపరచడమే లక్ష్యం.", "ఎంపిక చేసిన జిల్లాల రైతులు. మీ జిల్లా చేర్చబడిందా, స్థానికంగా ఏ సహాయం అందుబాటులో ఉందో జిల్లా వ్యవసాయ కార్యాలయం లేదా కృషి విజ్ఞాన్ కేంద్రంలో అడగండి."],
    "pulses-mission": ["కంది, మినుము, మసూర్ సహా పప్పుధాన్యాల సాగుకు విత్తనాలు, శిక్షణ సహాయం. పాల్గొనే రాష్ట్రాల్లో నమోదు చేసుకున్న రైతులు నిబంధనల ప్రకారం MSP వద్ద అమ్మవచ్చు.", "పప్పుధాన్యాలు, ముఖ్యంగా కంది, మినుము, మసూర్ పండించే రైతులు. విత్తన సహాయం, నమోదు గురించి రాష్ట్ర వ్యవసాయ శాఖ, NAFED లేదా NCCFను అడగండి."],
    "pm-kisan": ["అర్హత కలిగిన భూమి ఉన్న రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 అందవచ్చు. ₹2,000 చొప్పున మూడు విడతలుగా నేరుగా బ్యాంకు ఖాతాకు జమ అవుతుంది.", "పథకం మినహాయింపు నిబంధనలకు లోబడి సాగుభూమి కలిగిన అర్హ రైతు కుటుంబాలు. ఆధార్ లింక్ చేసిన బ్యాంకు ఖాతా, e-KYC అవసరం కావచ్చు."],
    pmfby: ["ప్రకృతి వైపరీత్యాల వంటి నిర్దిష్ట కారణాల వల్ల పంట నష్టానికి పంట బీమా రక్షణ కల్పించవచ్చు. కవరేజ్ నోటిఫై చేసిన పంట, ప్రాంతం, సీజన్, పాలసీ నిబంధనలపై ఆధారపడి ఉంటుంది.", "బీమా పరిధిలోని ప్రాంతంలో నోటిఫై చేసిన పంటలను పండించే రైతులు. దరఖాస్తుకు ముందు పంట, గ్రామం, గడువు, పాలసీ నిబంధనలు తనిఖీ చేయండి."]
  }},
  bn: { eyebrow: "কৃষকদের জন্য সরকারি সহায়তা", title: "কৃষকদের জন্য প্রকল্প", intro: "নির্বাচিত কেন্দ্রীয় কৃষি প্রকল্প, সেগুলির সুবিধা এবং যোগ্যতা যাচাইয়ের সহজ তথ্য।", central: "কেন্দ্রীয় সরকার", note: "নির্বাচিত প্রকল্প: সুবিধা ও আবেদনের পদ্ধতি রাজ্য, জেলা, ফসল এবং যোগ্যতার ওপর নির্ভর করতে পারে। সরকারি লিঙ্ক বা স্থানীয় কৃষি দপ্তরে নিশ্চিত করুন।", who: "কারা সুবিধা পেতে পারেন?", official: "সরকারি তথ্য ও আবেদন", last: "প্রকল্পের নিয়ম, তারিখ ও যোগ্যতা বদলাতে পারে। আবেদনের আগে সরকারি তথ্য দেখুন।", updates: "আপডেট দেখুন", checking: "আপডেট দেখা হচ্ছে", categories: { pmddky: "নতুন প্রকল্প · ২০২৫", "pulses-mission": "নতুন প্রকল্প · ২০২৫–২৬ থেকে ২০৩০–৩১", "pm-kisan": "আয় সহায়তা", pmfby: "ফসল সুরক্ষা" }, names: { pmddky: "প্রধানমন্ত্রী ধন-ধান্য কৃষি যোজনা", "pulses-mission": "ডাল স্বনির্ভরতা মিশন", "pm-kisan": "পিএম-কিসান আয় সহায়তা", pmfby: "ফসল বিমা" }, schemes: {
    pmddky: ["কৃষিতে পিছিয়ে থাকা নির্বাচিত ১০০টি জেলার উন্নয়ন কর্মসূচি। উৎপাদনশীলতা, সেচ, সংরক্ষণ, ফসলের বৈচিত্র্য ও ঋণের সুযোগ উন্নত করাই লক্ষ্য।", "নির্বাচিত জেলার কৃষকেরা। আপনার জেলা অন্তর্ভুক্ত কি না এবং স্থানীয় সহায়তা কী, জেলা কৃষি দপ্তর বা কৃষি বিজ্ঞান কেন্দ্রে জিজ্ঞাসা করুন।"],
    "pulses-mission": ["তুর, উড়দ ও মসুরসহ ডাল উৎপাদনে বীজ ও প্রশিক্ষণ সহায়তা। অংশগ্রহণকারী রাজ্যে নিবন্ধিত কৃষকেরা নিয়ম মেনে MSP-তে ফসল বিক্রির সুযোগ পেতে পারেন।", "ডাল চাষি, বিশেষ করে তুর, উড়দ বা মসুর চাষিরা। বীজ সহায়তা ও নিবন্ধনের জন্য রাজ্য কৃষি দপ্তর, NAFED বা NCCF-এ যোগাযোগ করুন।"],
    "pm-kisan": ["যোগ্য জমির মালিক কৃষক পরিবার বছরে ₹৬,০০০ পেতে পারে। ₹২,০০০ করে তিন কিস্তিতে সরাসরি ব্যাঙ্ক অ্যাকাউন্টে দেওয়া হয়।", "চাষযোগ্য জমি থাকা যোগ্য কৃষক পরিবার; প্রকল্পের বর্জন-নিয়ম প্রযোজ্য। আধার-যুক্ত ব্যাঙ্ক অ্যাকাউন্ট ও e-KYC লাগতে পারে।"],
    pmfby: ["নির্দিষ্ট প্রাকৃতিক ঝুঁকিতে ফসলের ক্ষতির জন্য ফসল বিমা সহায়তা দিতে পারে। কভারেজ বিজ্ঞপ্তিভুক্ত ফসল, এলাকা, মরশুম ও পলিসির শর্তের ওপর নির্ভর করে।", "বিমাকৃত এলাকায় বিজ্ঞপ্তিভুক্ত ফসল চাষ করা কৃষকেরা। আবেদনের আগে ফসল, গ্রাম, সময়সীমা ও পলিসির শর্ত যাচাই করুন।"]
  }},
  mr: { eyebrow: "शेतकऱ्यांसाठी सरकारी मदत", title: "शेतकऱ्यांसाठी योजना", intro: "निवडक केंद्रीय कृषी योजना, त्यांचे लाभ आणि पात्रता तपासण्याची सोपी माहिती.", central: "केंद्र सरकार", note: "निवडक योजना: लाभ व अर्ज प्रक्रिया राज्य, जिल्हा, पीक आणि पात्रतेनुसार बदलू शकते. अधिकृत दुवे किंवा स्थानिक कृषी कार्यालयात खात्री करा.", who: "कोणाला लाभ मिळू शकतो?", official: "अधिकृत माहिती आणि अर्ज", last: "योजनेचे नियम, तारखा आणि पात्रता बदलू शकते. अर्जापूर्वी अधिकृत माहिती तपासा.", updates: "अपडेट तपासा", checking: "अपडेट तपासत आहे", categories: { pmddky: "नवीन योजना · 2025", "pulses-mission": "नवीन योजना · 2025–26 ते 2030–31", "pm-kisan": "उत्पन्न सहाय्य", pmfby: "पीक संरक्षण" }, names: { pmddky: "पीएम धन-धान्य कृषी योजना", "pulses-mission": "डाळ आत्मनिर्भरता अभियान", "pm-kisan": "पीएम-किसान उत्पन्न सहाय्य", pmfby: "पीक विमा" }, schemes: {
    pmddky: ["शेतीवर लक्ष केंद्रित केलेल्या निवडक १०० जिल्ह्यांसाठी विकास कार्यक्रम. उत्पादकता, सिंचन, साठवण, पीक विविधता आणि कर्जाची उपलब्धता सुधारण्याचा उद्देश आहे.", "निवडक जिल्ह्यांतील शेतकरी. तुमचा जिल्हा समाविष्ट आहे का आणि स्थानिक मदत काय आहे, हे जिल्हा कृषी कार्यालय किंवा कृषी विज्ञान केंद्रात विचारा."],
    "pulses-mission": ["तूर, उडीद आणि मसूरसह डाळींची लागवड वाढवण्यासाठी बियाणे आणि प्रशिक्षण मदत. सहभागी राज्यांतील नोंदणीकृत शेतकरी नियमांनुसार MSP वर विक्री करू शकतात.", "डाळी पिकवणारे, विशेषतः तूर, उडीद किंवा मसूर उत्पादक. बियाणे मदत आणि नोंदणीसाठी राज्य कृषी विभाग, NAFED किंवा NCCF ला विचारा."],
    "pm-kisan": ["पात्र जमीनधारक शेतकरी कुटुंबांना वर्षाला ₹६,००० मिळू शकतात. ₹२,००० च्या तीन हप्त्यांत रक्कम थेट बँक खात्यात जमा होते.", "योजनेच्या अपात्रता नियमांच्या अधीन राहून लागवडीयोग्य जमीन असलेली पात्र कुटुंबे. आधार-जोडलेले बँक खाते आणि e-KYC आवश्यक असू शकते."],
    pmfby: ["नैसर्गिक जोखमींमुळे झालेल्या ठरावीक पीक नुकसानीसाठी पीक विमा मदत करू शकतो. संरक्षण अधिसूचित पीक, क्षेत्र, हंगाम आणि पॉलिसीच्या अटींवर अवलंबून असते.", "विमा क्षेत्रातील अधिसूचित पिके घेणारे शेतकरी. अर्जापूर्वी पीक, गाव, मुदत आणि पॉलिसीच्या अटी तपासा."]
  }},
  gu: { eyebrow: "ખેડૂતો માટે સરકારી સહાય", title: "ખેડૂતો માટે યોજનાઓ", intro: "પસંદ કરેલી કેન્દ્રિય કૃષિ યોજનાઓ, તેમના લાભ અને પાત્રતા તપાસવા માટે સરળ માહિતી.", central: "કેન્દ્ર સરકાર", note: "પસંદ કરેલી યોજનાઓ: લાભ અને અરજીની રીત રાજ્ય, જિલ્લો, પાક અને પાત્રતા પ્રમાણે બદલાઈ શકે છે. સત્તાવાર લિંક્સ અથવા સ્થાનિક કૃષિ કચેરીમાં ખાતરી કરો.", who: "કોને લાભ મળી શકે?", official: "સત્તાવાર માહિતી અને અરજી", last: "યોજનાના નિયમો, તારીખો અને પાત્રતા બદલાઈ શકે છે. અરજી પહેલાં સત્તાવાર માહિતી તપાસો.", updates: "અપડેટ તપાસો", checking: "અપડેટ તપાસી રહ્યા છીએ", categories: { pmddky: "નવી યોજના · 2025", "pulses-mission": "નવી યોજના · 2025–26 થી 2030–31", "pm-kisan": "આવક સહાય", pmfby: "પાક સુરક્ષા" }, names: { pmddky: "પીએમ ધન-ધાન્ય કૃષિ યોજના", "pulses-mission": "કઠોળ આત્મનિર્ભરતા મિશન", "pm-kisan": "પીએમ-કિસાન આવક સહાય", pmfby: "પાક વીમો" }, schemes: {
    pmddky: ["ખેતી પર ધ્યાન આપતા પસંદ કરેલા 100 જિલ્લાઓ માટે વિકાસ કાર્યક્રમ. ઉત્પાદકતા, સિંચાઈ, સંગ્રહ, પાકની વિવિધતા અને ધિરાણની સુલભતા સુધારવાનો હેતુ છે.", "પસંદ કરેલા જિલ્લાઓના ખેડૂતો. તમારો જિલ્લો સામેલ છે કે નહીં અને સ્થાનિક સહાય શું છે તે જિલ્લા કૃષિ કચેરી અથવા કૃષિ વિજ્ઞાન કેન્દ્રમાં પૂછો."],
    "pulses-mission": ["તુવેર, અડદ અને મસૂર સહિત કઠોળની ખેતી માટે બિયારણ અને તાલીમ સહાય. ભાગ લેનારા રાજ્યોમાં નોંધાયેલા ખેડૂતો નિયમો અનુસાર MSP પર વેચાણ કરી શકે છે.", "કઠોળ ઉગાડતા ખેડૂતો, ખાસ કરીને તુવેર, અડદ અથવા મસૂર. બિયારણ સહાય અને નોંધણી માટે રાજ્ય કૃષિ વિભાગ, NAFED અથવા NCCF ને પૂછો."],
    "pm-kisan": ["પાત્ર જમીનધારક ખેડૂત પરિવારોને વર્ષે ₹6,000 મળી શકે છે. ₹2,000 ના ત્રણ હપ્તા સીધા બેંક ખાતામાં જમા થાય છે.", "યોજનાના બાકાત નિયમોને આધીન ખેતીલાયક જમીન ધરાવતા પાત્ર પરિવારો. આધાર સાથે જોડાયેલું બેંક ખાતું અને e-KYC જરૂરી હોઈ શકે છે."],
    pmfby: ["કુદરતી જોખમોથી થતા નિર્દિષ્ટ પાક નુકસાનમાં પાક વીમો મદદ કરી શકે છે. કવરેજ સૂચિત પાક, વિસ્તાર, મોસમ અને પોલિસીની શરતો પર આધાર રાખે છે.", "વીમાકૃત વિસ્તારમાં સૂચિત પાક ઉગાડતા ખેડૂતો. અરજી પહેલાં પાક, ગામ, સમયમર્યાદા અને પોલિસીની શરતો તપાસો."]
  }},
  kn: { eyebrow: "ರೈತರಿಗಾಗಿ ಸರ್ಕಾರಿ ನೆರವು", title: "ರೈತರ ಯೋಜನೆಗಳು", intro: "ಆಯ್ದ ಕೇಂದ್ರ ಕೃಷಿ ಯೋಜನೆಗಳು, ಅವುಗಳ ನೆರವು ಮತ್ತು ಅರ್ಹತೆ ಪರಿಶೀಲಿಸುವ ಸರಳ ಮಾಹಿತಿ.", central: "ಕೇಂದ್ರ ಸರ್ಕಾರ", note: "ಆಯ್ದ ಯೋಜನೆಗಳು: ನೆರವು ಮತ್ತು ಅರ್ಜಿ ವಿಧಾನ ರಾಜ್ಯ, ಜಿಲ್ಲೆ, ಬೆಳೆ ಮತ್ತು ಅರ್ಹತೆಯ ಮೇಲೆ ಬದಲಾಗಬಹುದು. ಅಧಿಕೃತ ಲಿಂಕ್ ಅಥವಾ ಸ್ಥಳೀಯ ಕೃಷಿ ಕಚೇರಿಯಲ್ಲಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.", who: "ಯಾರಿಗೆ ನೆರವು ಸಿಗಬಹುದು?", official: "ಅಧಿಕೃತ ವಿವರಗಳು ಮತ್ತು ಅರ್ಜಿ", last: "ಯೋಜನೆಯ ನಿಯಮ, ದಿನಾಂಕ, ಅರ್ಹತೆ ಬದಲಾಗಬಹುದು. ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.", updates: "ನವೀಕರಣ ಪರಿಶೀಲಿಸಿ", checking: "ನವೀಕರಣ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ", categories: { pmddky: "ಹೊಸ ಯೋಜನೆ · 2025", "pulses-mission": "ಹೊಸ ಯೋಜನೆ · 2025–26 ರಿಂದ 2030–31", "pm-kisan": "ಆದಾಯ ನೆರವು", pmfby: "ಬೆಳೆ ರಕ್ಷಣೆ" }, names: { pmddky: "ಪಿಎಂ ಧನ್-ಧಾನ್ಯ ಕೃಷಿ ಯೋಜನೆ", "pulses-mission": "ಬೇಳೆಕಾಳು ಸ್ವಾವಲಂಬನೆ ಮಿಷನ್", "pm-kisan": "ಪಿಎಂ-ಕಿಸಾನ್ ಆದಾಯ ನೆರವು", pmfby: "ಬೆಳೆ ವಿಮೆ" }, schemes: {
    pmddky: ["ಕೃಷಿಗೆ ಆದ್ಯತೆ ನೀಡಿರುವ ಆಯ್ದ 100 ಜಿಲ್ಲೆಗಳ ಅಭಿವೃದ್ಧಿ ಕಾರ್ಯಕ್ರಮ. ಉತ್ಪಾದಕತೆ, ನೀರಾವರಿ, ಸಂಗ್ರಹಣೆ, ಬೆಳೆ ವೈವಿಧ್ಯ ಮತ್ತು ಸಾಲ ಸೌಲಭ್ಯ ಹೆಚ್ಚಿಸುವ ಉದ್ದೇಶ ಹೊಂದಿದೆ.", "ಆಯ್ದ ಜಿಲ್ಲೆಗಳ ರೈತರು. ನಿಮ್ಮ ಜಿಲ್ಲೆ ಸೇರಿತೇ ಮತ್ತು ಸ್ಥಳೀಯವಾಗಿ ಯಾವ ನೆರವು ಸಿಗುತ್ತದೆ ಎಂದು ಜಿಲ್ಲಾ ಕೃಷಿ ಕಚೇರಿ ಅಥವಾ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದಲ್ಲಿ ಕೇಳಿ."],
    "pulses-mission": ["ತೊಗರಿ, ಉದ್ದು, ಮಸೂರ ಸೇರಿದಂತೆ ಬೇಳೆಕಾಳು ಬೆಳೆಯಲು ಬೀಜ ಮತ್ತು ತರಬೇತಿ ನೆರವು. ಭಾಗವಹಿಸುವ ರಾಜ್ಯಗಳ ನೋಂದಾಯಿತ ರೈತರು ನಿಯಮಗಳ ಪ್ರಕಾರ MSP ದರದಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬಹುದು.", "ಬೇಳೆಕಾಳು ಬೆಳೆಗಾರರು, ವಿಶೇಷವಾಗಿ ತೊಗರಿ, ಉದ್ದು ಅಥವಾ ಮಸೂರ ಬೆಳೆಗಾರರು. ಬೀಜ ನೆರವು ಮತ್ತು ನೋಂದಣಿಗೆ ರಾಜ್ಯ ಕೃಷಿ ಇಲಾಖೆ, NAFED ಅಥವಾ NCCF ಅನ್ನು ಸಂಪರ್ಕಿಸಿ."],
    "pm-kisan": ["ಅರ್ಹ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಸಿಗಬಹುದು. ₹2,000ರಂತೆ ಮೂರು ಕಂತುಗಳನ್ನು ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಮಾಡಲಾಗುತ್ತದೆ.", "ಯೋಜನೆಯ ಹೊರತಾಗುವ ನಿಯಮಗಳಿಗೆ ಒಳಪಟ್ಟಂತೆ ಕೃಷಿಯೋಗ್ಯ ಭೂಮಿ ಹೊಂದಿರುವ ಅರ್ಹ ಕುಟುಂಬಗಳು. ಆಧಾರ್ ಜೋಡಿಸಿದ ಬ್ಯಾಂಕ್ ಖಾತೆ ಮತ್ತು e-KYC ಬೇಕಾಗಬಹುದು."],
    pmfby: ["ನಿರ್ದಿಷ್ಟ ನೈಸರ್ಗಿಕ ಅಪಾಯಗಳಿಂದ ಉಂಟಾಗುವ ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ಬೆಳೆ ವಿಮೆ ನೆರವಾಗಬಹುದು. ರಕ್ಷಣೆ ಅಧಿಸೂಚಿತ ಬೆಳೆ, ಪ್ರದೇಶ, ಋತು ಮತ್ತು ಪಾಲಿಸಿಯ ನಿಯಮಗಳನ್ನು ಅವಲಂಬಿಸಿದೆ.", "ವಿಮೆ ವ್ಯಾಪ್ತಿಯ ಪ್ರದೇಶದಲ್ಲಿ ಅಧಿಸೂಚಿತ ಬೆಳೆ ಬೆಳೆಯುವ ರೈತರು. ಅರ್ಜಿ ಮೊದಲು ಬೆಳೆ, ಗ್ರಾಮ, ಅವಧಿ ಮತ್ತು ಪಾಲಿಸಿ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."]
  }},
  or: { eyebrow: "ଚାଷୀଙ୍କ ପାଇଁ ସରକାରୀ ସହାୟତା", title: "ଚାଷୀଙ୍କ ପାଇଁ ଯୋଜନା", intro: "ଚୟନିତ କେନ୍ଦ୍ରୀୟ କୃଷି ଯୋଜନା, ସେଗୁଡ଼ିକର ସହାୟତା ଏବଂ ଯୋଗ୍ୟତା ଯାଞ୍ଚ ପାଇଁ ସରଳ ସୂଚନା।", central: "କେନ୍ଦ୍ର ସରକାର", note: "ଚୟନିତ ଯୋଜନା: ସହାୟତା ଓ ଆବେଦନ ପଦ୍ଧତି ରାଜ୍ୟ, ଜିଲ୍ଲା, ଫସଲ ଓ ଯୋଗ୍ୟତା ଅନୁସାରେ ବଦଳିପାରେ। ସରକାରୀ ଲିଙ୍କ କିମ୍ବା ସ୍ଥାନୀୟ କୃଷି କାର୍ଯ୍ୟାଳୟରେ ନିଶ୍ଚିତ କରନ୍ତୁ।", who: "କାହାକୁ ସହାୟତା ମିଳିପାରେ?", official: "ସରକାରୀ ବିବରଣୀ ଓ ଆବେଦନ", last: "ଯୋଜନାର ନିୟମ, ତାରିଖ ଓ ଯୋଗ୍ୟତା ବଦଳିପାରେ। ଆବେଦନ ପୂର୍ବରୁ ସରକାରୀ ସୂଚନା ଯାଞ୍ଚ କରନ୍ତୁ।", updates: "ଅପଡେଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ", checking: "ଅପଡେଟ୍ ଯାଞ୍ଚ ହେଉଛି", categories: { pmddky: "ନୂଆ ଯୋଜନା · 2025", "pulses-mission": "ନୂଆ ଯୋଜନା · 2025–26 ରୁ 2030–31", "pm-kisan": "ଆୟ ସହାୟତା", pmfby: "ଫସଲ ସୁରକ୍ଷା" }, names: { pmddky: "ପ୍ରଧାନମନ୍ତ୍ରୀ ଧନ-ଧାନ୍ୟ କୃଷି ଯୋଜନା", "pulses-mission": "ଡାଲି ଆତ୍ମନିର୍ଭରତା ମିଶନ", "pm-kisan": "ପିଏମ-କିସାନ ଆୟ ସହାୟତା", pmfby: "ଫସଲ ବୀମା" }, schemes: {
    pmddky: ["କୃଷିକୁ ଗୁରୁତ୍ୱ ଦେଉଥିବା ଚୟନିତ 100ଟି ଜିଲ୍ଲା ପାଇଁ ବିକାଶ କାର୍ଯ୍ୟକ୍ରମ। ଉତ୍ପାଦନ, ଜଳସେଚନ, ସଂରକ୍ଷଣ, ଫସଲ ବିବିଧତା ଓ ଋଣ ସୁବିଧାକୁ ଉନ୍ନତ କରିବା ଏହାର ଲକ୍ଷ୍ୟ।", "ଚୟନିତ ଜିଲ୍ଲାର ଚାଷୀ। ଆପଣଙ୍କ ଜିଲ୍ଲା ଅନ୍ତର୍ଭୁକ୍ତ କି ନାହିଁ ଏବଂ ସ୍ଥାନୀୟ ସହାୟତା କ’ଣ, ଜିଲ୍ଲା କୃଷି କାର୍ଯ୍ୟାଳୟ କିମ୍ବା କୃଷି ବିଜ୍ଞାନ କେନ୍ଦ୍ରରେ ପଚାରନ୍ତୁ।"],
    "pulses-mission": ["ହରଡ଼, ବିରି ଓ ମସୁର ସହ ଡାଲି ଚାଷ ବଢ଼ାଇବା ପାଇଁ ବିହନ ଓ ତାଲିମ ସହାୟତା। ଅଂଶଗ୍ରହଣକାରୀ ରାଜ୍ୟର ପଞ୍ଜୀକୃତ ଚାଷୀ ନିୟମ ଅନୁସାରେ MSP ରେ ବିକ୍ରି କରିପାରିବେ।", "ଡାଲି ଚାଷୀ, ବିଶେଷକରି ହରଡ଼, ବିରି କିମ୍ବା ମସୁର ଚାଷୀ। ବିହନ ସହାୟତା ଓ ପଞ୍ଜୀକରଣ ପାଇଁ ରାଜ୍ୟ କୃଷି ବିଭାଗ, NAFED କିମ୍ବା NCCF କୁ ପଚାରନ୍ତୁ।"],
    "pm-kisan": ["ଯୋଗ୍ୟ ଜମି ଥିବା ଚାଷୀ ପରିବାର ବର୍ଷକୁ ₹6,000 ପାଇପାରନ୍ତି। ₹2,000ର ତିନୋଟି କିସ୍ତି ସିଧା ବ୍ୟାଙ୍କ ଖାତାକୁ ଦିଆଯାଏ।", "ଯୋଜନାର ବାଦ ନିୟମ ଅନୁସାରେ ଚାଷଯୋଗ୍ୟ ଜମି ଥିବା ଯୋଗ୍ୟ ପରିବାର। ଆଧାର ସଂଯୁକ୍ତ ବ୍ୟାଙ୍କ ଖାତା ଓ e-KYC ଆବଶ୍ୟକ ହୋଇପାରେ।"],
    pmfby: ["ନିର୍ଦ୍ଦିଷ୍ଟ ପ୍ରାକୃତିକ ବିପଦରୁ ଫସଲ କ୍ଷତି ହେଲେ ଫସଲ ବୀମା ସହାୟତା କରିପାରେ। ସୁରକ୍ଷା ଘୋଷିତ ଫସଲ, ଅଞ୍ଚଳ, ଋତୁ ଓ ପଲିସି ନିୟମ ଉପରେ ନିର୍ଭର କରେ।", "ବୀମା ଅଞ୍ଚଳରେ ଘୋଷିତ ଫସଲ ଚାଷ କରୁଥିବା ଚାଷୀ। ଆବେଦନ ପୂର୍ବରୁ ଫସଲ, ଗାଁ, ସମୟସୀମା ଓ ପଲିସି ନିୟମ ଯାଞ୍ଚ କରନ୍ତୁ।"]
  }}
};

// Plain-language starter listings. API results replace these when the schemes endpoint is connected.
const featuredSchemes = [
  {
    id: "pmddky",
    name: "Prime Minister Dhan-Dhaanya Krishi Yojana",
    shortName: "PM Dhan-Dhaanya Krishi Yojana",
    category: "New programme · 2025",
    summary: "A development programme for 100 selected agriculture-focused districts. It brings existing government support together to improve farm productivity, irrigation, storage, crop variety, and access to credit.",
    whoCanBenefit: "Farmers in the selected districts. Ask your district agriculture office or Krishi Vigyan Kendra whether your district is included and what support is available locally.",
    image: "/scheme-pmddky.jpg",
    imageAlt: "Irrigation and crop cultivation in a farm field",
    officialUrl: "https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2145147&lang=2&reg=48",
    sourceLabel: "Government scheme details"
  },
  {
    id: "pulses-mission",
    name: "Mission for Aatmanirbharta in Pulses",
    shortName: "Self-Reliance in Pulses Mission",
    category: "New programme · 2025–26 to 2030–31",
    summary: "Support to grow more pulses, including Tur, Urad, and Masoor. The mission includes improved seeds and training. Registered farmers in participating states may offer these crops for government procurement at MSP, subject to the programme rules.",
    whoCanBenefit: "Farmers growing pulses, especially Tur, Urad, or Masoor. Ask your state agriculture department, NAFED, or NCCF about seed support and farmer registration in your area.",
    image: "/scheme-pulses.jpg",
    imageAlt: "Chickpea field in Tamil Nadu",
    officialUrl: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2173547&lang=2&reg=48",
    sourceLabel: "Government mission details"
  },
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    shortName: "PM-KISAN income support",
    category: "Income support",
    summary: "Eligible landholding farmer families can receive ₹6,000 per year, paid directly to the bank account in three instalments of ₹2,000.",
    whoCanBenefit: "Eligible farmer families with cultivable land, subject to the scheme’s exclusion rules. Aadhaar-linked bank details and e-KYC may be needed to receive payments.",
    image: "/scheme-pmkisan.jpg",
    imageAlt: "A farmer viewing cultivated land",
    officialUrl: "https://pmkisan.gov.in/",
    sourceLabel: "Check eligibility and payment status"
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    shortName: "Crop insurance",
    category: "Crop protection",
    summary: "Crop insurance that can help protect farmers against specified crop losses, such as losses from natural risks. Coverage depends on the notified crop, area, season, and policy conditions.",
    whoCanBenefit: "Farmers growing notified crops in an insured area. Check whether your crop and village are covered, the enrolment window, and the policy terms before applying.",
    image: "/scheme-pmfby.jpg",
    imageAlt: "A farmer using a phone in a cultivated field",
    officialUrl: "https://pmfby.gov.in/",
    sourceLabel: "Check coverage and apply"
  }
];

function SchemeCard({ scheme, index, copy }) {
  const image = scheme.image || scheme.imageUrl || featuredSchemes[index % featuredSchemes.length].image;
  const localizedDetails = copy.schemes[scheme.id];
  const summary = localizedDetails?.[0] || scheme.summary || scheme.description || scheme.benefits || "Read the official scheme information to learn about its support and eligibility.";
  const whoCanBenefit = localizedDetails?.[1] || scheme.whoCanBenefit;
  const officialUrl = scheme.officialUrl || scheme.url;
  const displayName = copy.names[scheme.id] || scheme.shortName || scheme.name;
  const category = copy.categories[scheme.id] || scheme.category || "Government scheme";

  return <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
    <div>
      <img src={image} alt={scheme.imageAlt || `${displayName} agriculture scheme`} className="h-56 w-full object-cover sm:h-64 md:h-72" loading="lazy" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">{category}</span>
          {scheme.state && <span className="flex items-center gap-1 text-sm text-gray-500"><MapPin size={16}/>{scheme.state}</span>}
        </div>
        <h2 className="mt-4 text-2xl font-extrabold leading-snug text-gray-950 sm:text-3xl">{displayName}</h2>
        <p className="mt-3 text-base leading-7 text-gray-700">{summary}</p>
        {whoCanBenefit && <div className="mt-4 rounded-xl bg-emerald-50/70 p-4">
          <h3 className="flex items-center gap-2 text-base font-extrabold text-emerald-950"><Sprout size={19}/>{copy.who}</h3>
          <p className="mt-1 text-base leading-7 text-emerald-950/80">{whoCanBenefit}</p>
        </div>}
        {(scheme.benefit || scheme.amount) && <p className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950"><BadgeIndianRupee size={18}/>{scheme.benefit || scheme.amount}</p>}
        {officialUrl && <a href={officialUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2 text-base font-bold text-white transition hover:bg-emerald-900">{copy.official}<ExternalLink size={17}/></a>}
      </div>
    </div>
  </article>;
}

export default function AvailableSchemes() {
  const { i18n } = useTranslation();
  const copy = pageCopy[i18n.resolvedLanguage] || pageCopy.en;
  const [schemes, setSchemes] = useState(featuredSchemes);
  const [usingFeatured, setUsingFeatured] = useState(true);
  const [loading, setLoading] = useState(true);

  async function loadSchemes() {
    setLoading(true);
    try {
      const { data } = await api.get("/schemes");
      const apiSchemes = Array.isArray(data) ? data : data.schemes || [];
      if (apiSchemes.length) {
        setSchemes(apiSchemes);
        setUsingFeatured(false);
      } else {
        setSchemes(featuredSchemes);
        setUsingFeatured(true);
      }
    } catch {
      setSchemes(featuredSchemes);
      setUsingFeatured(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSchemes(); }, []);

  return <section className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-sm font-extrabold uppercase tracking-[.14em] text-emerald-700">{copy.eyebrow}</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-gray-600">{copy.intro}</p>
      </div>
      <div className="flex items-center gap-2 text-base text-gray-500"><MapPin size={18}/>{copy.central}</div>
    </div>

    {usingFeatured && <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-base leading-7 text-blue-950">
      <ShieldCheck className="mt-0.5 shrink-0" size={19}/>
      <p>{copy.note}</p>
    </div>}

    <div className="mt-6 space-y-5" aria-live="polite">
      {schemes.map((scheme, index) => <SchemeCard key={scheme.id || scheme.name || index} scheme={scheme} index={index} copy={copy}/>) }
    </div>

    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-base leading-7 text-gray-600">
      <p className="flex min-w-0 items-start gap-2"><ArrowUpRight className="mt-1 shrink-0 text-emerald-700" size={19}/><span>{copy.last}</span></p>
      {usingFeatured && <button onClick={loadSchemes} disabled={loading} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-60"><RefreshCw className={loading ? "animate-spin" : ""} size={17}/>{loading ? copy.checking : copy.updates}</button>}
    </div>
  </section>;
}
