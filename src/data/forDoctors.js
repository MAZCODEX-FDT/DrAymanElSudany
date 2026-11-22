// For Doctors page content. DRAFT medical copy: Dr. Ayman reviews it before launch. No outcome promises.
const t = (ar, en) => ({ ar, en });

export const referSteps = [
  t('ابعت الحالة من الفورم أو واتساب', 'Send the case through the form or WhatsApp'),
  t('بنكلم المريض أو أهله فى نفس اليوم ونحدد ميعاد', 'We call the patient or family the same day and set a time'),
  t('الكشف ومراجعة الأشعة، وشرح الاختيارات للمريض وأهله', 'Consultation and imaging review, with the options explained to the patient and family'),
  t('بيرجعلك تقرير مكتوب، والمريض بيكمل متابعته معاك', 'A written report comes back to you, and the patient continues follow-up with you'),
];

export const whenToRefer = [
  { title: t('ضيق الشريان السباتى', 'Carotid stenosis'), body: t('ضيق ملحوظ مع أعراض، أو ضيق شديد من غير أعراض محتاج قرار.', 'Significant symptomatic narrowing, or severe asymptomatic narrowing that needs a decision.') },
  { title: t('تمدد شريانى بالمخ', 'Brain aneurysm'), body: t('تمدد ظهر بالصدفة فى الأشعة، أو تمدد بعد نزيف محتاج تقييم سريع.', 'An incidental aneurysm on imaging, or one after a bleed that needs fast assessment.') },
  { title: t('تشوه شريانى وريدى أو ناسور', 'AVM or dural fistula'), body: t('تشوه ظهر فى الرنين، أو طنين نابض فى الودن من غير سبب واضح.', 'A malformation seen on MRI, or pulsatile tinnitus without a clear cause.') },
  { title: t('جلطات متكررة أو نوبات عابرة', 'Recurrent stroke or TIA'), body: t('تكرار الأعراض رغم العلاج، خصوصًا مع ضيق فى شرايين الرقبة أو المخ.', 'Recurring symptoms despite treatment, especially with neck or brain artery narrowing.') },
  { title: t('نزيف مزمن تحت الأم الجافية', 'Chronic subdural haematoma'), body: t('خصوصًا الحالات المتكررة أو كبار السن اللى محتاجين بديل أقل تدخلًا.', 'Especially recurrent cases or older patients who need a less invasive option.') },
  { title: t('قسطرة تشخيصية', 'Diagnostic angiography'), body: t('لما الرنين أو المقطعية مش كفاية لتحديد الخطوة الجاية.', 'When MRI or CT is not enough to decide the next step.') },
];

export const whatToSend = [
  t('الأشعة: رنين، مقطعية، أو قسطرة سابقة (السى دى أو لينك)', 'Imaging: MRI, CT or previous angiography (CD or link)'),
  t('آخر تقرير وملخص الحالة', 'The latest report and a case summary'),
  t('الأدوية الحالية، خصوصًا مضادات التجلط والصفايح', 'Current medicines, especially anticoagulants and antiplatelets'),
  t('وظائف الكلى وأى حساسية من الصبغة', 'Kidney function and any contrast allergy'),
  t('رقم المريض أو أحد أقاربه', 'A phone number for the patient or a relative'),
];

export const reportIncludes = [
  t('التشخيص وإيه اللى ظهر فى الأشعة أو القسطرة', 'The diagnosis and imaging or angiography findings'),
  t('القرار اللى اتاخد وليه، والاختيارات اللى اتشرحت', 'The decision taken and why, and the options discussed'),
  t('تفاصيل الإجراء لو اتعمل', 'Procedure details, if one was done'),
  t('الأدوية وخطة المتابعة المقترحة معاك', 'Medication and the suggested follow-up plan with you'),
];

export const doctorFaqs = [
  { q: t('الحالة عاجلة ودلوقتى، أعمل إيه؟', 'The case is acute right now. What should I do?'), a: t('جلطة حادة فى أول ساعاتها مكانها الطوارئ فورًا. كلمنا على الرقم مباشرة بالتوازى، ومتستناش رد الفورم.', 'An acute stroke in its first hours belongs in the emergency room immediately. Call us directly in parallel; do not wait for a form reply.') },
  { q: t('المريض هيرجعلى بعد كده؟', 'Will the patient come back to me?'), a: t('أيوه. بنكتب التقرير ليك، والمتابعة طويلة المدى بتكمل معاك إلا لو اتفقنا على غير كده.', 'Yes. The report is written for you, and long-term follow-up continues with you unless we agree otherwise.') },
  { q: t('ينفع أبعت الأشعة بس من غير ما المريض ييجى؟', 'Can I send imaging only, without the patient visiting?'), a: t('ينفع نبدى رأى مبدئى عشان نحدد الاستعجال، لكن القرار النهائى بيحتاج كشف.', 'We can give an initial view to judge urgency, but a final decision needs a consultation.') },
  { q: t('هعرف إيه اللى حصل مع المريض؟', 'Will I hear what happened?'), a: t('هيوصلك تقرير مكتوب بعد الكشف أو الإجراء، ولو فى تغيير مهم بنبلغك.', 'You receive a written report after the visit or procedure, and we tell you about any important change.') },
];
