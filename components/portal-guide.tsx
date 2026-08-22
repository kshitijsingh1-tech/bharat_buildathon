'use client'

import Link from 'next/link'
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  IndianRupee,
  MapPinned,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useUiPreferences } from '@/components/ui-preferences'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ data */

type DocumentInfo = {
  id: string
  en: string
  hi: string
  portalName: string
  portalUrl: string
  stepsEn: string[]
  stepsHi: string[]
  requiredDocsEn: string[]
  requiredDocsHi: string[]
  feeEn: string
  feeHi: string
  timeEn: string
  timeHi: string
}

const documents: DocumentInfo[] = [
  {
    id: 'aadhaar',
    en: 'Aadhaar Card',
    hi: 'आधार कार्ड',
    portalName: 'UIDAI',
    portalUrl: 'https://uidai.gov.in',
    stepsEn: [
      'Visit your nearest Aadhaar Enrolment Centre or book online appointment at uidai.gov.in.',
      'Carry proof of identity (passport, voter ID, ration card) and proof of address.',
      'Biometric data (fingerprints, iris scan, photograph) will be captured at the centre.',
      'You will receive an acknowledgement slip with a 14-digit Enrolment ID.',
      'Download e-Aadhaar from uidai.gov.in within 90 days using Enrolment ID.',
    ],
    stepsHi: [
      'अपने निकटतम आधार नामांकन केंद्र पर जाएँ या uidai.gov.in पर ऑनलाइन अपॉइंटमेंट बुक करें।',
      'पहचान प्रमाण (पासपोर्ट, वोटर ID, राशन कार्ड) और पता प्रमाण साथ लाएँ।',
      'केंद्र पर बायोमेट्रिक डेटा (उंगलियों के निशान, आँख की पुतली स्कैन, फोटो) लिया जाएगा।',
      'आपको 14 अंकों की नामांकन ID वाली पावती पर्ची मिलेगी।',
      '90 दिनों के भीतर नामांकन ID का उपयोग करके uidai.gov.in से e-Aadhaar डाउनलोड करें।',
    ],
    requiredDocsEn: ['Proof of identity (any government ID)', 'Proof of address', 'Proof of date of birth'],
    requiredDocsHi: ['पहचान प्रमाण (कोई सरकारी ID)', 'पता प्रमाण', 'जन्मतिथि प्रमाण'],
    feeEn: 'Free',
    feeHi: 'निःशुल्क',
    timeEn: '~90 days',
    timeHi: '~90 दिन',
  },
  {
    id: 'income-cert',
    en: 'Income Certificate',
    hi: 'आय प्रमाण पत्र',
    portalName: 'ServicePlus / eDistrict',
    portalUrl: 'https://serviceonline.gov.in',
    stepsEn: [
      'Register on your state\'s eDistrict / ServicePlus portal (serviceonline.gov.in).',
      'Log in and select "Income Certificate" under Revenue services.',
      'Fill in family income details and upload supporting documents.',
      'Pay the application fee online (₹10–₹50 depending on state).',
      'Your application goes to the Tehsildar for verification. Track status online.',
      'Collect the certificate from the Tehsil office or download digitally.',
    ],
    stepsHi: [
      'अपने राज्य के eDistrict / ServicePlus पोर्टल (serviceonline.gov.in) पर रजिस्टर करें।',
      'लॉग इन करें और राजस्व सेवाओं में "आय प्रमाण पत्र" चुनें।',
      'पारिवारिक आय विवरण भरें और सहायक दस्तावेज़ अपलोड करें।',
      'ऑनलाइन आवेदन शुल्क भुगतान करें (₹10–₹50 राज्य अनुसार)।',
      'आपका आवेदन सत्यापन के लिए तहसीलदार के पास जाएगा। स्थिति ऑनलाइन ट्रैक करें।',
      'प्रमाण पत्र तहसील कार्यालय से लें या डिजिटल रूप से डाउनलोड करें।',
    ],
    requiredDocsEn: ['Aadhaar card', 'Ration card', 'Self-declaration of income', 'Bank statement (optional)'],
    requiredDocsHi: ['आधार कार्ड', 'राशन कार्ड', 'आय का स्व-घोषणा पत्र', 'बैंक स्टेटमेंट (वैकल्पिक)'],
    feeEn: '₹10–₹50',
    feeHi: '₹10–₹50',
    timeEn: '7–15 working days',
    timeHi: '7–15 कार्य दिवस',
  },
  {
    id: 'residence-cert',
    en: 'Residence Certificate',
    hi: 'निवास प्रमाण पत्र',
    portalName: 'ServicePlus / eDistrict',
    portalUrl: 'https://serviceonline.gov.in',
    stepsEn: [
      'Register on serviceonline.gov.in or your state\'s eDistrict portal.',
      'Select "Residence/Domicile Certificate" under the relevant department.',
      'Fill in your address details and upload Aadhaar, ration card, or utility bill.',
      'Pay the nominal fee online.',
      'After field verification by a patwari/revenue officer, the certificate is issued.',
    ],
    stepsHi: [
      'serviceonline.gov.in या अपने राज्य के eDistrict पोर्टल पर रजिस्टर करें।',
      'संबंधित विभाग में "निवास/अधिवास प्रमाण पत्र" चुनें।',
      'अपने पते का विवरण भरें और आधार, राशन कार्ड या बिजली बिल अपलोड करें।',
      'ऑनलाइन नाममात्र शुल्क भुगतान करें।',
      'पटवारी/राजस्व अधिकारी द्वारा क्षेत्र सत्यापन के बाद प्रमाण पत्र जारी किया जाएगा।',
    ],
    requiredDocsEn: ['Aadhaar card', 'Ration card or utility bill', 'Self-attested affidavit'],
    requiredDocsHi: ['आधार कार्ड', 'राशन कार्ड या बिजली बिल', 'स्व-प्रमाणित शपथ पत्र'],
    feeEn: '₹10–₹30',
    feeHi: '₹10–₹30',
    timeEn: '7–21 working days',
    timeHi: '7–21 कार्य दिवस',
  },
  {
    id: 'caste-cert',
    en: 'Caste / Category Certificate',
    hi: 'जाति / श्रेणी प्रमाण पत्र',
    portalName: 'ServicePlus / eDistrict',
    portalUrl: 'https://serviceonline.gov.in',
    stepsEn: [
      'Apply on your state eDistrict portal or visit the Tehsil/SDM office.',
      'Submit proof of caste (father\'s caste certificate or family register entry).',
      'Upload Aadhaar and residence proof.',
      'A field inquiry will be conducted by the revenue officer.',
      'Certificate issued after verification, valid across the state.',
    ],
    stepsHi: [
      'अपने राज्य के eDistrict पोर्टल पर आवेदन करें या तहसील/SDM कार्यालय जाएँ।',
      'जाति का प्रमाण जमा करें (पिताजी का जाति प्रमाण पत्र या परिवार रजिस्टर प्रविष्टि)।',
      'आधार और निवास प्रमाण अपलोड करें।',
      'राजस्व अधिकारी द्वारा क्षेत्र जाँच की जाएगी।',
      'सत्यापन के बाद प्रमाण पत्र जारी किया जाएगा, पूरे राज्य में मान्य।',
    ],
    requiredDocsEn: ['Aadhaar card', 'Father\'s caste certificate', 'Residence proof', 'School leaving certificate'],
    requiredDocsHi: ['आधार कार्ड', 'पिता का जाति प्रमाण पत्र', 'निवास प्रमाण', 'स्कूल छोड़ने का प्रमाण पत्र'],
    feeEn: '₹10–₹50',
    feeHi: '₹10–₹50',
    timeEn: '15–30 working days',
    timeHi: '15–30 कार्य दिवस',
  },
  {
    id: 'bank-account',
    en: 'Bank Account (Jan Dhan)',
    hi: 'बैंक खाता (जन धन)',
    portalName: 'PM Jan Dhan Yojana',
    portalUrl: 'https://pmjdy.gov.in',
    stepsEn: [
      'Visit any bank branch or Banking Correspondent (BC) point near you.',
      'Ask for a PMJDY (Jan Dhan) account opening form — it\'s free.',
      'Provide Aadhaar card or any two documents (voter ID + ration card, etc.).',
      'No minimum balance required. You get a RuPay debit card and passbook.',
      'Activate mobile banking by linking your phone number at the branch.',
    ],
    stepsHi: [
      'अपने पास की किसी भी बैंक शाखा या बैंकिंग कॉरेस्पोंडेंट (BC) पॉइंट पर जाएँ।',
      'PMJDY (जन धन) खाता खोलने का फॉर्म माँगें — यह निःशुल्क है।',
      'आधार कार्ड या कोई दो दस्तावेज़ (वोटर ID + राशन कार्ड, आदि) दें।',
      'कोई न्यूनतम शेष आवश्यक नहीं। आपको RuPay डेबिट कार्ड और पासबुक मिलेगी।',
      'शाखा में अपना फोन नंबर लिंक करके मोबाइल बैंकिंग एक्टिवेट करें।',
    ],
    requiredDocsEn: ['Aadhaar card', 'Or any 2 govt IDs (voter ID, ration card, driving license)'],
    requiredDocsHi: ['आधार कार्ड', 'या कोई 2 सरकारी ID (वोटर ID, राशन कार्ड, ड्राइविंग लाइसेंस)'],
    feeEn: 'Free',
    feeHi: 'निःशुल्क',
    timeEn: 'Same day',
    timeHi: 'उसी दिन',
  },
  {
    id: 'passport',
    en: 'Passport',
    hi: 'पासपोर्ट',
    portalName: 'Passport Seva',
    portalUrl: 'https://passportindia.gov.in',
    stepsEn: [
      'Register on passportindia.gov.in and create a login.',
      'Fill the passport application form online and pay the fee (₹1,500 for normal).',
      'Book an appointment at the nearest Passport Seva Kendra (PSK).',
      'Visit the PSK on appointment date with original documents.',
      'Police verification will be conducted at your residence.',
      'Passport dispatched via Speed Post after verification clearance.',
    ],
    stepsHi: [
      'passportindia.gov.in पर रजिस्टर करें और लॉगिन बनाएँ।',
      'ऑनलाइन पासपोर्ट आवेदन फॉर्म भरें और शुल्क भुगतान करें (सामान्य के लिए ₹1,500)।',
      'निकटतम पासपोर्ट सेवा केंद्र (PSK) पर अपॉइंटमेंट बुक करें।',
      'अपॉइंटमेंट की तारीख पर मूल दस्तावेज़ों के साथ PSK जाएँ।',
      'आपके निवास पर पुलिस सत्यापन किया जाएगा।',
      'सत्यापन मंज़ूरी के बाद स्पीड पोस्ट द्वारा पासपोर्ट भेजा जाएगा।',
    ],
    requiredDocsEn: ['Aadhaar card', 'Birth certificate or matriculation certificate', 'Address proof', 'Passport-size photos'],
    requiredDocsHi: ['आधार कार्ड', 'जन्म प्रमाण पत्र या मैट्रिक प्रमाण पत्र', 'पता प्रमाण', 'पासपोर्ट साइज़ फोटो'],
    feeEn: '₹1,500 (normal) / ₹3,500 (tatkal)',
    feeHi: '₹1,500 (सामान्य) / ₹3,500 (तत्काल)',
    timeEn: '15–45 days',
    timeHi: '15–45 दिन',
  },
  {
    id: 'pan-card',
    en: 'PAN Card',
    hi: 'पैन कार्ड',
    portalName: 'NSDL / UTIITSL',
    portalUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    stepsEn: [
      'Visit onlineservices.nsdl.com or utiitsl.com to apply for PAN.',
      'Select "New PAN – Indian Citizen (Form 49A)" and fill the form.',
      'Upload photo, signature and proof documents, or post physical copies.',
      'Pay ₹107 (e-PAN) or ₹72 (physical card dispatch fee extra).',
      'e-PAN delivered to registered email within 48 hours. Physical card in 15–20 days.',
    ],
    stepsHi: [
      'PAN के लिए onlineservices.nsdl.com या utiitsl.com पर जाएँ।',
      '"नया PAN – भारतीय नागरिक (फॉर्म 49A)" चुनें और फॉर्म भरें।',
      'फोटो, हस्ताक्षर और प्रमाण दस्तावेज़ अपलोड करें, या भौतिक कॉपी डाक से भेजें।',
      '₹107 (e-PAN) या ₹72 (भौतिक कार्ड डिस्पैच शुल्क अलग) भुगतान करें।',
      'e-PAN 48 घंटे में रजिस्टर्ड ईमेल पर। भौतिक कार्ड 15–20 दिनों में।',
    ],
    requiredDocsEn: ['Aadhaar card', 'Passport-size photo', 'Signature scan'],
    requiredDocsHi: ['आधार कार्ड', 'पासपोर्ट साइज़ फोटो', 'हस्ताक्षर स्कैन'],
    feeEn: '₹107 (e-PAN)',
    feeHi: '₹107 (e-PAN)',
    timeEn: '48 hours (e-PAN) / 15–20 days (physical)',
    timeHi: '48 घंटे (e-PAN) / 15–20 दिन (भौतिक)',
  },
  {
    id: 'ration-card',
    en: 'Ration Card',
    hi: 'राशन कार्ड',
    portalName: 'NFSA / One Nation One Ration',
    portalUrl: 'https://nfsa.gov.in',
    stepsEn: [
      'Apply on your state\'s Food & Civil Supplies portal or visit the nearest ration office.',
      'Fill the application form with family member details.',
      'Submit Aadhaar of all family members, income proof, and address proof.',
      'A field verification will be done by the supply inspector.',
      'Ration card issued and linked to nearest Fair Price Shop.',
    ],
    stepsHi: [
      'अपने राज्य के खाद्य एवं नागरिक आपूर्ति पोर्टल पर आवेदन करें या निकटतम राशन कार्यालय जाएँ।',
      'परिवार के सदस्यों के विवरण के साथ आवेदन फॉर्म भरें।',
      'सभी परिवार सदस्यों का आधार, आय प्रमाण और पता प्रमाण जमा करें।',
      'आपूर्ति निरीक्षक द्वारा क्षेत्र सत्यापन किया जाएगा।',
      'राशन कार्ड जारी होगा और निकटतम उचित मूल्य दुकान से जोड़ा जाएगा।',
    ],
    requiredDocsEn: ['Aadhaar of all family members', 'Income certificate', 'Address proof', 'Passport-size photos'],
    requiredDocsHi: ['सभी परिवार सदस्यों का आधार', 'आय प्रमाण पत्र', 'पता प्रमाण', 'पासपोर्ट साइज़ फोटो'],
    feeEn: 'Free',
    feeHi: 'निःशुल्क',
    timeEn: '15–30 days',
    timeHi: '15–30 दिन',
  },
  {
    id: 'voter-id',
    en: 'Voter ID (EPIC)',
    hi: 'वोटर ID (EPIC)',
    portalName: 'NVSP',
    portalUrl: 'https://voters.eci.gov.in',
    stepsEn: [
      'Visit voters.eci.gov.in and register as a new voter.',
      'Fill Form 6 online with personal details and upload photo.',
      'Submit supporting documents (age proof, address proof).',
      'After BLO (Booth Level Officer) verification at your address, you are added to voter roll.',
      'EPIC card dispatched to your registered address.',
    ],
    stepsHi: [
      'voters.eci.gov.in पर जाएँ और नए मतदाता के रूप में रजिस्टर करें।',
      'व्यक्तिगत विवरण के साथ ऑनलाइन फॉर्म 6 भरें और फोटो अपलोड करें।',
      'सहायक दस्तावेज़ (आयु प्रमाण, पता प्रमाण) जमा करें।',
      'आपके पते पर BLO (बूथ स्तरीय अधिकारी) सत्यापन के बाद, मतदाता सूची में जोड़ा जाएगा।',
      'EPIC कार्ड आपके रजिस्टर्ड पते पर भेजा जाएगा।',
    ],
    requiredDocsEn: ['Age proof (birth certificate, marksheet)', 'Address proof', 'Passport-size photo'],
    requiredDocsHi: ['आयु प्रमाण (जन्म प्रमाण पत्र, अंकसूची)', 'पता प्रमाण', 'पासपोर्ट साइज़ फोटो'],
    feeEn: 'Free',
    feeHi: 'निःशुल्क',
    timeEn: '15–30 days',
    timeHi: '15–30 दिन',
  },
  {
    id: 'driving-license',
    en: 'Driving License',
    hi: 'ड्राइविंग लाइसेंस',
    portalName: 'Parivahan',
    portalUrl: 'https://parivahan.gov.in',
    stepsEn: [
      'Visit parivahan.gov.in → "Online Services" → "Driving License Related Services".',
      'First apply for a Learner\'s License — fill form, pay ₹200, book test slot.',
      'Pass the online test at RTO and receive your Learner\'s License.',
      'After 30 days (or 6 months for commercial), apply for permanent DL.',
      'Pass the driving test at RTO. DL dispatched via post.',
    ],
    stepsHi: [
      'parivahan.gov.in → "ऑनलाइन सेवाएँ" → "ड्राइविंग लाइसेंस संबंधित सेवाएँ" पर जाएँ।',
      'पहले लर्नर\'s लाइसेंस के लिए आवेदन करें — फॉर्म भरें, ₹200 भुगतान करें, टेस्ट स्लॉट बुक करें।',
      'RTO पर ऑनलाइन परीक्षा उत्तीर्ण करें और लर्नर\'s लाइसेंस प्राप्त करें।',
      '30 दिन बाद (या व्यावसायिक के लिए 6 महीने), स्थायी DL के लिए आवेदन करें।',
      'RTO पर ड्राइविंग टेस्ट उत्तीर्ण करें। DL डाक से भेजा जाएगा।',
    ],
    requiredDocsEn: ['Aadhaar card', 'Address proof', 'Age proof', 'Medical certificate (for commercial)', 'Passport-size photos'],
    requiredDocsHi: ['आधार कार्ड', 'पता प्रमाण', 'आयु प्रमाण', 'चिकित्सा प्रमाण पत्र (व्यावसायिक के लिए)', 'पासपोर्ट साइज़ फोटो'],
    feeEn: '₹200 (learner) + ₹300 (permanent)',
    feeHi: '₹200 (लर्नर) + ₹300 (स्थायी)',
    timeEn: '30+ days',
    timeHi: '30+ दिन',
  },
  {
    id: 'birth-cert',
    en: 'Birth Certificate',
    hi: 'जन्म प्रमाण पत्र',
    portalName: 'CRS India',
    portalUrl: 'https://crsorgi.gov.in',
    stepsEn: [
      'Visit crsorgi.gov.in or your municipal corporation / panchayat office.',
      'Fill the birth registration form (Form 1).',
      'Submit hospital discharge summary or birth record from the hospital.',
      'For delayed registration (after 1 year), an affidavit and magistrate order may be needed.',
      'Certificate issued by the Registrar of Births and Deaths.',
    ],
    stepsHi: [
      'crsorgi.gov.in या अपने नगर निगम / पंचायत कार्यालय पर जाएँ।',
      'जन्म पंजीकरण फॉर्म (फॉर्म 1) भरें।',
      'अस्पताल का डिस्चार्ज सारांश या अस्पताल से जन्म रिकॉर्ड जमा करें।',
      'विलंबित पंजीकरण (1 वर्ष के बाद) के लिए शपथ पत्र और मजिस्ट्रेट आदेश आवश्यक हो सकता है।',
      'जन्म और मृत्यु रजिस्ट्रार द्वारा प्रमाण पत्र जारी किया जाता है।',
    ],
    requiredDocsEn: ['Hospital birth record / discharge slip', 'Parents\' Aadhaar', 'Marriage certificate of parents', 'Address proof'],
    requiredDocsHi: ['अस्पताल जन्म रिकॉर्ड / डिस्चार्ज पर्ची', 'माता-पिता का आधार', 'माता-पिता का विवाह प्रमाण पत्र', 'पता प्रमाण'],
    feeEn: 'Free (within 21 days) / ₹5–₹50 (delayed)',
    feeHi: 'निःशुल्क (21 दिन के भीतर) / ₹5–₹50 (विलंबित)',
    timeEn: '7–14 days',
    timeHi: '7–14 दिन',
  },
  {
    id: 'land-record',
    en: 'Land Record (Bhulekh)',
    hi: 'भूमि रिकॉर्ड (भूलेख)',
    portalName: 'State Bhulekh portals',
    portalUrl: 'https://bhulekh.up.nic.in',
    stepsEn: [
      'Visit your state\'s Bhulekh / land records portal (e.g., bhulekh.up.nic.in for UP).',
      'Search by Khasra/Gata number, owner name, or Khata number.',
      'Download or print the land record / Khatoni / 7/12 extract.',
      'For mutation (name change), apply at the Tehsil office with sale deed.',
      'Revenue officer verifies and updates the land record.',
    ],
    stepsHi: [
      'अपने राज्य के भूलेख / भूमि रिकॉर्ड पोर्टल पर जाएँ (जैसे UP के लिए bhulekh.up.nic.in)।',
      'खसरा/गाटा नंबर, मालिक नाम या खाता नंबर से खोजें।',
      'भूमि रिकॉर्ड / खतौनी / 7/12 उद्धरण डाउनलोड या प्रिंट करें।',
      'नामांतरण (नाम बदलने) के लिए बिक्री विलेख के साथ तहसील कार्यालय में आवेदन करें।',
      'राजस्व अधिकारी सत्यापित करेगा और भूमि रिकॉर्ड अपडेट करेगा।',
    ],
    requiredDocsEn: ['Aadhaar card', 'Previous land records / Khatoni', 'Sale deed (for mutation)'],
    requiredDocsHi: ['आधार कार्ड', 'पुराने भूमि रिकॉर्ड / खतौनी', 'बिक्री विलेख (नामांतरण के लिए)'],
    feeEn: 'Free (viewing) / ₹25–₹100 (certified copy)',
    feeHi: 'निःशुल्क (देखने के लिए) / ₹25–₹100 (प्रमाणित कॉपी)',
    timeEn: 'Instant (online) / 7–15 days (mutation)',
    timeHi: 'तुरंत (ऑनलाइन) / 7–15 दिन (नामांतरण)',
  },
]

/* ------------------------------------------------- chatbot response matcher */

type ChatMsg = { id: string; role: 'user' | 'sarthi'; text: string; docId?: string }

function findDocumentMatch(input: string): DocumentInfo | null {
  const lower = input.toLowerCase()
  const keywords: Record<string, string[]> = {
    aadhaar: ['aadhaar', 'aadhar', 'uidai', 'आधार'],
    'income-cert': ['income', 'आय', 'salary', 'income certificate', 'आय प्रमाण'],
    'residence-cert': ['residence', 'domicile', 'निवास', 'address proof', 'पता प्रमाण'],
    'caste-cert': ['caste', 'category', 'obc', 'sc', 'st', 'जाति', 'श्रेणी', 'caste certificate'],
    'bank-account': ['bank', 'jan dhan', 'account', 'बैंक', 'खाता', 'जन धन', 'passbook'],
    passport: ['passport', 'पासपोर्ट'],
    'pan-card': ['pan', 'पैन', 'pan card'],
    'ration-card': ['ration', 'राशन', 'ration card', 'bpl', 'apl'],
    'voter-id': ['voter', 'epic', 'election', 'वोटर', 'मतदाता'],
    'driving-license': ['driving', 'license', 'licence', 'dl', 'ड्राइविंग', 'लाइसेंस'],
    'birth-cert': ['birth', 'जन्म', 'birth certificate'],
    'land-record': ['land', 'bhulekh', 'khatoni', 'khasra', 'भूमि', 'भूलेख', 'खतौनी', 'जमीन'],
  }
  for (const [docId, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) {
      return documents.find((d) => d.id === docId) ?? null
    }
  }
  return null
}

/* ================================================ COMPONENT =============== */

export function PortalGuide({ fullScreen = false, onClose }: { fullScreen?: boolean; onClose?: () => void }) {
  const { language } = useUiPreferences()
  const hi = language === 'hi'
  const [checked, setChecked] = useState<string[]>([])
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  const missing = documents.filter((doc) => !checked.includes(doc.id))
  const toggle = (id: string) =>
    setChecked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleChatSend = (raw?: string) => {
    const text = (raw ?? chatInput).trim()
    if (!text) return
    setChatInput('')

    const userMsg: ChatMsg = { id: `u${Date.now()}`, role: 'user', text }
    setChatMessages((prev) => [...prev, userMsg])

    // Simulate response
    setTimeout(() => {
      const match = findDocumentMatch(text)
      if (match) {
        const reply: ChatMsg = {
          id: `s${Date.now()}`,
          role: 'sarthi',
          text: hi
            ? `मैंने "${match.hi}" के लिए पूरी जानकारी तैयार की है। नीचे स्टेप-बाय-स्टेप प्रक्रिया देखें:`
            : `I've prepared complete guidance for "${match.en}". See the step-by-step process below:`,
          docId: match.id,
        }
        setChatMessages((prev) => [...prev, reply])
        setExpandedDoc(match.id)
      } else {
        const reply: ChatMsg = {
          id: `s${Date.now()}`,
          role: 'sarthi',
          text: hi
            ? 'कृपया बताएँ कि आपको कौन सा दस्तावेज़ चाहिए। जैसे: "मुझे आय प्रमाण पत्र चाहिए" या "आधार कार्ड कैसे बनवाएँ"।'
            : 'Please tell me which document you need help with. For example: "I need income certificate" or "How to get Aadhaar card".',
        }
        setChatMessages((prev) => [...prev, reply])
      }
    }, 600)
  }

  const quickChips = hi
    ? ['मुझे आय प्रमाण पत्र चाहिए', 'आधार कार्ड कैसे बनवाएँ', 'राशन कार्ड के लिए क्या करें', 'पैन कार्ड कैसे बनेगा']
    : ['I need income certificate', 'How to get Aadhaar', 'Help with ration card', 'How to get PAN card']

  return (
    <section
      className={
        fullScreen
          ? 'min-h-svh bg-background p-4 sm:p-8'
          : 'w-[min(28rem,calc(100vw-2rem))] max-h-[min(85vh,48rem)] flex flex-col rounded-2xl border border-saffron/40 bg-card shadow-2xl'
      }
      aria-label={hi ? 'सारथी पोर्टल गाइड' : 'Sarthi Portal Guide'}
    >
      {/* Scrollable content wrapper for popover mode */}
      <div className={fullScreen ? '' : 'flex-1 overflow-y-auto p-4'}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-bold text-foreground">{hi ? 'सारथी पोर्टल गाइड' : 'Sarthi Portal Guide'}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {hi
                ? 'दस्तावेज़ चेकलिस्ट पूरी करें, किसी भी दस्तावेज़ के लिए स्टेप-बाय-स्टेप मार्गदर्शन और सरकारी पोर्टल लिंक पाएँ।'
                : 'Complete your document checklist, get step-by-step guidance and direct government portal links for any document.'}
            </p>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} aria-label={hi ? 'गाइड बंद करें' : 'Close guide'}>
              <X />
            </Button>
          )}
        </div>

        {/* Quick nav buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" className="min-h-[44px]" render={<Link href="/explore" />}>
            <MapPinned className="size-4" />
            {hi ? 'योजनाएँ खोजें' : 'Find schemes'}
          </Button>
          <Button size="sm" variant="outline" className="min-h-[44px]" render={<Link href="/eligibility" />}>
            <CheckCircle2 className="size-4" />
            {hi ? 'पात्रता जाँचें' : 'Check eligibility'}
          </Button>
          <Button size="sm" variant="outline" className="min-h-[44px]" render={<Link href="/documents" />}>
            <FileText className="size-4" />
            {hi ? 'दस्तावेज़' : 'Documents'}
          </Button>
          <Button size="sm" variant="outline" className="min-h-[44px]" render={<Link href="/applications" />}>
            <FileText className="size-4" />
            {hi ? 'आवेदन' : 'Applications'}
          </Button>
        </div>

        {/* Document checklist */}
        <div className="mt-4 rounded-xl bg-secondary/70 p-3">
          <p className="text-sm font-bold">{hi ? 'आपके पास कौन-से दस्तावेज़ हैं?' : 'Which documents do you already have?'}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {hi
              ? 'जो दस्तावेज़ आपके पास हैं उन्हें चुनें। बाकी के लिए सारथी पूरी प्रक्रिया बताएगा।'
              : 'Select the documents you have. Sarthi will guide you through the full process for anything missing.'}
          </p>
          <div className="mt-3 grid gap-1.5">
            {documents.map((doc) => {
              const isChecked = checked.includes(doc.id)
              const isExpanded = expandedDoc === doc.id && !isChecked
              return (
                <div key={doc.id}>
                  <div className="flex items-center gap-2 rounded-lg bg-card px-3 py-2.5 ring-1 ring-border min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(doc.id)}
                      className="size-4 shrink-0 accent-[var(--saffron)] cursor-pointer"
                      id={`doc-${doc.id}`}
                    />
                    <label htmlFor={`doc-${doc.id}`} className="flex-1 text-sm cursor-pointer select-none">
                      {hi ? doc.hi : doc.en}
                    </label>
                    {!isChecked && (
                      <button
                        type="button"
                        onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                        className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        aria-label={hi ? 'विवरण देखें' : 'View details'}
                      >
                        <ChevronRight className={cn('size-4 transition-transform', isExpanded && 'rotate-90')} />
                      </button>
                    )}
                  </div>

                  {/* Expanded step-by-step guidance */}
                  {isExpanded && (
                    <div className="ml-3 mt-1 mb-2 rounded-xl bg-saffron-soft/50 p-3 ring-1 ring-saffron/20">
                      <p className="text-xs font-bold text-accent-foreground mb-2">
                        {hi ? `${doc.hi} कैसे प्राप्त करें:` : `How to get ${doc.en}:`}
                      </p>
                      <ol className="space-y-1.5">
                        {(hi ? doc.stepsHi : doc.stepsEn).map((step, i) => (
                          <li key={i} className="flex gap-2 text-xs leading-relaxed">
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-saffron text-[0.625rem] font-bold text-primary-foreground">
                              {i + 1}
                            </span>
                            <span className="text-accent-foreground/90">{step}</span>
                          </li>
                        ))}
                      </ol>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-[0.6875rem]">
                        <div>
                          <span className="font-semibold text-accent-foreground block">{hi ? 'आवश्यक दस्तावेज़:' : 'Required docs:'}</span>
                          <ul className="mt-1 space-y-0.5 text-accent-foreground/80">
                            {(hi ? doc.requiredDocsHi : doc.requiredDocsEn).map((rd, i) => (
                              <li key={i}>• {rd}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1.5">
                          <div>
                            <span className="flex items-center gap-1 font-semibold text-accent-foreground">
                              <IndianRupee className="size-3" />
                              {hi ? 'शुल्क:' : 'Fee:'}
                            </span>
                            <span className="text-accent-foreground/80">{hi ? doc.feeHi : doc.feeEn}</span>
                          </div>
                          <div>
                            <span className="flex items-center gap-1 font-semibold text-accent-foreground">
                              <Clock className="size-3" />
                              {hi ? 'समय:' : 'Time:'}
                            </span>
                            <span className="text-accent-foreground/80">{hi ? doc.timeHi : doc.timeEn}</span>
                          </div>
                        </div>
                      </div>

                      <a
                        className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-saffron px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                        href={doc.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {hi ? `${doc.portalName} पर आवेदन करें` : `Apply on ${doc.portalName}`}
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Missing documents banner */}
        {missing.length > 0 && (
          <div className="mt-3 rounded-xl bg-saffron-soft p-3 text-sm text-accent-foreground">
            <p className="font-bold">
              {hi ? `${missing.length} दस्तावेज़ अभी बाकी हैं` : `${missing.length} documents still needed`}
            </p>
            <p className="mt-1 text-xs">
              {hi
                ? 'चेकलिस्ट में किसी भी दस्तावेज़ के आगे ▶ दबाएँ या नीचे चैट करें।'
                : 'Tap ▶ next to any document in the checklist or ask below in chat.'}
            </p>
          </div>
        )}
        {missing.length === 0 && (
          <div className="mt-3 rounded-xl bg-success-soft p-3 text-sm text-success">
            <p className="font-bold">{hi ? '🎉 सभी दस्तावेज़ तैयार हैं!' : '🎉 All documents ready!'}</p>
            <p className="mt-1 text-xs">{hi ? 'अब आप योजनाओं के लिए आवेदन कर सकते हैं।' : 'You are ready to apply for schemes.'}</p>
          </div>
        )}

        {/* Embedded Chatbox */}
        <div className="mt-4 rounded-xl bg-card ring-1 ring-border overflow-hidden">
          <button
            type="button"
            onClick={() => setChatOpen(!chatOpen)}
            className="flex w-full items-center gap-2 px-3 py-3 text-sm font-bold text-foreground hover:bg-secondary/50 transition-colors min-h-[48px]"
          >
            <MessageCircle className="size-4 text-saffron" />
            {hi ? 'सारथी से पूछें — "मुझे ___ चाहिए"' : 'Ask Sarthi — "I need ___"'}
            <ChevronRight className={cn('size-4 ml-auto transition-transform text-muted-foreground', chatOpen && 'rotate-90')} />
          </button>

          {chatOpen && (
            <div className="border-t border-border">
              {/* Chat messages */}
              <div className="max-h-60 overflow-y-auto p-3 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground text-center">
                      {hi ? 'कोई भी दस्तावेज़ पूछें और मैं पूरी प्रक्रिया बताऊँगा।' : 'Ask about any document and I\'ll explain the complete process.'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {quickChips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleChatSend(chip)}
                          className="rounded-full bg-secondary px-3 py-1.5 text-[0.6875rem] font-medium text-foreground ring-1 ring-border hover:bg-saffron-soft hover:ring-saffron/30 transition-colors min-h-[32px]"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatMessages.map((msg) => (
                  <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.role === 'sarthi' && <Sparkles className="size-4 text-saffron shrink-0 mt-1 mr-2" />}
                    <div
                      className={cn(
                        'max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary text-foreground rounded-bl-sm',
                      )}
                    >
                      {msg.text}
                      {msg.docId && (
                        <span className="mt-1 block text-[0.625rem] text-muted-foreground">
                          {hi ? '☝️ ऊपर चेकलिस्ट में विवरण देखें' : '☝️ See details expanded in checklist above'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div className="flex items-center gap-2 border-t border-border p-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleChatSend()
                    }
                  }}
                  placeholder={hi ? 'कौन सा दस्तावेज़ चाहिए...' : 'Which document do you need...'}
                  className="flex-1 bg-transparent px-2 py-2 text-sm placeholder:text-muted-foreground focus:outline-none min-h-[40px]"
                />
                <Button
                  type="button"
                  size="icon"
                  className="shrink-0 size-9"
                  onClick={() => handleChatSend()}
                  aria-label={hi ? 'भेजें' : 'Send'}
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
