// Site-wide content blocks (bilingual). Medical statements are drafts pending the doctor's approval.

export const press = [
  { ar: 'الأهرام', en: 'Al-Ahram' },
  { ar: 'الوطن', en: 'El Watan' },
  { ar: 'الدستور', en: 'El Dostour' },
];

export const journey = [
  {
    n: '01',
    title: { ar: 'أول رسالة', en: 'First message' },
    body: { ar: 'رد خلال 15 دقيقة فى مواعيد العمل، بإجابة واضحة ومن غير لف ودوران.', en: 'A reply within 15 minutes during working hours, clear and straightforward.' },
  },
  {
    n: '02',
    title: { ar: 'قبل الميعاد', en: 'Before your visit' },
    body: { ar: 'ميعاد بوقت دخول محدد بدل أسبقية الحضور، وتذكير قبلها بيوم.', en: 'A fixed entry time instead of first-come-first-served, with a reminder the day before.' },
  },
  {
    n: '03',
    title: { ar: 'فى الكشف', en: 'At the consultation' },
    body: { ar: 'بنسمع الحكاية كاملة ونراجع الأشعة، وحضرتك بتخرج بملخص مكتوب: الحالة، هل محتاجة قسطرة، والخطوات.', en: 'We hear the full story and review the imaging. You leave with a written summary: the condition, whether a catheter is needed, and the next steps.' },
  },
  {
    n: '04',
    title: { ar: 'بعد 3 أيام', en: 'Three days later' },
    body: { ar: 'مكالمة متابعة للحالات اللى محتاجة قرار، نرد فيها على أسئلة العيلة.', en: 'A follow-up call for cases facing a decision, to answer the family’s questions.' },
  },
];

export const personas = [
  {
    key: 'family',
    tab: { ar: 'ابن أو بنت المريض', en: 'The son or daughter' },
    fear: { ar: 'إن القسطرة خطيرة على سن كبير', en: 'That a catheter procedure is dangerous at an older age' },
    message: { ar: 'هنشرحلك الحالة بهدوء قبل أى قرار، ونرد على كل أسئلة العيلة.', en: 'We will explain the condition clearly before any decision, and answer every family question.' },
    points: {
      ar: ['ملخص مكتوب تقدر توريه للعيلة', 'مكالمة متابعة بعد 3 أيام', 'شرح بلغة بسيطة من غير مصطلحات'],
      en: ['A written summary to share with the family', 'A follow-up call after three days', 'Plain language, no jargon'],
    },
  },
  {
    key: 'patient',
    tab: { ar: 'المريض نفسه', en: 'The patient' },
    fear: { ar: 'التكلفة ومضاعفات الإجراء', en: 'The cost and possible complications' },
    message: { ar: 'رأى واضح: محتاج قسطرة ولا لأ، وليه.', en: 'A clear opinion: whether you need a catheter procedure or not, and why.' },
    points: {
      ar: ['رأى تانى بصراحة', 'التكلفة بتتقال بالتفصيل فى العيادة', 'مش كل حالة محتاجة قسطرة'],
      en: ['An honest second opinion', 'Costs explained in detail at the clinic', 'Not every case needs a catheter'],
    },
  },
  {
    key: 'doctor',
    tab: { ar: 'الدكتور اللى بيحوّل', en: 'The referring doctor' },
    fear: { ar: 'إن المريض ما يرجعش ليه', en: 'That the patient will not come back' },
    message: { ar: 'المريض بيرجعلك بتقرير كامل.', en: 'Your patient returns to you with a full report.' },
    points: {
      ar: ['تحويل بخطوة واحدة', 'تقرير مكتوب بعد الكشف أو الإجراء', 'المتابعة الأساسية بتفضل معاك'],
      en: ['One-step referral', 'A written report after the visit or procedure', 'Primary follow-up stays with you'],
    },
  },
];

export const costFactors = [
  { title: { ar: 'نوع الإجراء', en: 'The procedure type' }, body: { ar: 'تشخيصى ولا علاجى، ومدى تعقيد الحالة.', en: 'Diagnostic or therapeutic, and how complex the case is.' } },
  { title: { ar: 'الأدوات المستخدمة', en: 'Devices used' }, body: { ar: 'الدعامات والملفات والفلاتر بتختلف حسب كل حالة.', en: 'Stents, coils and filters vary from case to case.' } },
  { title: { ar: 'المستشفى والإقامة', en: 'Hospital and stay' }, body: { ar: 'مكان الإجراء ومدة الإقامة والرعاية بعده.', en: 'Where it is performed, length of stay and aftercare.' } },
  { title: { ar: 'السعر بيشمل إيه', en: 'What it includes' }, body: { ar: 'بنكتبلك بالتفصيل إيه اللى داخل فى التكلفة قبل أى قرار.', en: 'We write down exactly what is included before any decision.' } },
];

export const about = {
  intro: {
    ar: 'د. أيمن حسن السودانى، استشارى المخ والأعصاب وقسطرة المخ فى مدينة العبور. بيخدم مرضى شرق القاهرة والشرقية، وعمل أول قسطرة مخية فى الشرقية فى أكتوبر 2026.',
    en: 'Dr. Ayman Hassan El Sudany is a consultant in neurology and brain catheterization in Obour City, serving patients from East Cairo and Sharqia. He performed the first brain catheterization in Sharqia in October 2026.',
  },
  philosophy: {
    ar: 'المرضى بيوصفوه بكلمتين أكتر من أى حاجة تانية: «مستمع جيد» و«محترم». وده أساس طريقته: يسمع الحكاية كاملة، يشرح للمريض وأهله بلغة بسيطة، ويقول بصراحة لو الحالة مش محتاجة قسطرة.',
    en: 'Patients describe him with two words more than any others: “a good listener” and “respectful”. That is the core of his approach: hear the whole story, explain simply to the patient and family, and say honestly when a case does not need a catheter.',
  },
  // Longer About page. DRAFT copy for the doctor to approve.
  sections: [
    {
      title: { ar: 'ليه اختار قسطرة المخ', en: 'Why brain catheterization' },
      body: {
        ar: 'قسطرة المخ بتسمح بعلاج مشاكل خطيرة فى شرايين المخ من جوه الشريان نفسه، من غير فتح للجمجمة فى حالات كتير. د. أيمن اتخصص فيها عشان المرضى يلاقوا العلاج ده قريب منهم، من غير سفر طويل فى وقت كل دقيقة فيه فارقة.',
        en: 'Brain catheterization treats serious problems in the brain arteries from inside the artery, often without opening the skull. Dr. Ayman specialised in it so patients can find this care close to home, without a long journey when every minute counts.',
      },
    },
    {
      title: { ar: 'القرار الصح قبل الإجراء', en: 'The right decision before any procedure' },
      body: {
        ar: 'مش كل حالة محتاجة قسطرة. قبل أى خطوة بيراجع الأشعة والتاريخ المرضى بالكامل، وبيقارن بين العلاج الدوائى والمتابعة والتدخل. ولو الحالة مش محتاجة قسطرة، بيقول ده بوضوح.\nالهدف إن المريض وأهله يخرجوا من الكشف فاهمين الحالة والاختيارات، ومرتاحين للقرار.',
        en: 'Not every case needs a catheter. Before any step he reviews the scans and full history, and compares medication, follow-up and intervention. If a case does not need a catheter, he says so clearly.\nThe aim is that the patient and family leave the visit understanding the condition and the options, and comfortable with the decision.',
      },
    },
    {
      title: { ar: 'الأهل جزء من الشرح', en: 'The family is part of the conversation' },
      body: {
        ar: 'فى أمراض المخ، القرار غالبًا بيتاخد مع العيلة. علشان كده الشرح بيكون للمريض وأهله مع بعض، بلغة بسيطة ومن غير مصطلحات معقدة، مع وقت كافى للأسئلة.',
        en: 'With brain conditions, decisions are usually made with the family. So the explanation is for the patient and family together, in plain language without complex terms, with enough time for questions.',
      },
    },
    {
      title: { ar: 'متابعة بعد الإجراء', en: 'Follow-up after the procedure' },
      body: {
        ar: 'الإجراء مش نهاية الرحلة. بعده فى خطة متابعة واضحة: الأدوية، مواعيد الأشعة، وإمتى ترجع لحياتك الطبيعية، ورقم تتواصل عليه لو عندك سؤال.',
        en: 'The procedure is not the end of the journey. Afterwards there is a clear follow-up plan: medication, imaging dates, when to return to normal life, and a number to reach if you have a question.',
      },
    },
  ],
  steps: [
    { title: { ar: 'نسمع الحكاية', en: 'We listen' }, body: { ar: 'الأعراض من أولها، والأدوية، والتاريخ المرضى، وأسئلة الأهل.', en: 'The symptoms from the start, medication, history and the family’s questions.' } },
    { title: { ar: 'نراجع الأشعة', en: 'We review the scans' }, body: { ar: 'الرنين أو المقطعية أو أى قسطرة سابقة، ولو محتاجين أشعة إضافية بنقول ليه.', en: 'MRI, CT or any previous angiography, and if more imaging is needed we explain why.' } },
    { title: { ar: 'نشرح الاختيارات', en: 'We explain the options' }, body: { ar: 'علاج دوائى، متابعة، أو تدخل بالقسطرة، مع مميزات وعيوب كل اختيار.', en: 'Medication, follow-up or catheter treatment, with the pros and cons of each.' } },
    { title: { ar: 'نتابع معاك', en: 'We follow up' }, body: { ar: 'خطة مكتوبة ومواعيد متابعة، ونفضل معاك بعد الكشف أو الإجراء.', en: 'A written plan and follow-up dates, and we stay with you after the visit or procedure.' } },
  ],
  // Placeholder until the doctor sends the approved CV, certificates and current title.
  credentials: [
    { ar: '[السيرة المعتمدة من الدكتور]', en: '[Doctor-approved CV]' },
    { ar: '[الشهادات والزمالات]', en: '[Certificates and fellowships]' },
    { ar: '[اللقب الأكاديمى بعد التأكيد]', en: '[Academic title once confirmed]' },
  ],
  areas: { ar: ['العبور', 'الشروق', 'بدر', 'العاشر من رمضان', 'الزقازيق', 'بنها'], en: ['Obour', 'El Shorouk', 'Badr', '10th of Ramadan', 'Zagazig', 'Banha'] },
};
