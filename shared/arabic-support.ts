// Arabic Language and Hijri Calendar Support
// دعم اللغة العربية والتقويم الهجري

// Medical Specializations in Arabic
export const MEDICAL_SPECIALIZATIONS = {
  // تخصصات طبية رئيسية
  CARDIOLOGY: { en: 'Cardiology', ar: 'أمراض القلب' },
  DERMATOLOGY: { en: 'Dermatology', ar: 'الأمراض الجلدية' },
  ENDOCRINOLOGY: { en: 'Endocrinology', ar: 'الغدد الصماء والسكري' },
  GASTROENTEROLOGY: { en: 'Gastroenterology', ar: 'الجهاز الهضمي' },
  HEMATOLOGY: { en: 'Hematology', ar: 'أمراض الدم' },
  NEPHROLOGY: { en: 'Nephrology', ar: 'أمراض الكلى' },
  NEUROLOGY: { en: 'Neurology', ar: 'الأمراض العصبية' },
  ONCOLOGY: { en: 'Oncology', ar: 'الأورام' },
  OPHTHALMOLOGY: { en: 'Ophthalmology', ar: 'طب وجراحة العيون' },
  ORTHOPEDICS: { en: 'Orthopedics', ar: 'جراحة العظام' },
  OTOLARYNGOLOGY: { en: 'ENT', ar: 'الأنف والأذن والحنجرة' },
  PEDIATRICS: { en: 'Pediatrics', ar: 'طب الأطفال' },
  PSYCHIATRY: { en: 'Psychiatry', ar: 'الطب النفسي' },
  PULMONOLOGY: { en: 'Pulmonology', ar: 'أمراض الصدر والجهاز التنفسي' },
  RHEUMATOLOGY: { en: 'Rheumatology', ar: 'أمراض الروماتيزم' },
  UROLOGY: { en: 'Urology', ar: 'المسالك البولية' },
  
  // جراحة
  GENERAL_SURGERY: { en: 'General Surgery', ar: 'الجراحة العامة' },
  NEUROSURGERY: { en: 'Neurosurgery', ar: 'جراحة المخ والأعصاب' },
  PLASTIC_SURGERY: { en: 'Plastic Surgery', ar: 'جراحة التجميل' },
  CARDIAC_SURGERY: { en: 'Cardiac Surgery', ar: 'جراحة القلب' },
  VASCULAR_SURGERY: { en: 'Vascular Surgery', ar: 'جراحة الأوعية الدموية' },
  
  // تخصصات نسائية وأطفال
  OBSTETRICS_GYNECOLOGY: { en: 'Obstetrics & Gynecology', ar: 'النساء والتوليد' },
  NEONATOLOGY: { en: 'Neonatology', ar: 'حديثي الولادة' },
  
  // الطوارئ والعناية المركزة
  EMERGENCY_MEDICINE: { en: 'Emergency Medicine', ar: 'طب الطوارئ' },
  INTENSIVE_CARE: { en: 'Intensive Care', ar: 'العناية المركزة' },
  ANESTHESIA: { en: 'Anesthesia', ar: 'التخدير' },
  
  // تخصصات داعمة
  RADIOLOGY: { en: 'Radiology', ar: 'الأشعة' },
  PATHOLOGY: { en: 'Pathology', ar: 'علم الأمراض' },
  FAMILY_MEDICINE: { en: 'Family Medicine', ar: 'طب الأسرة' },
  INTERNAL_MEDICINE: { en: 'Internal Medicine', ar: 'الباطنية' },
  PHYSICAL_THERAPY: { en: 'Physical Therapy', ar: 'العلاج الطبيعي' },
  NUTRITION: { en: 'Nutrition', ar: 'التغذية العلاجية' },
  DENTISTRY: { en: 'Dentistry', ar: 'طب الأسنان' },
  DENTAL_SURGERY: { en: 'Dental Surgery', ar: 'جراحة الفم والأسنان' },
};

// Days of week in Arabic
export const ARABIC_DAYS = {
  SUNDAY: 'الأحد',
  MONDAY: 'الإثنين',
  TUESDAY: 'الثلاثاء',
  WEDNESDAY: 'الأربعاء',
  THURSDAY: 'الخميس',
  FRIDAY: 'الجمعة',
  SATURDAY: 'السبت',
};

// Months in Arabic (Gregorian)
export const ARABIC_MONTHS = {
  1: 'يناير',
  2: 'فبراير',
  3: 'مارس',
  4: 'أبريل',
  5: 'مايو',
  6: 'يونيو',
  7: 'يوليو',
  8: 'أغسطس',
  9: 'سبتمبر',
  10: 'أكتوبر',
  11: 'نوفمبر',
  12: 'ديسمبر',
};

// Hijri months
export const HIJRI_MONTHS = {
  1: 'محرم',
  2: 'صفر',
  3: 'ربيع الأول',
  4: 'ربيع الآخر',
  5: 'جمادى الأولى',
  6: 'جمادى الآخرة',
  7: 'رجب',
  8: 'شعبان',
  9: 'رمضان',
  10: 'شوال',
  11: 'ذو القعدة',
  12: 'ذو الحجة',
};

// Convert Gregorian date to Hijri (simplified approximation)
// For production, use a library like moment-hijri or similar
export function gregorianToHijri(date: Date): { year: number; month: number; day: number } {
  // This is a simplified conversion - use proper library in production
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();
  
  // Approximate conversion (622 years difference)
  const hYear = Math.floor((gYear - 622) * 1.030684);
  const hMonth = ((gMonth + Math.floor(hYear % 12)) % 12) + 1;
  const hDay = gDay;
  
  return { year: hYear, month: hMonth, day: hDay };
}

// Format Hijri date in Arabic
export function formatHijriDate(date: Date): string {
  const hijri = gregorianToHijri(date);
  return `${hijri.day} ${HIJRI_MONTHS[hijri.month]} ${hijri.year}هـ`;
}

// Format Gregorian date in Arabic
export function formatArabicDate(date: Date): string {
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth() + 1];
  const year = date.getFullYear();
  return `${day} ${month} ${year}م`;
}

// Convert numbers to Arabic-Indic numerals
export function toArabicNumerals(num: number | string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

// Medical terms in Arabic
export const MEDICAL_TERMS = {
  // Vital signs
  TEMPERATURE: { en: 'Temperature', ar: 'درجة الحرارة' },
  BLOOD_PRESSURE: { en: 'Blood Pressure', ar: 'ضغط الدم' },
  HEART_RATE: { en: 'Heart Rate', ar: 'معدل ضربات القلب' },
  RESPIRATORY_RATE: { en: 'Respiratory Rate', ar: 'معدل التنفس' },
  OXYGEN_SATURATION: { en: 'Oxygen Saturation', ar: 'تشبع الأكسجين' },
  WEIGHT: { en: 'Weight', ar: 'الوزن' },
  HEIGHT: { en: 'Height', ar: 'الطول' },
  BMI: { en: 'BMI', ar: 'مؤشر كتلة الجسم' },
  
  // Symptoms
  FEVER: { en: 'Fever', ar: 'حمى' },
  COUGH: { en: 'Cough', ar: 'سعال' },
  HEADACHE: { en: 'Headache', ar: 'صداع' },
  PAIN: { en: 'Pain', ar: 'ألم' },
  NAUSEA: { en: 'Nausea', ar: 'غثيان' },
  VOMITING: { en: 'Vomiting', ar: 'قيء' },
  DIARRHEA: { en: 'Diarrhea', ar: 'إسهال' },
  FATIGUE: { en: 'Fatigue', ar: 'إرهاق' },
  DIZZINESS: { en: 'Dizziness', ar: 'دوخة' },
  
  // Diagnoses
  DIABETES: { en: 'Diabetes', ar: 'السكري' },
  HYPERTENSION: { en: 'Hypertension', ar: 'ارتفاع ضغط الدم' },
  ASTHMA: { en: 'Asthma', ar: 'الربو' },
  ALLERGY: { en: 'Allergy', ar: 'حساسية' },
  INFECTION: { en: 'Infection', ar: 'عدوى' },
  FRACTURE: { en: 'Fracture', ar: 'كسر' },
  
  // Treatments
  MEDICATION: { en: 'Medication', ar: 'دواء' },
  SURGERY: { en: 'Surgery', ar: 'عملية جراحية' },
  THERAPY: { en: 'Therapy', ar: 'علاج' },
  INJECTION: { en: 'Injection', ar: 'حقنة' },
  PRESCRIPTION: { en: 'Prescription', ar: 'وصفة طبية' },
  
  // Lab tests
  BLOOD_TEST: { en: 'Blood Test', ar: 'تحليل دم' },
  URINE_TEST: { en: 'Urine Test', ar: 'تحليل بول' },
  XRAY: { en: 'X-Ray', ar: 'أشعة سينية' },
  CT_SCAN: { en: 'CT Scan', ar: 'أشعة مقطعية' },
  MRI: { en: 'MRI', ar: 'رنين مغناطيسي' },
  ULTRASOUND: { en: 'Ultrasound', ar: 'موجات فوق صوتية' },
  ECG: { en: 'ECG', ar: 'تخطيط القلب' },
  
  // Department/Ward types
  EMERGENCY: { en: 'Emergency', ar: 'الطوارئ' },
  ICU: { en: 'ICU', ar: 'العناية المركزة' },
  NICU: { en: 'NICU', ar: 'عناية الأطفال المركزة' },
  OPERATING_ROOM: { en: 'Operating Room', ar: 'غرفة العمليات' },
  RECOVERY_ROOM: { en: 'Recovery Room', ar: 'غرفة الإفاقة' },
  MATERNITY: { en: 'Maternity', ar: 'الولادة' },
  PEDIATRICS_WARD: { en: 'Pediatrics Ward', ar: 'جناح الأطفال' },
  GENERAL_WARD: { en: 'General Ward', ar: 'الجناح العام' },
  
  // Status
  ACTIVE: { en: 'Active', ar: 'نشط' },
  INACTIVE: { en: 'Inactive', ar: 'غير نشط' },
  PENDING: { en: 'Pending', ar: 'قيد الانتظار' },
  APPROVED: { en: 'Approved', ar: 'موافق عليه' },
  REJECTED: { en: 'Rejected', ar: 'مرفوض' },
  COMPLETED: { en: 'Completed', ar: 'مكتمل' },
  CANCELLED: { en: 'Cancelled', ar: 'ملغي' },
  SCHEDULED: { en: 'Scheduled', ar: 'مجدول' },
  IN_PROGRESS: { en: 'In Progress', ar: 'قيد التنفيذ' },
};

// Saudi Arabia specific data
export const SAUDI_CITIES = [
  { en: 'Riyadh', ar: 'الرياض' },
  { en: 'Jeddah', ar: 'جدة' },
  { en: 'Mecca', ar: 'مكة المكرمة' },
  { en: 'Medina', ar: 'المدينة المنورة' },
  { en: 'Dammam', ar: 'الدمام' },
  { en: 'Khobar', ar: 'الخبر' },
  { en: 'Dhahran', ar: 'الظهران' },
  { en: 'Taif', ar: 'الطائف' },
  { en: 'Tabuk', ar: 'تبوك' },
  { en: 'Buraidah', ar: 'بريدة' },
  { en: 'Khamis Mushait', ar: 'خميس مشيط' },
  { en: 'Abha', ar: 'أبها' },
  { en: 'Hail', ar: 'حائل' },
  { en: 'Najran', ar: 'نجران' },
  { en: 'Jizan', ar: 'جازان' },
  { en: 'Yanbu', ar: 'ينبع' },
  { en: 'Al-Ahsa', ar: 'الأحساء' },
  { en: 'Jubail', ar: 'الجبيل' },
  { en: 'Al-Qatif', ar: 'القطيف' },
  { en: 'Arar', ar: 'عرعر' },
];

// Prayer times (approximate - should use proper calculation in production)
export const PRAYER_TIMES = {
  FAJR: { en: 'Fajr', ar: 'الفجر' },
  DHUHR: { en: 'Dhuhr', ar: 'الظهر' },
  ASR: { en: 'Asr', ar: 'العصر' },
  MAGHRIB: { en: 'Maghrib', ar: 'المغرب' },
  ISHA: { en: 'Isha', ar: 'العشاء' },
};

// Format Saudi phone number
export function formatSaudiPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format as +966 XX XXX XXXX
  if (digits.startsWith('966')) {
    const number = digits.slice(3);
    return `+966 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`;
  } else if (digits.startsWith('0')) {
    const number = digits.slice(1);
    return `+966 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`;
  }
  
  return phone;
}

// Validate Saudi National ID
export function validateSaudiNationalId(id: string): boolean {
  // Saudi ID is 10 digits, starts with 1 or 2
  const regex = /^[12]\d{9}$/;
  return regex.test(id);
}

// Validate Saudi Iqama (Resident ID)
export function validateSaudiIqama(id: string): boolean {
  // Iqama number starts with 2 and is 10 digits
  const regex = /^2\d{9}$/;
  return regex.test(id);
}
