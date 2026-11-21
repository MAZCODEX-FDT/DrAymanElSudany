// The six procedure pages from the site map (plan WE3).
// DRAFT medical copy: every text here must be reviewed and approved by Dr. Ayman before launch.
// Rules: no prices, no promise of results, no assumption about the reader's condition.

export const procedures = [
  {
    slug: 'diagnostic-cerebral-angiography',
    icon: 'diagnostic',
    title: { ar: 'القسطرة المخية التشخيصية', en: 'Diagnostic Cerebral Angiography' },
    short: {
      ar: 'صورة دقيقة لشرايين المخ من جوه، عشان نعرف بالظبط فيه إيه قبل أي قرار علاج.',
      en: 'A precise view of the brain’s arteries from the inside, so we know exactly what is there before any treatment decision.',
    },
    whatIs: {
      ar: 'القسطرة التشخيصية فحص بيتعمل عن طريق أنبوب رفيع جدًا بيدخل من شريان في الفخذ أو الرسغ، وبيوصل لشرايين الرقبة والمخ. بنحقن صبغة وبناخد صور أشعة متتابعة بتوضح شكل الشرايين ومسار الدم بتفاصيل مش بتظهر في الرنين أو المقطعية.',
      en: 'Diagnostic angiography uses a very thin tube introduced through an artery in the groin or wrist and guided to the arteries of the neck and brain. Contrast dye is injected while a series of X-ray images map the arteries and blood flow in detail that MRI or CT may not show.',
    },
    whoFor: {
      ar: ['لو الرنين أو المقطعية أظهروا اشتباه في تمدد أو تشوه في الشرايين', 'قبل تحديد هل الحالة محتاجة دعامة أو علاج بالقسطرة', 'لتقييم ضيق في الشريان السباتي أو شرايين المخ', 'للمتابعة بعد علاج سابق بالقسطرة'],
      en: ['When MRI or CT suggests an aneurysm or vascular malformation', 'Before deciding whether a stent or endovascular treatment is needed', 'To assess narrowing of the carotid or brain arteries', 'For follow-up after a previous endovascular treatment'],
    },
    steps: {
      before: { ar: 'تحاليل دم بسيطة ومراجعة الأدوية، خصوصًا السيولة والسكر، وصيام كام ساعة قبل الإجراء.', en: 'Simple blood tests, a review of medications (especially blood thinners and diabetes medicines), and a few hours of fasting.' },
      during: { ar: 'تخدير موضعي في مكان الدخول، والمريض غالبًا صاحي ومرتاح. الإجراء عادة بياخد من نص ساعة لساعة.', en: 'Local anesthesia at the access site; the patient is usually awake and comfortable. It typically takes 30 to 60 minutes.' },
      after: { ar: 'راحة بضع ساعات تحت الملاحظة، وغالبًا الخروج في نفس اليوم أو تاني يوم، مع شرح النتيجة لحضرتك وللأهل.', en: 'A few hours of rest under observation, usually going home the same or next day, with the results explained to you and your family.' },
    },
    risky: {
      ar: 'القسطرة التشخيصية من الإجراءات الآمنة لما بتتعمل في مكان مجهز وعلى إيد متخصص، ومضاعفاتها قليلة. بنشرح لحضرتك قبلها كل احتمال بصراحة، وبنقيّم الحالة كويس عشان نتأكد إنها فعلًا محتاجاها.',
      en: 'Diagnostic angiography is considered a safe procedure when performed in an equipped center by a specialist, and complications are uncommon. We explain every possibility honestly beforehand and assess the case carefully to make sure it is truly needed.',
    },
    costFactors: {
      ar: ['المستشفى أو المركز اللي هيتعمل فيه الإجراء', 'نوع الصبغة والأدوات المستخدمة', 'مدة الإقامة بعد الإجراء', 'هل هيتعمل علاج في نفس الجلسة'],
      en: ['The hospital or center where it is performed', 'The type of contrast and tools used', 'Length of stay after the procedure', 'Whether treatment is done in the same session'],
    },
    faqs: [
      { q: { ar: 'هل القسطرة التشخيصية بتوجع؟', en: 'Is diagnostic angiography painful?' }, a: { ar: 'غالبًا لأ. بيتعمل تخدير موضعي، وممكن حضرتك تحس بدفا بسيط لحظة الصبغة.', en: 'Usually not. Local anesthesia is used, and you may feel brief warmth when the dye is injected.' } },
      { q: { ar: 'ليه محتاج قسطرة لو عملت رنين؟', en: 'Why angiography if I already had an MRI?' }, a: { ar: 'الرنين بيدي صورة عامة، والقسطرة بتدي تفاصيل الشرايين اللي بنبني عليها قرار العلاج.', en: 'MRI gives a general picture; angiography gives the arterial detail a treatment decision depends on.' } },
    ],
  },
  {
    slug: 'carotid-stenting',
    icon: 'carotid',
    title: { ar: 'دعامة الشريان السباتي', en: 'Carotid Artery Stenting' },
    short: {
      ar: 'فتح الضيق في شريان الرقبة اللي بيغذي المخ، بدون جراحة مفتوحة.',
      en: 'Opening a narrowing in the neck artery that supplies the brain, without open surgery.',
    },
    whatIs: {
      ar: 'الشريان السباتي هو الشريان الرئيسي في الرقبة اللي بيوصّل الدم للمخ. لما يحصل فيه ضيق بسبب ترسبات، ممكن نركّب دعامة معدنية دقيقة عن طريق القسطرة بتفتح الشريان وتحسّن وصول الدم، ومعاها فلتر حماية أثناء الإجراء.',
      en: 'The carotid artery is the main neck artery carrying blood to the brain. When plaque narrows it, a fine metal stent can be placed by catheter to open the artery and improve blood flow, with a protection filter used during the procedure.',
    },
    whoFor: {
      ar: ['ضيق ملحوظ في الشريان السباتي ظهر في الدوبلكس أو الأشعة', 'بعد جلطة أو نوبة إقفار عابرة بسبب الضيق', 'لما الجراحة المفتوحة مش الاختيار الأنسب للحالة'],
      en: ['Significant carotid narrowing shown on Doppler or imaging', 'After a stroke or transient ischemic attack caused by the narrowing', 'When open surgery is not the most suitable option'],
    },
    steps: {
      before: { ar: 'تقييم كامل بالأشعة، وبدء أدوية مضادة للصفايح قبلها بأيام حسب تعليمات الدكتور.', en: 'Full imaging assessment and starting antiplatelet medication days before, as instructed.' },
      during: { ar: 'دخول من شريان الفخذ أو الرسغ، فلتر حماية، ثم توسيع الضيق وتركيب الدعامة.', en: 'Access via the groin or wrist, a protection filter, then widening the narrowing and placing the stent.' },
      after: { ar: 'ملاحظة يوم تقريبًا، واستمرار الأدوية، ومتابعة بالدوبلكس في مواعيد محددة.', en: 'About a day of observation, continued medication, and scheduled Doppler follow-up.' },
    },
    risky: {
      ar: 'زي أي إجراء على شرايين المخ ليه نسبة مخاطر، وبنقارنها بخطر ترك الضيق من غير علاج. القرار بيتاخد بعد شرح كامل ليك ولأهلك، ومش كل ضيق محتاج دعامة.',
      en: 'Like any procedure on brain arteries it carries some risk, which we weigh against the risk of leaving the narrowing untreated. The decision is made after a full explanation to you and your family, and not every narrowing needs a stent.',
    },
    costFactors: {
      ar: ['نوع الدعامة وفلتر الحماية', 'المستشفى ومدة الإقامة', 'الفحوصات المطلوبة قبل وبعد'],
      en: ['The type of stent and protection filter', 'The hospital and length of stay', 'Tests required before and after'],
    },
    faqs: [
      { q: { ar: 'هل الدعامة بتتشال بعد كده؟', en: 'Is the stent removed later?' }, a: { ar: 'لأ، الدعامة بتفضل مكانها وبتبقى جزء من جدار الشريان.', en: 'No. The stent stays in place and becomes part of the artery wall.' } },
      { q: { ar: 'هل ممكن أعيش طبيعي بعدها؟', en: 'Can I live normally afterwards?' }, a: { ar: 'أغلب المرضى بيرجعوا لحياتهم بعد فترة قصيرة، مع الالتزام بالأدوية والمتابعة.', en: 'Most patients return to their routine after a short period, with medication and follow-up.' } },
    ],
  },
  {
    slug: 'brain-aneurysm',
    icon: 'aneurysm',
    title: { ar: 'تمدد شرايين المخ', en: 'Brain Aneurysm Treatment' },
    short: {
      ar: 'علاج الانتفاخ في جدار شريان المخ من جوه الشريان، من غير فتح الجمجمة.',
      en: 'Treating a bulge in a brain artery wall from inside the vessel, without opening the skull.',
    },
    whatIs: {
      ar: 'التمدد هو منطقة ضعيفة في جدار شريان بالمخ بتنتفخ زي البالونة الصغيرة. بالقسطرة ممكن نقفل التمدد من جوه باستخدام ملفات دقيقة (Coils) أو دعامات خاصة بتحوّل مسار الدم بعيد عنه.',
      en: 'An aneurysm is a weak spot in a brain artery wall that bulges like a small balloon. By catheter, it can be closed from within using fine coils or special flow-diverting stents.',
    },
    whoFor: {
      ar: ['تمدد اكتُشف بالصدفة في رنين أو مقطعية وحجمه أو شكله محتاج تدخل', 'بعد نزيف من تمدد', 'متابعة تمدد معروف'],
      en: ['An aneurysm found incidentally whose size or shape needs treatment', 'After bleeding from an aneurysm', 'Monitoring a known aneurysm'],
    },
    steps: {
      before: { ar: 'قسطرة تشخيصية لتحديد الحجم والشكل بدقة، ومناقشة الاختيارات كلها.', en: 'Diagnostic angiography to define size and shape precisely, and a discussion of all options.' },
      during: { ar: 'تحت تخدير كلي غالبًا، بنوصل للتمدد ونقفله بالملفات أو الدعامة المناسبة.', en: 'Usually under general anesthesia, the aneurysm is reached and closed with coils or a suitable stent.' },
      after: { ar: 'ملاحظة في المستشفى، ثم متابعة بالأشعة في مواعيد محددة للتأكد من القفل.', en: 'Observation in hospital, then scheduled imaging to confirm closure.' },
    },
    risky: {
      ar: 'مش كل تمدد محتاج علاج فوري؛ بعضها بيتابَع بس. لما يكون التدخل مطلوب، بنشرح لحضرتك الفرق بين الخطر لو اتعالج والخطر لو اتساب، بالأرقام وبهدوء.',
      en: 'Not every aneurysm needs immediate treatment; some are only monitored. When treatment is advised, we calmly explain the risk of treating versus not treating.',
    },
    costFactors: {
      ar: ['عدد الملفات أو نوع الدعامة', 'حجم ومكان التمدد', 'المستشفى ومدة الإقامة والتخدير'],
      en: ['Number of coils or type of stent', 'Size and location of the aneurysm', 'Hospital, length of stay and anesthesia'],
    },
    faqs: [
      { q: { ar: 'اكتشفت تمدد بالصدفة، أعمل إيه؟', en: 'An aneurysm was found by chance. What now?' }, a: { ar: 'متقلقش. هات الأشعة، وهنقيّم الحجم والشكل ونقولك بصراحة محتاج علاج ولا متابعة.', en: 'Don’t panic. Bring the imaging; we will assess size and shape and tell you honestly whether it needs treatment or monitoring.' } },
    ],
  },
  {
    slug: 'avm',
    icon: 'avm',
    title: { ar: 'التشوه الشرياني الوريدي', en: 'Arteriovenous Malformation (AVM)' },
    short: {
      ar: 'قفل الوصلات غير الطبيعية بين الشرايين والأوردة في المخ من جوه الأوعية.',
      en: 'Closing abnormal connections between arteries and veins in the brain from inside the vessels.',
    },
    whatIs: {
      ar: 'التشوه الشرياني الوريدي هو تشابك غير طبيعي بين الشرايين والأوردة من غير الشعيرات اللي المفروض تكون بينهم. ممكن نعالجه بالقسطرة عن طريق حقن مادة لاصقة طبية بتقفل الأوعية غير الطبيعية، لوحده أو مع علاجات تانية.',
      en: 'An AVM is an abnormal tangle where arteries connect directly to veins without the normal capillaries between them. It can be treated by catheter with a medical glue that seals the abnormal vessels, alone or alongside other treatments.',
    },
    whoFor: {
      ar: ['تشوه اكتُشف بعد صداع أو تشنجات', 'بعد نزيف من التشوه', 'كجزء من خطة علاج مشتركة مع الجراحة أو الإشعاع'],
      en: ['An AVM found after headaches or seizures', 'After bleeding from the AVM', 'As part of a combined plan with surgery or radiosurgery'],
    },
    steps: {
      before: { ar: 'قسطرة تشخيصية لرسم خريطة التشوه بالتفصيل، وتحديد عدد الجلسات المتوقعة.', en: 'Diagnostic angiography to map the AVM in detail and plan the expected number of sessions.' },
      during: { ar: 'تحت تخدير كلي، بنوصل لأوعية التشوه ونقفلها تدريجيًا.', en: 'Under general anesthesia, the AVM vessels are reached and closed in stages.' },
      after: { ar: 'ملاحظة في المستشفى، وأحيانًا جلسات تانية، ومتابعة بالأشعة.', en: 'Hospital observation, sometimes further sessions, and imaging follow-up.' },
    },
    risky: {
      ar: 'علاج التشوهات بيتخطط له حالة بحالة. بنشرح لحضرتك كل الاختيارات، ومميزات وعيوب كل واحد، وأحيانًا الأنسب هو المتابعة.',
      en: 'AVM treatment is planned case by case. We explain every option with its pros and cons, and sometimes the right choice is monitoring.',
    },
    costFactors: {
      ar: ['حجم التشوه وعدد الجلسات', 'كمية ونوع المادة المستخدمة', 'المستشفى والتخدير'],
      en: ['Size of the AVM and number of sessions', 'Amount and type of material used', 'Hospital and anesthesia'],
    },
    faqs: [
      { q: { ar: 'هل التشوه بيتعالج في جلسة واحدة؟', en: 'Is an AVM treated in one session?' }, a: { ar: 'أحيانًا، لكن كتير من الحالات بتحتاج أكتر من جلسة حسب الحجم.', en: 'Sometimes, but many cases need more than one session depending on size.' } },
    ],
  },
  {
    slug: 'acute-stroke',
    icon: 'stroke',
    title: { ar: 'جلطة المخ الحادة', en: 'Acute Ischemic Stroke' },
    short: {
      ar: 'سحب الجلطة من شريان المخ بالقسطرة في الساعات الأولى، لأن كل دقيقة فارقة.',
      en: 'Removing a clot from a brain artery by catheter in the first hours, because every minute matters.',
    },
    whatIs: {
      ar: 'جلطة المخ بتحصل لما شريان في المخ يتقفل فجأة. في حالات مناسبة، ممكن نسحب الجلطة بالقسطرة (Thrombectomy) ونرجّع الدم للمخ. الوقت هنا أهم عامل، عشان كده لازم المريض يوصل للطوارئ بأسرع ما يمكن.',
      en: 'An ischemic stroke happens when a brain artery is suddenly blocked. In suitable cases the clot can be removed by catheter (thrombectomy) to restore blood flow. Time is the most important factor, so the patient must reach emergency care as fast as possible.',
    },
    whoFor: {
      ar: ['جلطة بسبب انسداد شريان كبير في المخ', 'وصول المريض خلال الوقت المناسب من بداية الأعراض', 'حسب تقييم الأشعة في الطوارئ'],
      en: ['Stroke caused by a large-vessel blockage', 'Arrival within a suitable time window from symptom onset', 'Based on emergency imaging assessment'],
    },
    steps: {
      before: { ar: 'تقييم سريع في الطوارئ بأشعة المخ والشرايين لتحديد مكان الانسداد.', en: 'Rapid emergency assessment with brain and vessel imaging to locate the blockage.' },
      during: { ar: 'الوصول للجلطة بالقسطرة وسحبها بأدوات مخصصة.', en: 'Reaching the clot by catheter and retrieving it with dedicated devices.' },
      after: { ar: 'رعاية مركزة ومتابعة دقيقة، ثم خطة تأهيل ووقاية من التكرار.', en: 'Intensive care and close monitoring, then rehabilitation and a plan to prevent recurrence.' },
    },
    risky: {
      ar: 'جلطة المخ نفسها هي الخطر الأكبر. القرار بيتاخد بسرعة بعد تقييم الأشعة، وبنشرح للأهل كل خطوة حتى في وقت الطوارئ.',
      en: 'The stroke itself is the greatest danger. The decision is made quickly after imaging, and we explain each step to the family even in an emergency.',
    },
    costFactors: {
      ar: ['الأدوات المستخدمة في سحب الجلطة', 'مدة الرعاية المركزة والإقامة', 'المستشفى'],
      en: ['Devices used to retrieve the clot', 'Length of intensive care and stay', 'The hospital'],
    },
    faqs: [
      { q: { ar: 'إيه أعراض جلطة المخ اللي متتأجلش؟', en: 'Which stroke symptoms cannot wait?' }, a: { ar: 'ميل في الوش، ضعف أو تنميل في دراع أو رجل، تقل أو لخبطة في الكلام، أو فقدان مفاجئ للنظر. ساعتها روح أقرب طوارئ فورًا.', en: 'Face drooping, weakness or numbness in an arm or leg, slurred or confused speech, or sudden loss of vision. Go to the nearest emergency room immediately.' } },
      { q: { ar: 'هل جلطة المخ ليها علاج؟', en: 'Is there treatment for stroke?' }, a: { ar: 'أيوه، فيه علاجات بتفرق جدًا لو بدأت بدري، منها الأدوية المذيبة وسحب الجلطة بالقسطرة في الحالات المناسبة.', en: 'Yes. Treatments make a real difference when started early, including clot-dissolving medicine and catheter clot removal in suitable cases.' } },
    ],
  },
  {
    slug: 'chronic-subdural-hematoma',
    icon: 'subdural',
    title: { ar: 'النزيف المزمن تحت الأم الجافية', en: 'Chronic Subdural Hematoma (MMA Embolization)' },
    short: {
      ar: 'قفل الشريان المغذي للنزيف المزمن بالقسطرة، لتقليل فرصة رجوعه.',
      en: 'Closing the artery that feeds a chronic subdural bleed by catheter, to reduce the chance of recurrence.',
    },
    whatIs: {
      ar: 'النزيف المزمن تحت الأم الجافية بيحصل غالبًا عند كبار السن بعد خبطة بسيطة، وبيتجمع ببطء. بالقسطرة ممكن نقفل الشريان السحائي الأوسط اللي بيغذي الغشاء حوالين النزيف، لوحده أو مع الجراحة، لتقليل فرص التكرار.',
      en: 'A chronic subdural hematoma often occurs in older adults after a minor head bump and collects slowly. By catheter, the middle meningeal artery feeding the membrane around it can be closed, alone or with surgery, to lower the chance of recurrence.',
    },
    whoFor: {
      ar: ['كبار السن بعد خبطة بسيطة وظهور صداع أو تغير في الوعي', 'نزيف رجع بعد جراحة سابقة', 'مرضى على أدوية سيولة'],
      en: ['Older adults with headache or changes in alertness after a minor bump', 'A bleed that returned after surgery', 'Patients on blood thinners'],
    },
    steps: {
      before: { ar: 'أشعة مقطعية أو رنين وتقييم الأدوية، خصوصًا السيولة.', en: 'CT or MRI and a medication review, especially blood thinners.' },
      during: { ar: 'دخول بالقسطرة لشريان الرأس وقفل الفروع المغذية بمادة دقيقة.', en: 'Catheter access to the head artery and closure of the feeding branches with a fine material.' },
      after: { ar: 'ملاحظة قصيرة، ومتابعة بالأشعة لمتابعة امتصاص النزيف تدريجيًا.', en: 'Short observation and imaging follow-up as the collection is gradually absorbed.' },
    },
    risky: {
      ar: 'إجراء محدود نسبيًا ومناسب لكتير من كبار السن. بنشرح للأهل إمتى يكون مفيد وإمتى الجراحة أنسب.',
      en: 'A relatively limited procedure suitable for many older patients. We explain to the family when it helps and when surgery is more appropriate.',
    },
    costFactors: {
      ar: ['هل الإجراء لوحده أو مع جراحة', 'المادة المستخدمة', 'المستشفى ومدة الإقامة'],
      en: ['Whether it is done alone or with surgery', 'The material used', 'Hospital and length of stay'],
    },
    faqs: [
      { q: { ar: 'هل ده مناسب لسن كبير؟', en: 'Is it suitable for an elderly parent?' }, a: { ar: 'غالبًا أيوه، وده من أسباب اختياره في كبار السن، لكن القرار بعد تقييم الحالة.', en: 'Often yes, which is one reason it is chosen for older adults, but the decision follows an assessment.' } },
    ],
  },
];

export const getProcedure = (slug) => procedures.find((p) => p.slug === slug);
