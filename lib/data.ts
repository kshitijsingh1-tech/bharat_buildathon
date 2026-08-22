// Demo data for the Sarthi UI. All content is fictional sample data
// used to demonstrate the interface — not live government records.

export type EligibilityState = 'eligible' | 'likely' | 'missing-info' | 'not-eligible'

export type Criterion = {
  label: string
  userValue: string
  requirement: string
  status: 'pass' | 'fail' | 'unknown'
  why: string
  source: string
  page: string
}

export type Scheme = {
  id: string
  name: string
  nameHi: string
  department: string
  level: 'Central' | 'State'
  state: string
  category: string
  benefit: string
  benefitDetail: string
  match: number
  status: EligibilityState
  deadlineDays: number | null
  deadlineLabel: string
  lastVerified: string
  applicationMode: 'Online' | 'Offline' | 'Online / CSC'
  processingTime: string
  incomeLimit: string
  ageRange: string
  documents: string[]
  summary: string
  criteria: Criterion[]
}

export const statusMeta: Record<
  EligibilityState,
  { label: string; symbol: string; className: string; dot: string }
> = {
  eligible: {
    label: 'Eligible',
    symbol: '✓',
    className: 'bg-success-soft text-success ring-1 ring-success/20',
    dot: 'bg-success',
  },
  likely: {
    label: 'Likely eligible',
    symbol: '✓',
    className: 'bg-info-soft text-info ring-1 ring-info/20',
    dot: 'bg-info',
  },
  'missing-info': {
    label: 'Need more info',
    symbol: '⚠',
    className: 'bg-warning-soft text-warning ring-1 ring-warning/25',
    dot: 'bg-warning',
  },
  'not-eligible': {
    label: 'Not eligible',
    symbol: '✗',
    className: 'bg-destructive/8 text-destructive ring-1 ring-destructive/20',
    dot: 'bg-destructive',
  },
}

export const citizen = {
  name: 'Aayush Sharma',
  initials: 'AS',
  age: 21,
  gender: 'Male',
  state: 'Punjab',
  district: 'Ludhiana',
  occupation: 'Student',
  income: '₹2,40,000',
  incomeValue: 240000,
  category: 'General',
  education: 'Undergraduate — B.Sc. Agriculture',
  institution: 'Punjab Agricultural University',
  employment: 'Full-time student',
  disability: 'None declared',
}

export const categories = [
  { name: 'Education', icon: 'GraduationCap', count: 42 },
  { name: 'Agriculture', icon: 'Sprout', count: 38 },
  { name: 'Employment', icon: 'Briefcase', count: 27 },
  { name: 'Healthcare', icon: 'HeartPulse', count: 31 },
  { name: 'Housing', icon: 'Home', count: 19 },
  { name: 'Women & Child', icon: 'Baby', count: 24 },
  { name: 'Senior Citizens', icon: 'UserRound', count: 16 },
  { name: 'Business', icon: 'Store', count: 22 },
  { name: 'Social Welfare', icon: 'HandHeart', count: 29 },
  { name: 'Disability', icon: 'Accessibility', count: 14 },
]

export const schemes: Scheme[] = [
  {
    id: 'punjab-farmer-equipment-subsidy',
    name: 'Punjab Farmer Equipment Subsidy',
    nameHi: 'पंजाब किसान उपकरण सब्सिडी',
    department: 'Department of Agriculture, Government of Punjab',
    level: 'State',
    state: 'Punjab',
    category: 'Agriculture',
    benefit: 'Up to ₹50,000',
    benefitDetail: 'Equipment purchase assistance, credited to a linked bank account',
    match: 94,
    status: 'eligible',
    deadlineDays: 18,
    deadlineLabel: 'Closes 9 Sep 2026',
    lastVerified: '20 Aug 2026',
    applicationMode: 'Online / CSC',
    processingTime: '30–45 days',
    incomeLimit: '≤ ₹3,00,000',
    ageRange: '18–60 years',
    documents: ['Aadhaar', 'Bank account', 'Land record', 'Photograph', 'Income certificate'],
    summary:
      'Capital subsidy for small and marginal farmers in Punjab purchasing approved farm machinery, with a higher subsidy slab for holdings under 5 acres.',
    criteria: [
      {
        label: 'Age',
        userValue: '55 years',
        requirement: '18–60 years',
        status: 'pass',
        why: 'The scheme is limited to working-age cultivators so that the subsidised equipment remains in active agricultural use.',
        source: 'Punjab Agriculture Equipment Subsidy Guidelines 2026',
        page: 'Page 3, Clause 4.1',
      },
      {
        label: 'State of residence',
        userValue: 'Punjab',
        requirement: 'Punjab',
        status: 'pass',
        why: 'This is a state-funded scheme, so the benefit is restricted to residents holding a Punjab domicile or land record.',
        source: 'Punjab Agriculture Equipment Subsidy Guidelines 2026',
        page: 'Page 2, Clause 2.3',
      },
      {
        label: 'Occupation',
        userValue: 'Farmer',
        requirement: 'Farmer / cultivator',
        status: 'pass',
        why: 'Applicants must be recorded as cultivators in the state land record system.',
        source: 'Punjab Agriculture Equipment Subsidy Guidelines 2026',
        page: 'Page 3, Clause 4.2',
      },
      {
        label: 'Annual household income',
        userValue: '₹2,80,000',
        requirement: '≤ ₹3,00,000',
        status: 'pass',
        why: 'The income ceiling directs the subsidy towards small and marginal farming households.',
        source: 'Punjab Agriculture Equipment Subsidy Guidelines 2026',
        page: 'Page 4, Clause 5.1',
      },
      {
        label: 'Land holding',
        userValue: '3 acres',
        requirement: '≤ 5 acres',
        status: 'pass',
        why: 'Holdings above 5 acres are covered by a separate commercial mechanisation window.',
        source: 'Punjab Agriculture Equipment Subsidy Guidelines 2026',
        page: 'Page 4, Clause 5.4',
      },
    ],
  },
  {
    id: 'punjab-farmer-support-scheme',
    name: 'Punjab Farmer Support Scheme',
    nameHi: 'पंजाब किसान सहायता योजना',
    department: 'Department of Agriculture, Government of Punjab',
    level: 'State',
    state: 'Punjab',
    category: 'Agriculture',
    benefit: '₹12,000 / year',
    benefitDetail: 'Direct income support paid in three instalments',
    match: 92,
    status: 'not-eligible',
    deadlineDays: 34,
    deadlineLabel: 'Closes 25 Sep 2026',
    lastVerified: '18 Aug 2026',
    applicationMode: 'Online / CSC',
    processingTime: '21–30 days',
    incomeLimit: '≤ ₹3,00,000',
    ageRange: '18–60 years',
    documents: ['Aadhaar', 'Bank account', 'Land record', 'Income certificate'],
    summary:
      'Annual income support for cultivating households in Punjab, paid directly into an Aadhaar-linked bank account in three instalments.',
    criteria: [
      {
        label: 'Age',
        userValue: '55 years',
        requirement: '18–60 years',
        status: 'pass',
        why: 'Income support under this scheme is for working-age cultivators; those above 60 are covered by the state pension scheme instead.',
        source: 'Punjab Farmer Support Scheme Notification 2026',
        page: 'Page 2, Clause 3.1',
      },
      {
        label: 'State of residence',
        userValue: 'Punjab',
        requirement: 'Punjab',
        status: 'pass',
        why: 'State-funded benefit, restricted to Punjab domicile holders.',
        source: 'Punjab Farmer Support Scheme Notification 2026',
        page: 'Page 2, Clause 2.1',
      },
      {
        label: 'Occupation',
        userValue: 'Farmer',
        requirement: 'Farmer / cultivator',
        status: 'pass',
        why: 'Applicant must appear as a cultivator in the state land records.',
        source: 'Punjab Farmer Support Scheme Notification 2026',
        page: 'Page 3, Clause 3.4',
      },
      {
        label: 'Annual household income',
        userValue: '₹3,40,000',
        requirement: '≤ ₹3,00,000',
        status: 'fail',
        why: 'The income ceiling targets support at small and marginal farming households. Household income is assessed from the latest income certificate on record.',
        source: 'Punjab Farmer Support Scheme Notification 2026',
        page: 'Page 4, Clause 5.2',
      },
      {
        label: 'Land holding',
        userValue: '3 acres',
        requirement: '≤ 5 acres',
        status: 'pass',
        why: 'Holdings up to 5 acres qualify as small or marginal under state norms.',
        source: 'Punjab Farmer Support Scheme Notification 2026',
        page: 'Page 4, Clause 5.5',
      },
    ],
  },
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    nameHi: 'पीएम-किसान सम्मान निधि',
    department: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central',
    state: 'All India',
    category: 'Agriculture',
    benefit: '₹6,000 / year',
    benefitDetail: 'Three instalments of ₹2,000 into an Aadhaar-linked account',
    match: 88,
    status: 'likely',
    deadlineDays: null,
    deadlineLabel: 'Open all year',
    lastVerified: '20 Aug 2026',
    applicationMode: 'Online / CSC',
    processingTime: '15–30 days',
    incomeLimit: 'No income ceiling',
    ageRange: '18+ years',
    documents: ['Aadhaar', 'Bank account', 'Land record'],
    summary:
      'Central income support for landholding farmer families across India, with exclusions for institutional landholders and income-tax payers.',
    criteria: [
      {
        label: 'Landholding family',
        userValue: '3 acres, self-cultivated',
        requirement: 'Owns cultivable land',
        status: 'pass',
        why: 'Benefit is tied to a landholding family record in the state land registry.',
        source: 'PM-KISAN Operational Guidelines',
        page: 'Page 4, Clause 3',
      },
      {
        label: 'Income-tax status',
        userValue: 'Not declared',
        requirement: 'Not an income-tax payer',
        status: 'unknown',
        why: 'Households where any member paid income tax in the last assessment year are excluded. We need this detail to finish the check.',
        source: 'PM-KISAN Operational Guidelines',
        page: 'Page 6, Exclusion 4(e)',
      },
      {
        label: 'Aadhaar-linked bank account',
        userValue: 'Available',
        requirement: 'Mandatory',
        status: 'pass',
        why: 'Payments are made only through Aadhaar-seeded direct benefit transfer.',
        source: 'PM-KISAN Operational Guidelines',
        page: 'Page 9, Clause 7.2',
      },
    ],
  },
  {
    id: 'crop-insurance',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना',
    department: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central',
    state: 'All India',
    category: 'Agriculture',
    benefit: 'Premium at 2% of sum insured',
    benefitDetail: 'Crop loss cover for notified crops in notified areas',
    match: 81,
    status: 'missing-info',
    deadlineDays: 11,
    deadlineLabel: 'Closes 2 Sep 2026',
    lastVerified: '14 Aug 2026',
    applicationMode: 'Online / CSC',
    processingTime: 'Season-linked',
    incomeLimit: 'No income ceiling',
    ageRange: '18+ years',
    documents: ['Aadhaar', 'Bank account', 'Land record', 'Sowing certificate'],
    summary:
      'Subsidised crop insurance covering yield loss from notified natural risks. Enrolment windows are linked to the sowing season.',
    criteria: [
      {
        label: 'Notified crop sown',
        userValue: 'Not declared',
        requirement: 'Crop notified for the season',
        status: 'unknown',
        why: 'Cover applies only to crops notified by the state for the current season. Tell Sarthi which crop was sown to complete the check.',
        source: 'PMFBY Operational Guidelines 2026',
        page: 'Page 11, Clause 6.1',
      },
      {
        label: 'Land record',
        userValue: '3 acres, Ludhiana',
        requirement: 'Valid land record or tenancy proof',
        status: 'pass',
        why: 'Insured area must be verifiable against a land record or a registered tenancy agreement.',
        source: 'PMFBY Operational Guidelines 2026',
        page: 'Page 12, Clause 6.4',
      },
    ],
  },
  {
    id: 'post-matric-scholarship',
    name: 'Post-Matric Scholarship for Students',
    nameHi: 'पोस्ट-मैट्रिक छात्रवृत्ति',
    department: 'Department of Higher Education, Government of Punjab',
    level: 'State',
    state: 'Punjab',
    category: 'Education',
    benefit: 'Up to ₹35,000 / year',
    benefitDetail: 'Tuition reimbursement plus a monthly maintenance allowance',
    match: 96,
    status: 'eligible',
    deadlineDays: 5,
    deadlineLabel: 'Closes 27 Aug 2026',
    lastVerified: '19 Aug 2026',
    applicationMode: 'Online',
    processingTime: '45–60 days',
    incomeLimit: '≤ ₹2,50,000',
    ageRange: '17–30 years',
    documents: ['Aadhaar', 'Income certificate', 'Marksheet', 'Institution certificate', 'Bank account'],
    summary:
      'Tuition and maintenance support for students enrolled in recognised post-matriculation courses in Punjab.',
    criteria: [
      {
        label: 'Age',
        userValue: '21 years',
        requirement: '17–30 years',
        status: 'pass',
        why: 'The scheme targets students in post-matric education.',
        source: 'Punjab Post-Matric Scholarship Guidelines',
        page: 'Page 2, Clause 3.1',
      },
      {
        label: 'Enrolment',
        userValue: 'B.Sc. Agriculture, PAU',
        requirement: 'Recognised institution',
        status: 'pass',
        why: 'Only courses at institutions recognised by the state or UGC are covered.',
        source: 'Punjab Post-Matric Scholarship Guidelines',
        page: 'Page 3, Clause 4.2',
      },
      {
        label: 'Annual household income',
        userValue: '₹2,40,000',
        requirement: '≤ ₹2,50,000',
        status: 'pass',
        why: 'Income ceiling keeps the scholarship targeted at lower-income households.',
        source: 'Punjab Post-Matric Scholarship Guidelines',
        page: 'Page 4, Clause 5.1',
      },
    ],
  },
  {
    id: 'skill-development',
    name: 'Skill Development & Certification Scheme',
    nameHi: 'कौशल विकास योजना',
    department: 'Ministry of Skill Development & Entrepreneurship',
    level: 'Central',
    state: 'All India',
    category: 'Employment',
    benefit: 'Free training + ₹8,000 stipend',
    benefitDetail: 'Short-term certified training with a placement-linked stipend',
    match: 89,
    status: 'eligible',
    deadlineDays: 26,
    deadlineLabel: 'Closes 17 Sep 2026',
    lastVerified: '12 Aug 2026',
    applicationMode: 'Online / CSC',
    processingTime: '10–20 days',
    incomeLimit: 'No income ceiling',
    ageRange: '15–45 years',
    documents: ['Aadhaar', 'Bank account', 'Marksheet'],
    summary:
      'Short-duration vocational training with national certification and a stipend on successful assessment.',
    criteria: [
      {
        label: 'Age',
        userValue: '21 years',
        requirement: '15–45 years',
        status: 'pass',
        why: 'Training is designed for the working-age population entering or re-entering employment.',
        source: 'Skill Development Scheme Guidelines 2026',
        page: 'Page 5, Clause 4.1',
      },
      {
        label: 'Prior certification',
        userValue: 'None',
        requirement: 'No prior certification under this scheme',
        status: 'pass',
        why: 'Each candidate may claim the stipend once to spread benefits across more applicants.',
        source: 'Skill Development Scheme Guidelines 2026',
        page: 'Page 7, Clause 5.6',
      },
    ],
  },
  {
    id: 'housing-assistance',
    name: 'Rural Housing Assistance',
    nameHi: 'ग्रामीण आवास सहायता',
    department: 'Ministry of Rural Development',
    level: 'Central',
    state: 'All India',
    category: 'Housing',
    benefit: 'Up to ₹1,20,000',
    benefitDetail: 'Construction assistance released in four stages',
    match: 64,
    status: 'missing-info',
    deadlineDays: 52,
    deadlineLabel: 'Closes 13 Oct 2026',
    lastVerified: '11 Aug 2026',
    applicationMode: 'Offline',
    processingTime: '60–90 days',
    incomeLimit: 'SECC-based selection',
    ageRange: '18+ years',
    documents: ['Aadhaar', 'Bank account', 'Residence certificate', 'Job card'],
    summary:
      'Assistance for construction of a pucca house for eligible rural households identified through the SECC deprivation criteria.',
    criteria: [
      {
        label: 'Household selection',
        userValue: 'Not declared',
        requirement: 'Listed in SECC eligible list',
        status: 'unknown',
        why: 'Selection follows the SECC deprivation list validated by the Gram Sabha; it is not open application-based.',
        source: 'Rural Housing Scheme Framework',
        page: 'Page 8, Clause 4.3',
      },
      {
        label: 'Existing pucca house',
        userValue: 'Not declared',
        requirement: 'No pucca house owned',
        status: 'unknown',
        why: 'Households already owning a pucca house are excluded from construction assistance.',
        source: 'Rural Housing Scheme Framework',
        page: 'Page 9, Exclusion 5(b)',
      },
    ],
  },
  {
    id: 'ayushman-health-cover',
    name: 'Health Cover Scheme',
    nameHi: 'स्वास्थ्य बीमा योजना',
    department: 'National Health Authority',
    level: 'Central',
    state: 'All India',
    category: 'Healthcare',
    benefit: '₹5,00,000 / family / year',
    benefitDetail: 'Cashless secondary and tertiary hospitalisation cover',
    match: 76,
    status: 'likely',
    deadlineDays: null,
    deadlineLabel: 'Open all year',
    lastVerified: '16 Aug 2026',
    applicationMode: 'Online / CSC',
    processingTime: '7–15 days',
    incomeLimit: 'SECC-based selection',
    ageRange: 'All ages',
    documents: ['Aadhaar', 'Ration card', 'Residence certificate'],
    summary:
      'Family floater health cover for eligible households, usable at empanelled public and private hospitals without cash payment.',
    criteria: [
      {
        label: 'Household eligibility',
        userValue: 'Rural, Punjab',
        requirement: 'SECC deprivation category',
        status: 'pass',
        why: 'Entitlement is determined by the deprivation categories recorded in the SECC database.',
        source: 'Health Cover Scheme Guidelines',
        page: 'Page 3, Clause 2.2',
      },
      {
        label: 'Existing insurance',
        userValue: 'Not declared',
        requirement: 'No overlapping state cover',
        status: 'unknown',
        why: 'Where a state scheme already covers the household, benefits are converged rather than duplicated.',
        source: 'Health Cover Scheme Guidelines',
        page: 'Page 6, Clause 4.1',
      },
    ],
  },
  {
    id: 'senior-pension',
    name: 'Old Age Pension Scheme',
    nameHi: 'वृद्धावस्था पेंशन योजना',
    department: 'Department of Social Security, Government of Punjab',
    level: 'State',
    state: 'Punjab',
    category: 'Social Welfare',
    benefit: '₹1,500 / month',
    benefitDetail: 'Monthly pension credited to a bank account',
    match: 91,
    status: 'eligible',
    deadlineDays: null,
    deadlineLabel: 'Open all year',
    lastVerified: '17 Aug 2026',
    applicationMode: 'Online / CSC',
    processingTime: '30–45 days',
    incomeLimit: '≤ ₹60,000',
    ageRange: '60+ years',
    documents: ['Aadhaar', 'Age proof', 'Bank account', 'Income certificate'],
    summary:
      'Monthly social security pension for senior citizens in Punjab with limited independent income.',
    criteria: [
      {
        label: 'Age',
        userValue: '72 years',
        requirement: '60+ years',
        status: 'pass',
        why: 'Pension is a old-age social security benefit and starts at 60.',
        source: 'Punjab Social Security Pension Rules',
        page: 'Page 2, Clause 3.1',
      },
      {
        label: 'Independent income',
        userValue: '₹0',
        requirement: '≤ ₹60,000 / year',
        status: 'pass',
        why: 'Pension supports seniors without adequate independent income.',
        source: 'Punjab Social Security Pension Rules',
        page: 'Page 3, Clause 4.2',
      },
    ],
  },
  {
    id: 'women-entrepreneur-loan',
    name: 'Women Entrepreneur Credit Support',
    nameHi: 'महिला उद्यमी ऋण सहायता',
    department: 'Ministry of Micro, Small & Medium Enterprises',
    level: 'Central',
    state: 'All India',
    category: 'Business',
    benefit: 'Up to ₹10,00,000 collateral-free',
    benefitDetail: 'Collateral-free working capital with interest subvention',
    match: 58,
    status: 'not-eligible',
    deadlineDays: null,
    deadlineLabel: 'Open all year',
    lastVerified: '10 Aug 2026',
    applicationMode: 'Online',
    processingTime: '30–60 days',
    incomeLimit: 'No income ceiling',
    ageRange: '18–60 years',
    documents: ['Aadhaar', 'Bank account', 'Business registration', 'PAN'],
    summary:
      'Collateral-free credit with interest subvention for women-led micro and small enterprises.',
    criteria: [
      {
        label: 'Applicant gender',
        userValue: 'Male',
        requirement: 'Woman applicant / majority ownership',
        status: 'fail',
        why: 'This scheme is reserved for enterprises majority-owned and controlled by women.',
        source: 'Women Entrepreneur Credit Guidelines',
        page: 'Page 2, Clause 2.1',
      },
      {
        label: 'Business registration',
        userValue: 'Not declared',
        requirement: 'Udyam registration',
        status: 'unknown',
        why: 'Credit support is routed through registered micro and small enterprises.',
        source: 'Women Entrepreneur Credit Guidelines',
        page: 'Page 4, Clause 3.3',
      },
    ],
  },
]

export const schemeById = (id: string) => schemes.find((s) => s.id === id)

export type FamilyMember = {
  id: string
  relation: string
  name: string
  age: number
  occupation: string
  state: string
  potential: number
  eligible: number
  missingDocs: number
  initials: string
}

export const family: FamilyMember[] = [
  {
    id: 'father',
    relation: 'Father',
    name: 'Rajinder Sharma',
    age: 55,
    occupation: 'Farmer',
    state: 'Punjab',
    potential: 14,
    eligible: 6,
    missingDocs: 1,
    initials: 'RS',
  },
  {
    id: 'mother',
    relation: 'Mother',
    name: 'Sunita Sharma',
    age: 50,
    occupation: 'Homemaker',
    state: 'Punjab',
    potential: 9,
    eligible: 4,
    missingDocs: 2,
    initials: 'SS',
  },
  {
    id: 'me',
    relation: 'Me',
    name: 'Aayush Sharma',
    age: 21,
    occupation: 'Student',
    state: 'Punjab',
    potential: 28,
    eligible: 11,
    missingDocs: 2,
    initials: 'AS',
  },
  {
    id: 'grandmother',
    relation: 'Grandmother',
    name: 'Kamla Devi',
    age: 72,
    occupation: 'Senior citizen',
    state: 'Punjab',
    potential: 11,
    eligible: 7,
    missingDocs: 0,
    initials: 'KD',
  },
]

export type Doc = {
  id: string
  name: string
  status: 'valid' | 'expiring' | 'missing'
  detail: string
  issuedBy: string
  usedBy: number
  validFor: number
  needsRenewal: number
}

export const documents: Doc[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar',
    status: 'valid',
    detail: 'No expiry',
    issuedBy: 'UIDAI',
    usedBy: 24,
    validFor: 24,
    needsRenewal: 0,
  },
  {
    id: 'income-certificate',
    name: 'Income Certificate',
    status: 'expiring',
    detail: 'Expires in 18 days — 9 Sep 2026',
    issuedBy: 'Revenue Department, Ludhiana',
    usedBy: 7,
    validFor: 5,
    needsRenewal: 2,
  },
  {
    id: 'residence-certificate',
    name: 'Residence Certificate',
    status: 'valid',
    detail: 'Valid until 4 Mar 2029',
    issuedBy: 'Revenue Department, Ludhiana',
    usedBy: 11,
    validFor: 11,
    needsRenewal: 0,
  },
  {
    id: 'land-record',
    name: 'Land Record (Fard)',
    status: 'missing',
    detail: 'Not uploaded',
    issuedBy: 'Punjab Revenue Records',
    usedBy: 6,
    validFor: 0,
    needsRenewal: 0,
  },
  {
    id: 'bank-passbook',
    name: 'Bank Account Proof',
    status: 'valid',
    detail: 'Aadhaar-linked, verified',
    issuedBy: 'Punjab & Sind Bank',
    usedBy: 21,
    validFor: 21,
    needsRenewal: 0,
  },
  {
    id: 'caste-certificate',
    name: 'Category Certificate',
    status: 'valid',
    detail: 'No expiry',
    issuedBy: 'Revenue Department, Ludhiana',
    usedBy: 8,
    validFor: 8,
    needsRenewal: 0,
  },
  {
    id: 'marksheet',
    name: 'Class 12 Marksheet',
    status: 'valid',
    detail: 'Verified 12 Jul 2026',
    issuedBy: 'PSEB',
    usedBy: 6,
    validFor: 6,
    needsRenewal: 0,
  },
  {
    id: 'photograph',
    name: 'Passport Photograph',
    status: 'expiring',
    detail: 'Older than 6 months for 3 schemes',
    issuedBy: 'Self-uploaded',
    usedBy: 18,
    validFor: 15,
    needsRenewal: 3,
  },
  {
    id: 'ration-card',
    name: 'Ration Card',
    status: 'valid',
    detail: 'Valid until 31 Dec 2027',
    issuedBy: 'Food & Civil Supplies, Punjab',
    usedBy: 9,
    validFor: 9,
    needsRenewal: 0,
  },
  {
    id: 'sowing-certificate',
    name: 'Sowing Certificate',
    status: 'missing',
    detail: 'Required for crop insurance',
    issuedBy: 'Village Revenue Officer',
    usedBy: 2,
    validFor: 0,
    needsRenewal: 0,
  },
]

export type Alert = {
  id: string
  type: 'New Scheme' | 'Deadline' | 'Eligibility Change' | 'Document Expiry' | 'Application Update'
  title: string
  body: string
  time: string
  scheme: string
  unread: boolean
}

export const alerts: Alert[] = [
  {
    id: 'a1',
    type: 'New Scheme',
    title: 'New scheme matches your profile',
    body: 'Punjab Student Support Scheme was added to the knowledge base. Based on your profile you may be eligible.',
    time: '2 hours ago',
    scheme: 'Punjab Student Support Scheme',
    unread: true,
  },
  {
    id: 'a2',
    type: 'Deadline',
    title: 'Application closes in 5 days',
    body: 'Post-Matric Scholarship for Students closes on 27 Aug 2026. Your documents are ready.',
    time: '5 hours ago',
    scheme: 'Post-Matric Scholarship for Students',
    unread: true,
  },
  {
    id: 'a3',
    type: 'Eligibility Change',
    title: 'Income limit changed',
    body: 'Punjab Farmer Support Scheme raised its income ceiling from ₹2,50,000 to ₹3,00,000. Your father is now closer to eligibility.',
    time: 'Yesterday',
    scheme: 'Punjab Farmer Support Scheme',
    unread: true,
  },
  {
    id: 'a4',
    type: 'Document Expiry',
    title: 'Income Certificate expires in 18 days',
    body: 'This document is used by 7 schemes. Two of them will need a renewed certificate.',
    time: '2 days ago',
    scheme: '7 schemes affected',
    unread: false,
  },
  {
    id: 'a5',
    type: 'Application Update',
    title: 'Application moved to Under Verification',
    body: 'Application PB/EQP/2026/44821 for Punjab Farmer Equipment Subsidy is being verified by the block office.',
    time: '3 days ago',
    scheme: 'Punjab Farmer Equipment Subsidy',
    unread: false,
  },
  {
    id: 'a6',
    type: 'Deadline',
    title: 'Enrolment window closes in 11 days',
    body: 'Pradhan Mantri Fasal Bima Yojana kharif enrolment closes 2 Sep 2026. One detail is still missing.',
    time: '4 days ago',
    scheme: 'Pradhan Mantri Fasal Bima Yojana',
    unread: false,
  },
  {
    id: 'a7',
    type: 'New Scheme',
    title: 'New scheme in Agriculture',
    body: 'Micro Irrigation Support Scheme was published by the Department of Agriculture, Punjab.',
    time: '1 week ago',
    scheme: 'Micro Irrigation Support Scheme',
    unread: false,
  },
]

export type Application = {
  id: string
  scheme: string
  applicationId: string
  submitted: string
  stage: number
  status: string
  amount: string
}

export const applications: Application[] = [
  {
    id: 'app1',
    scheme: 'Punjab Farmer Equipment Subsidy',
    applicationId: 'PB/EQP/2026/44821',
    submitted: '2 Aug 2026',
    stage: 2,
    status: 'Under Verification',
    amount: '₹50,000',
  },
  {
    id: 'app2',
    scheme: 'Post-Matric Scholarship for Students',
    applicationId: 'PB/SCH/2026/10233',
    submitted: '14 Jul 2026',
    stage: 4,
    status: 'Payment Processing',
    amount: '₹35,000',
  },
  {
    id: 'app3',
    scheme: 'Skill Development & Certification Scheme',
    applicationId: 'IN/SKL/2026/98110',
    submitted: '3 Jun 2026',
    stage: 5,
    status: 'Completed',
    amount: '₹8,000',
  },
  {
    id: 'app4',
    scheme: 'Health Cover Scheme',
    applicationId: 'IN/HLT/2026/55207',
    submitted: '19 Aug 2026',
    stage: 1,
    status: 'Submitted',
    amount: '₹5,00,000 cover',
  },
]

export const applicationStages = [
  'Submitted',
  'Under Verification',
  'Approved',
  'Payment Processing',
  'Completed',
]

export const readinessChecklist = [
  { name: 'Aadhaar', done: true, note: 'Verified 12 Jul 2026' },
  { name: 'Bank account proof', done: true, note: 'Aadhaar-linked' },
  { name: 'Land record (Fard)', done: true, note: 'Uploaded 2 Aug 2026' },
  { name: 'Passport photograph', done: true, note: 'Uploaded 2 Aug 2026' },
  { name: 'Income certificate', done: false, note: 'Expires in 18 days — renewal required' },
]

export const schemeUpdates = [
  {
    scheme: 'Punjab Farmer Support Scheme',
    field: 'Annual income limit',
    from: '₹2,50,000',
    to: '₹3,00,000',
    date: '18 Aug 2026',
    source: 'Punjab Farmer Support Scheme Notification 2026, Page 4',
    status: 'Verified',
  },
  {
    scheme: 'Post-Matric Scholarship for Students',
    field: 'Application deadline',
    from: '10 Aug 2026',
    to: '27 Aug 2026',
    date: '19 Aug 2026',
    source: 'Higher Education Circular 44/2026',
    status: 'Verified',
  },
  {
    scheme: 'Punjab Farmer Equipment Subsidy',
    field: 'Maximum assistance',
    from: '₹40,000',
    to: '₹50,000',
    date: '20 Aug 2026',
    source: 'Equipment Subsidy Guidelines 2026, Page 6',
    status: 'Verified',
  },
  {
    scheme: 'Pradhan Mantri Fasal Bima Yojana',
    field: 'Required documents',
    from: '3 documents',
    to: '4 documents (sowing certificate added)',
    date: '14 Aug 2026',
    source: 'PMFBY Operational Guidelines 2026, Page 12',
    status: 'Pending review',
  },
  {
    scheme: 'Old Age Pension Scheme',
    field: 'Monthly benefit',
    from: '₹1,250',
    to: '₹1,500',
    date: '17 Aug 2026',
    source: 'Social Security Pension Rules, Amendment 3/2026',
    status: 'Verified',
  },
]

export const cscCentres = [
  {
    name: 'Ludhiana CSC — Model Town',
    distance: '1.2 km',
    address: 'Shop 14, Model Town Market, Ludhiana, Punjab 141002',
    hours: 'Mon–Sat, 9:00 AM – 6:00 PM',
    services: ['Scheme applications', 'Aadhaar update', 'Income certificate', 'Printing'],
    open: true,
  },
  {
    name: 'Jan Seva Kendra — Civil Lines',
    distance: '2.8 km',
    address: '3rd Floor, District Complex, Civil Lines, Ludhiana, Punjab 141001',
    hours: 'Mon–Fri, 9:30 AM – 5:00 PM',
    services: ['Land records', 'Pension applications', 'Certificate attestation'],
    open: true,
  },
  {
    name: 'CSC Sahnewal Block Office',
    distance: '6.4 km',
    address: 'Block Development Office, Sahnewal, Ludhiana, Punjab 141120',
    hours: 'Mon–Sat, 10:00 AM – 5:00 PM',
    services: ['Farmer schemes', 'Crop insurance', 'Bank seeding'],
    open: false,
  },
  {
    name: 'Common Service Centre — Dhandari',
    distance: '8.1 km',
    address: 'Near Bus Stand, Dhandari Kalan, Ludhiana, Punjab 141014',
    hours: 'Mon–Sun, 8:00 AM – 8:00 PM',
    services: ['Scheme applications', 'Document scanning', 'Health cover enrolment'],
    open: true,
  },
]

export const lifeEvents = [
  { title: 'Starting college', icon: 'GraduationCap', schemes: 14 },
  { title: 'Looking for work', icon: 'Briefcase', schemes: 19 },
  { title: 'Starting farming', icon: 'Sprout', schemes: 22 },
  { title: 'Starting a business', icon: 'Store', schemes: 17 },
  { title: 'Building a home', icon: 'Home', schemes: 11 },
  { title: 'Having a child', icon: 'Baby', schemes: 13 },
  { title: 'Getting married', icon: 'Heart', schemes: 6 },
  { title: 'Disability support', icon: 'Accessibility', schemes: 15 },
  { title: 'Senior citizen', icon: 'UserRound', schemes: 12 },
  { title: 'Medical assistance', icon: 'HeartPulse', schemes: 18 },
]

export const adminMetrics = {
  totalSchemes: 428,
  activeSchemes: 391,
  recentlyUpdated: 37,
  documentsIndexed: 1842,
  pendingVerification: 12,
  sourceConflicts: 3,
}

export const adminSchemeRows = [
  {
    name: 'Punjab Farmer Equipment Subsidy',
    category: 'Agriculture',
    state: 'Punjab',
    lastVerified: '20 Aug 2026',
    version: 'v4.2',
    indexed: true,
    rulesVerified: true,
  },
  {
    name: 'PM-KISAN Samman Nidhi',
    category: 'Agriculture',
    state: 'All India',
    lastVerified: '20 Aug 2026',
    version: 'v11.0',
    indexed: true,
    rulesVerified: true,
  },
  {
    name: 'Post-Matric Scholarship for Students',
    category: 'Education',
    state: 'Punjab',
    lastVerified: '19 Aug 2026',
    version: 'v3.1',
    indexed: true,
    rulesVerified: true,
  },
  {
    name: 'Punjab Farmer Support Scheme',
    category: 'Agriculture',
    state: 'Punjab',
    lastVerified: '18 Aug 2026',
    version: 'v2.7',
    indexed: true,
    rulesVerified: false,
  },
  {
    name: 'Old Age Pension Scheme',
    category: 'Social Welfare',
    state: 'Punjab',
    lastVerified: '17 Aug 2026',
    version: 'v6.3',
    indexed: true,
    rulesVerified: true,
  },
  {
    name: 'Health Cover Scheme',
    category: 'Healthcare',
    state: 'All India',
    lastVerified: '16 Aug 2026',
    version: 'v8.4',
    indexed: true,
    rulesVerified: true,
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana',
    category: 'Agriculture',
    state: 'All India',
    lastVerified: '14 Aug 2026',
    version: 'v9.1',
    indexed: false,
    rulesVerified: false,
  },
  {
    name: 'Skill Development & Certification Scheme',
    category: 'Employment',
    state: 'All India',
    lastVerified: '12 Aug 2026',
    version: 'v5.0',
    indexed: true,
    rulesVerified: true,
  },
  {
    name: 'Rural Housing Assistance',
    category: 'Housing',
    state: 'All India',
    lastVerified: '11 Aug 2026',
    version: 'v7.2',
    indexed: true,
    rulesVerified: true,
  },
  {
    name: 'Women Entrepreneur Credit Support',
    category: 'Business',
    state: 'All India',
    lastVerified: '10 Aug 2026',
    version: 'v2.0',
    indexed: true,
    rulesVerified: false,
  },
]

export const ragIndex = [
  { scheme: 'PM-KISAN Samman Nidhi', docs: 4, chunks: 67, embeddings: 67, indexed: '20 Aug 2026', health: 'healthy' },
  { scheme: 'Punjab Farmer Equipment Subsidy', docs: 3, chunks: 48, embeddings: 48, indexed: '20 Aug 2026', health: 'healthy' },
  { scheme: 'Post-Matric Scholarship', docs: 5, chunks: 82, embeddings: 82, indexed: '19 Aug 2026', health: 'healthy' },
  { scheme: 'Punjab Farmer Support Scheme', docs: 2, chunks: 31, embeddings: 28, indexed: '18 Aug 2026', health: 'degraded' },
  { scheme: 'Pradhan Mantri Fasal Bima Yojana', docs: 6, chunks: 104, embeddings: 0, indexed: 'Never', health: 'stale' },
  { scheme: 'Health Cover Scheme', docs: 4, chunks: 59, embeddings: 59, indexed: '16 Aug 2026', health: 'healthy' },
]

export const analytics = {
  searches: 128430,
  eligibilityChecks: 54210,
  matches: 38774,
  applicationsInitiated: 9142,
  documentsCompleted: 21358,
  topCategories: [
    { name: 'Agriculture', value: 28 },
    { name: 'Education', value: 24 },
    { name: 'Healthcare', value: 17 },
    { name: 'Employment', value: 13 },
    { name: 'Housing', value: 10 },
    { name: 'Social Welfare', value: 8 },
  ],
  failureReasons: [
    { name: 'Income above limit', value: 34 },
    { name: 'Missing income certificate', value: 22 },
    { name: 'Age outside range', value: 16 },
    { name: 'State mismatch', value: 15 },
    { name: 'Land holding above limit', value: 13 },
  ],
  regions: [
    { name: 'Punjab', value: 22 },
    { name: 'Uttar Pradesh', value: 19 },
    { name: 'Bihar', value: 15 },
    { name: 'Maharashtra', value: 14 },
    { name: 'Rajasthan', value: 11 },
    { name: 'Others', value: 19 },
  ],
  languages: [
    { name: 'Hindi', value: 46 },
    { name: 'English', value: 31 },
    { name: 'Punjabi', value: 14 },
    { name: 'Hinglish', value: 9 },
  ],
}

export const benefitsSummary = {
  potential: 28,
  eligibleNow: 11,
  needDocuments: 7,
  needInfo: 5,
}

export const categoryBreakdown = [
  { name: 'Education', eligible: 4, total: 8 },
  { name: 'Healthcare', eligible: 2, total: 5 },
  { name: 'Agriculture', eligible: 3, total: 7 },
  { name: 'Housing', eligible: 0, total: 3 },
  { name: 'Employment', eligible: 2, total: 4 },
  { name: 'Social Welfare', eligible: 0, total: 1 },
]
