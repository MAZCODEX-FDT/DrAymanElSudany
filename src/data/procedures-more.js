// Eight more procedure pages (Nov 2026). DRAFT medical copy: Dr. Ayman must confirm he offers each
// procedure and approve every text before launch. Same rules: no prices, no promised results.

const t = (ar, en) => ({ ar, en });
const list = (ar, en) => ({ ar, en });
const qa = (qar, qen, aar, aen) => ({ q: t(qar, qen), a: t(aar, aen) });

export const moreProcedures = [
  {
    slug: 'intracranial-stenting',
    icon: 'intracranial',
    title: t('دعامة شرايين المخ', 'Intracranial Artery Stenting'),
    short: t('توسيع الضيق فى شرايين المخ من جوه الجمجمة، لما الأدوية لوحدها مش كفاية.', 'Widening a narrowing in the arteries inside the skull when medication alone is not enough.'),
    whatIs: t(
      'بعض الجلطات بتحصل بسبب ضيق فى شريان جوه الجمجمة نفسها. فى حالات مختارة، وبعد تجربة العلاج الدوائى، ممكن نوسّع الضيق ببالونة دقيقة ونركّب دعامة عن طريق القسطرة، من غير فتح الجمجمة.',
      'Some strokes are caused by a narrowing in an artery inside the skull itself. In selected cases, after medical treatment has been tried, the narrowing can be widened with a fine balloon and a stent placed by catheter, without opening the skull.'
    ),
    whoFor: list(
      ['ضيق شديد فى شريان داخل الجمجمة ظهر فى الأشعة', 'تكرار أعراض الجلطة رغم الالتزام بالعلاج الدوائى', 'بعد تقييم كامل يوضح إن الضيق هو السبب'],
      ['Severe narrowing of an artery inside the skull on imaging', 'Repeated stroke symptoms despite proper medical treatment', 'After a full assessment shows the narrowing is the cause']
    ),
    steps: {
      before: t('قسطرة تشخيصية أو أشعة دقيقة، وبدء أدوية مضادة للصفايح قبلها بأيام.', 'Diagnostic angiography or detailed imaging, and antiplatelet medication started days before.'),
      during: t('دخول من شريان الفخذ أو الرسغ، ثم بالونة دقيقة ودعامة فى مكان الضيق، غالبًا تحت تخدير كلى.', 'Access via the groin or wrist, then a fine balloon and stent at the narrowing, usually under general anesthesia.'),
      after: t('ملاحظة فى المستشفى يوم أو أكتر، واستمرار الأدوية، ومتابعة منتظمة بالأشعة.', 'A day or more of hospital observation, continued medication and regular imaging follow-up.'),
    },
    risky: t(
      'القرار هنا بيتاخد بعناية، لأن العلاج الدوائى المنتظم بيكفى ناس كتير. بنشرح لحضرتك وللأهل الفرق بين الاختيارين بصراحة قبل أى خطوة.',
      'This decision is taken carefully, because regular medical treatment is enough for many people. We explain the difference between the two options honestly to you and your family before any step.'
    ),
    costFactors: list(['نوع الدعامة والبالونة', 'المستشفى ومدة الإقامة', 'نوع التخدير'], ['The type of stent and balloon', 'Hospital and length of stay', 'Type of anesthesia']),
    faqs: [qa('هل كل ضيق فى شرايين المخ محتاج دعامة؟', 'Does every narrowing need a stent?', 'لأ. ناس كتير بيكفيهم العلاج الدوائى والمتابعة، والدعامة لحالات مختارة بعد تقييم.', 'No. Many people do well with medication and follow-up; a stent is for selected cases after assessment.')],
  },
  {
    slug: 'vertebral-artery-stenting',
    icon: 'vertebral',
    title: t('دعامة الشريان الفقرى', 'Vertebral Artery Stenting'),
    short: t('علاج ضيق الشريان الفقرى اللى بيغذى مؤخرة المخ، عن طريق القسطرة.', 'Treating narrowing of the vertebral artery, which supplies the back of the brain, by catheter.'),
    whatIs: t(
      'الشرايين الفقرية بتطلع من الرقبة وبتغذى المخيخ وجذع المخ. الضيق فيها ممكن يسبب دوخة متكررة أو عدم اتزان أو جلطات فى مؤخرة المخ. فى حالات مختارة بنوسّع الضيق ونركّب دعامة بالقسطرة.',
      'The vertebral arteries rise through the neck and supply the cerebellum and brainstem. Narrowing can cause recurrent dizziness, imbalance or strokes at the back of the brain. In selected cases the narrowing is widened and a stent placed by catheter.'
    ),
    whoFor: list(
      ['ضيق ملحوظ فى الشريان الفقرى فى الأشعة', 'دوخة أو عدم اتزان متكرر مرتبط بالضيق بعد التقييم', 'جلطة فى مؤخرة المخ بسبب الضيق'],
      ['Significant vertebral artery narrowing on imaging', 'Recurrent dizziness or imbalance linked to the narrowing after assessment', 'A stroke at the back of the brain caused by the narrowing']
    ),
    steps: {
      before: t('تقييم بالأشعة وتأكيد إن الأعراض سببها الضيق، وبدء الأدوية المناسبة.', 'Imaging assessment to confirm the symptoms come from the narrowing, and starting the right medication.'),
      during: t('دخول من شريان الفخذ أو الرسغ، وتركيب دعامة فى مكان الضيق.', 'Access via the groin or wrist and a stent placed at the narrowing.'),
      after: t('ملاحظة يوم تقريبًا، واستمرار الأدوية، ومتابعة بالأشعة.', 'About a day of observation, continued medication and imaging follow-up.'),
    },
    risky: t('مش كل دوخة سببها الشريان. بنتأكد الأول من السبب، وبنشرح لحضرتك كل الاحتمالات قبل القرار.', 'Not every dizziness comes from the artery. We confirm the cause first and explain every possibility before a decision.'),
    costFactors: list(['نوع الدعامة', 'المستشفى ومدة الإقامة', 'الفحوصات قبل الإجراء'], ['The type of stent', 'Hospital and length of stay', 'Tests before the procedure']),
    faqs: [qa('الدوخة عندى من الشريان؟', 'Is my dizziness from the artery?', 'ممكن، وممكن من أسباب تانية كتير. الكشف والأشعة هما اللى بيحددوا.', 'Possibly, but there are many other causes. The consultation and imaging decide.')],
  },
  {
    slug: 'dural-av-fistula',
    icon: 'fistula',
    title: t('الناسور الشريانى الوريدى الجافى', 'Dural Arteriovenous Fistula'),
    short: t('قفل الوصلة الغير طبيعية بين شريان ووريد فى أغشية المخ، عن طريق القسطرة.', 'Closing an abnormal connection between an artery and a vein in the brain’s coverings, by catheter.'),
    whatIs: t(
      'الناسور الجافى وصلة مباشرة بين شريان ووريد فى الغشاء اللى حوالين المخ. ممكن يسبب صوت نبض فى الودن، أو صداع، أو فى حالات أقل نزيف. بالقسطرة بنقفل الوصلة بمواد دقيقة من جوه الشرايين أو الأوردة.',
      'A dural fistula is a direct connection between an artery and a vein in the membrane around the brain. It can cause a pulsing sound in the ear, headache or, less often, bleeding. By catheter the connection is closed with fine materials from inside the arteries or veins.'
    ),
    whoFor: list(
      ['صوت نبض مستمر فى الودن (طنين نابض)', 'ناسور ظهر فى الرنين أو القسطرة التشخيصية', 'ناسور بيصرّف على أوردة المخ ويحتاج علاج'],
      ['A constant pulsing sound in the ear (pulsatile tinnitus)', 'A fistula seen on MRI or diagnostic angiography', 'A fistula draining into brain veins that needs treatment']
    ),
    steps: {
      before: t('قسطرة تشخيصية لرسم خريطة دقيقة للوصلة وتحديد طريقة العلاج.', 'Diagnostic angiography to map the connection precisely and plan treatment.'),
      during: t('دخول بالقسطرة وقفل الوصلة بمادة لاصقة طبية أو ملفات دقيقة، غالبًا تحت تخدير كلى.', 'Catheter access and closure of the connection with medical glue or fine coils, usually under general anesthesia.'),
      after: t('ملاحظة فى المستشفى، ومتابعة بالأشعة للتأكد من قفل الوصلة.', 'Hospital observation and imaging follow-up to confirm the connection is closed.'),
    },
    risky: t('كل ناسور ليه شكل مختلف، وبعضها محتاج متابعة بس. بنشرح لحضرتك نوع الحالة وإمتى العلاج مفيد.', 'Every fistula is different, and some only need follow-up. We explain the type and when treatment helps.'),
    costFactors: list(['حجم الوصلة ومكانها', 'المواد المستخدمة', 'عدد الجلسات'], ['The size and location of the connection', 'The materials used', 'The number of sessions']),
    faqs: [qa('الصوت اللى فى ودنى ممكن يكون من المخ؟', 'Could the sound in my ear come from the brain?', 'أحيانًا، خصوصًا لو بيمشى مع النبض. محتاج كشف وأشعة عشان نعرف.', 'Sometimes, especially if it beats with your pulse. A consultation and imaging tell us.')],
  },
  {
    slug: 'carotid-cavernous-fistula',
    icon: 'fistula',
    title: t('ناسور الشريان السباتى الكهفى', 'Carotid-Cavernous Fistula'),
    short: t('علاج الوصلة بين الشريان السباتى والجيب الكهفى ورا العين، بالقسطرة.', 'Treating the connection between the carotid artery and the cavernous sinus behind the eye, by catheter.'),
    whatIs: t(
      'الناسور ده وصلة بين الشريان السباتى ومنطقة وريدية ورا العين. بيظهر غالبًا فى صورة احمرار وبروز فى العين، أو زغللة، أو صوت نبض. بالقسطرة بنقفل الوصلة ونحافظ على مسار الدم الطبيعى.',
      'This fistula is a connection between the carotid artery and a venous area behind the eye. It often shows as a red, bulging eye, blurred or double vision, or a pulsing sound. By catheter the connection is closed while preserving normal blood flow.'
    ),
    whoFor: list(
      ['احمرار وبروز فى العين مع صوت نبض', 'زغللة أو ازدواج فى الرؤية بعد إصابة أو من غير سبب واضح', 'ناسور مؤكد بالأشعة'],
      ['A red, bulging eye with a pulsing sound', 'Blurred or double vision after an injury or without a clear cause', 'A fistula confirmed on imaging']
    ),
    steps: {
      before: t('كشف عيون وأشعة، ثم قسطرة تشخيصية لتحديد نوع الناسور.', 'Eye examination and imaging, then diagnostic angiography to define the fistula type.'),
      during: t('قفل الوصلة بملفات أو مواد دقيقة عن طريق الشريان أو الوريد، تحت تخدير كلى.', 'Closing the connection with coils or fine materials through the artery or vein, under general anesthesia.'),
      after: t('ملاحظة ومتابعة للعين، وتحسن الأعراض بيكون تدريجى.', 'Observation and eye follow-up; symptoms usually improve gradually.'),
    },
    risky: t('بنشرح لحضرتك الخطة كاملة، ودور طبيب العيون معانا فى المتابعة.', 'We explain the whole plan, and the role of the eye doctor in follow-up.'),
    costFactors: list(['نوع الناسور', 'المواد المستخدمة', 'المستشفى ومدة الإقامة'], ['The fistula type', 'The materials used', 'Hospital and length of stay']),
    faqs: [qa('هل ده مرض فى العين؟', 'Is this an eye disease?', 'الأعراض فى العين، لكن السبب فى الأوعية الدموية ورا العين، وعلاجه بالقسطرة.', 'The symptoms are in the eye, but the cause is in the blood vessels behind it, and it is treated by catheter.')],
  },
  {
    slug: 'tumor-embolization',
    icon: 'embolization',
    title: t('قسطرة غلق الشرايين المغذية للأورام', 'Pre-operative Tumor Embolization'),
    short: t('تقليل الدم الواصل لبعض أورام الرأس قبل الجراحة، عشان العملية تبقى أسهل وأأمن.', 'Reducing the blood supply of some head tumors before surgery, to make the operation easier and safer.'),
    whatIs: t(
      'بعض الأورام، زى أورام الأغشية السحائية، بيوصلها دم كتير. قبل الجراحة بأيام قليلة ممكن نقفل الشرايين اللى بتغذيها بالقسطرة، بالتنسيق مع جراح المخ والأعصاب.',
      'Some tumors, such as meningiomas, have a rich blood supply. A few days before surgery, the arteries feeding them can be closed by catheter, in coordination with the neurosurgeon.'
    ),
    whoFor: list(
      ['أورام بيوصلها دم كتير حسب الأشعة', 'بطلب من جراح المخ والأعصاب قبل العملية', 'لتقليل النزيف أثناء الجراحة'],
      ['Tumors with a rich blood supply on imaging', 'At the request of the neurosurgeon before the operation', 'To reduce bleeding during surgery']
    ),
    steps: {
      before: t('مراجعة الأشعة مع الجراح، وتحديد ميعاد الإجراء قريب من ميعاد العملية.', 'Reviewing the imaging with the surgeon and scheduling close to the operation date.'),
      during: t('قسطرة تشخيصية ثم قفل الفروع المغذية للورم بمواد دقيقة.', 'Diagnostic angiography, then closing the tumor’s feeding branches with fine materials.'),
      after: t('ملاحظة لحد ميعاد الجراحة، والتنسيق مع فريق الجراحة.', 'Observation until surgery, in coordination with the surgical team.'),
    },
    risky: t('الإجراء ده خطوة مساعدة للجراحة ومش بديل عنها. القرار بيتاخد مع جراح المخ.', 'This is a step that supports surgery, not a replacement for it. The decision is made with the neurosurgeon.'),
    costFactors: list(['حجم الورم وعدد الشرايين المغذية', 'المواد المستخدمة', 'المستشفى'], ['Tumor size and number of feeding arteries', 'The materials used', 'The hospital']),
    faqs: [qa('هل القسطرة بتعالج الورم؟', 'Does the catheter treat the tumor?', 'لأ، بتجهزه للجراحة عن طريق تقليل الدم الواصل له.', 'No, it prepares for surgery by reducing the tumor’s blood supply.')],
  },
  {
    slug: 'venous-sinus-stenting',
    icon: 'venous',
    title: t('دعامة الجيوب الوريدية للمخ', 'Venous Sinus Stenting'),
    short: t('لحالات ارتفاع ضغط المخ مجهول السبب المرتبط بضيق فى الجيوب الوريدية.', 'For idiopathic intracranial hypertension linked to narrowing of the brain’s venous sinuses.'),
    whatIs: t(
      'ارتفاع ضغط المخ مجهول السبب بيسبب صداع شديد ومشاكل فى النظر، وأحيانًا بيكون مرتبط بضيق فى الأوردة الكبيرة اللى بتصرّف الدم من المخ. فى حالات مختارة بنركّب دعامة فى الوريد لتحسين التصريف.',
      'Idiopathic intracranial hypertension causes severe headache and vision problems, and is sometimes linked to narrowing of the large veins that drain the brain. In selected cases a stent is placed in the vein to improve drainage.'
    ),
    whoFor: list(
      ['ارتفاع ضغط المخ مع ضيق مؤكد فى الجيوب الوريدية', 'أعراض مستمرة رغم العلاج الدوائى', 'خطر على النظر حسب تقييم طبيب العيون'],
      ['Raised brain pressure with a confirmed venous sinus narrowing', 'Persistent symptoms despite medication', 'A risk to vision according to the eye doctor']
    ),
    steps: {
      before: t('قسطرة وريدية لقياس الضغط على جانبى الضيق، وتقييم مع طبيب العيون.', 'A venous study measuring pressure on both sides of the narrowing, with an eye assessment.'),
      during: t('دخول من وريد الفخذ وتركيب دعامة فى مكان الضيق.', 'Access through the groin vein and a stent placed at the narrowing.'),
      after: t('أدوية مضادة للصفايح لفترة، ومتابعة للنظر والصداع.', 'Antiplatelet medication for a period, and follow-up of vision and headache.'),
    },
    risky: t('مش كل ارتفاع فى ضغط المخ محتاج دعامة. بنراجع القياسات معاك وبنشرح إمتى تكون مفيدة.', 'Not every case of raised pressure needs a stent. We review the measurements with you and explain when it helps.'),
    costFactors: list(['قياسات الضغط قبل الإجراء', 'نوع الدعامة', 'المستشفى ومدة الإقامة'], ['Pressure measurements beforehand', 'The type of stent', 'Hospital and length of stay']),
    faqs: [qa('الصداع ده ممكن يأثر على نظرى؟', 'Can this headache affect my vision?', 'ارتفاع ضغط المخ ممكن يأثر على العصب البصرى، عشان كده المتابعة مع طبيب العيون مهمة.', 'Raised brain pressure can affect the optic nerve, which is why eye follow-up matters.')],
  },
  {
    slug: 'spinal-angiography',
    icon: 'spinal',
    title: t('القسطرة التشخيصية للنخاع الشوكى', 'Spinal Angiography'),
    short: t('صورة دقيقة لشرايين النخاع الشوكى لتشخيص التشوهات والوصلات الغير طبيعية.', 'A detailed view of the spinal cord arteries to diagnose malformations and abnormal connections.'),
    whatIs: t(
      'زى القسطرة المخية التشخيصية، لكن لشرايين النخاع الشوكى. بتساعد فى تشخيص تشوهات الأوعية والوصلات الغير طبيعية اللى ممكن تسبب ضعف أو تنميل فى الرجلين أو مشاكل فى التحكم فى البول.',
      'Like cerebral angiography, but for the spinal cord arteries. It helps diagnose vascular malformations and abnormal connections that can cause leg weakness, numbness or bladder problems.'
    ),
    whoFor: list(
      ['اشتباه تشوه فى أوعية النخاع فى الرنين', 'ضعف أو تنميل متدرج فى الرجلين بدون سبب واضح', 'قبل تحديد خطة علاج لتشوه فى النخاع'],
      ['A suspected spinal vascular malformation on MRI', 'Gradual leg weakness or numbness without a clear cause', 'Before planning treatment for a spinal malformation']
    ),
    steps: {
      before: t('رنين على النخاع، وتحاليل، وصيام قبل الإجراء.', 'Spinal MRI, blood tests and fasting before the procedure.'),
      during: t('دخول من شريان الفخذ وتصوير الشرايين المغذية للنخاع واحد واحد، وبياخد وقت أطول من قسطرة المخ.', 'Access via the groin and imaging of each artery supplying the spinal cord; it takes longer than brain angiography.'),
      after: t('راحة تحت الملاحظة، وشرح النتيجة وخطة العلاج لحضرتك وللأهل.', 'Rest under observation, and the results and plan explained to you and your family.'),
    },
    risky: t('إجراء تشخيصى آمن بشكل عام لما بيتعمل على إيد متخصص، وبنشرح لحضرتك كل خطوة قبلها.', 'A generally safe diagnostic procedure in specialist hands, and we explain each step beforehand.'),
    costFactors: list(['عدد الشرايين اللى محتاجة تصوير', 'المستشفى', 'مدة الإقامة'], ['The number of arteries to image', 'The hospital', 'Length of stay']),
    faqs: [qa('ليه الإجراء ده بياخد وقت؟', 'Why does it take longer?', 'لأن النخاع بيتغذى من شرايين كتير صغيرة، وبنصوّر كل واحد فيهم بدقة.', 'Because many small arteries supply the spinal cord, and each one is imaged carefully.')],
  },
  {
    slug: 'vasospasm-treatment',
    icon: 'vasospasm',
    title: t('علاج تقلص شرايين المخ بعد النزيف', 'Cerebral Vasospasm Treatment'),
    short: t('علاج انقباض شرايين المخ اللى ممكن يحصل بعد نزيف تمدد الشرايين، بالقسطرة.', 'Treating the narrowing of brain arteries that can follow a ruptured aneurysm, by catheter.'),
    whatIs: t(
      'بعد نزيف تمدد شرايين المخ، الشرايين ممكن تنقبض فى الأيام اللى بعده وتقلل وصول الدم. لما الأدوية لوحدها مش كفاية، بنوصل بالقسطرة للشريان وبنحقن دوا موسّع، أو نوسّعه ببالونة دقيقة.',
      'After a ruptured brain aneurysm, the arteries can tighten in the following days and reduce blood flow. When medication alone is not enough, a catheter is used to deliver a widening drug into the artery or open it with a fine balloon.'
    ),
    whoFor: list(
      ['مرضى فى الرعاية بعد نزيف تمدد الشرايين', 'ظهور أعراض جديدة مع تقلص مؤكد فى الأشعة', 'لما العلاج الدوائى مش كفاية'],
      ['Patients in intensive care after an aneurysm bleed', 'New symptoms with narrowing confirmed on imaging', 'When medical treatment is not enough']
    ),
    steps: {
      before: t('متابعة لصيقة فى الرعاية المركزة وأشعة للتأكد من التقلص.', 'Close intensive care monitoring and imaging to confirm the narrowing.'),
      during: t('قسطرة وحقن دوا موسّع داخل الشريان، أو توسيع ببالونة دقيقة.', 'A catheter to inject a widening drug into the artery, or to open it with a fine balloon.'),
      after: t('استمرار المتابعة فى الرعاية، وممكن نحتاج نكرر الإجراء.', 'Continued intensive care monitoring; the procedure may need to be repeated.'),
    },
    risky: t('دى فترة صعبة على الأهل. بنتكلم معاكم بانتظام ونشرح كل تطور بوضوح.', 'This is a hard time for the family. We talk with you regularly and explain every change clearly.'),
    costFactors: list(['عدد الجلسات', 'الأدوية والأدوات المستخدمة', 'مدة الرعاية المركزة'], ['The number of sessions', 'The drugs and devices used', 'Length of intensive care']),
    faqs: [qa('ليه التقلص بيحصل بعد النزيف بأيام؟', 'Why does the narrowing happen days after the bleed?', 'لأن الدم حوالين الشرايين بيهيّجها تدريجيًا، وده بيكون غالبًا فى الأسبوعين الأولانيين.', 'Blood around the arteries irritates them gradually, usually within the first two weeks.')],
  },
];
