// "Before your visit" guide. DRAFT medical copy: Dr. Ayman reviews every line before launch.
// General guidance only; the clinic confirms each patient's own instructions. No outcome promises.
const t = (ar, en) => ({ ar, en });

export const guideSections = [
  {
    id: 'consult',
    icon: 'ClipboardList',
    title: t('قبل الكشف', 'Before the consultation'),
    intro: t('الكشف الأول هو اللى بنفهم فيه الحالة كويس. كل ما تجيب ورق أكتر، كل ما الشرح يبقى أوضح.', 'The first visit is where we understand the case properly. The more papers you bring, the clearer the explanation.'),
    items: [
      t('البطاقة الشخصية أو شهادة الميلاد للأطفال', 'National ID, or birth certificate for children'),
      t('كل الأشعة: رنين، مقطعية، أو قسطرة سابقة. السى دى نفسه مع التقرير', 'All imaging: MRI, CT or previous angiography. The CD itself as well as the report'),
      t('آخر تحاليل، خصوصًا وظائف الكلى وصورة الدم والسيولة', 'Recent blood tests, especially kidney function, blood count and clotting'),
      t('الأدوية اللى بتاخدها، أو العلب نفسها لو أسهل', 'The medicines you take, or the boxes themselves if easier'),
      t('حد من العيلة يحضر معاك الشرح', 'A family member to hear the explanation with you'),
      t('أسئلتك مكتوبة فى ورقة أو على الموبايل عشان متنساش حاجة', 'Your questions written down, so nothing is forgotten'),
    ],
  },
  {
    id: 'fasting',
    icon: 'UtensilsCrossed',
    title: t('الصيام قبل القسطرة أو التخدير', 'Fasting before angiography or anaesthesia'),
    intro: t('دى القاعدة العامة. العيادة بتأكدلك المواعيد بالظبط قبل الإجراء بيوم.', 'This is the general rule. The clinic confirms your exact times the day before.'),
    items: [
      t('آخر أكل تقيل قبل الإجراء بـ 6 ساعات على الأقل', 'Last solid meal at least 6 hours before the procedure'),
      t('المية الصافية مسموحة لحد ساعتين قبل الميعاد، إلا لو العيادة قالت غير كده', 'Clear water is allowed up to 2 hours before, unless the clinic says otherwise'),
      t('لو هيبقى فى تخدير كلى، الالتزام بالصيام ضرورى عشان سلامتك', 'If general anaesthesia is planned, fasting is essential for your safety'),
      t('مريض السكر يسأل العيادة عن جرعة الصبح يوم الإجراء', 'Patients with diabetes should ask the clinic about the morning dose on the day'),
    ],
  },
  {
    id: 'meds',
    icon: 'Pill',
    title: t('الأدوية والحساسية', 'Medicines and allergies'),
    intro: t('متوقفش ولا تغير أى دوا من نفسك. قول للعيادة على كل حاجة وهى تقولك تعمل إيه.', 'Do not stop or change any medicine on your own. Tell the clinic everything and they will tell you what to do.'),
    items: [
      t('مضادات التجلط والسيولة (زى الوارفارين أو الأسبرين أو البلافيكس): بلّغ العيادة قبلها بكام يوم', 'Anticoagulants and antiplatelets (such as warfarin, aspirin or clopidogrel): tell the clinic a few days ahead'),
      t('أدوية السكر، خصوصًا الميتفورمين، لأن الصبغة ممكن تحتاج ترتيب معاها', 'Diabetes medicines, especially metformin, because contrast may need planning around them'),
      t('أى حساسية قبل كده من الصبغة أو اليود أو أى دوا', 'Any previous allergy to contrast, iodine or any medicine'),
      t('أمراض الكلى أو الحمل أو احتمال حمل', 'Kidney disease, pregnancy or possible pregnancy'),
    ],
  },
  {
    id: 'day',
    icon: 'CalendarCheck',
    title: t('يوم الإجراء', 'On the day'),
    intro: t('هتعرف كل خطوة قبل ما تحصل. ده وعدنا: بنشرحلك قبل ما نبدأ.', 'You will know each step before it happens. That is our promise: we explain before we begin.'),
    items: [
      t('تعالى قبل ميعادك بنص ساعة على الأقل', 'Arrive at least 30 minutes before your time'),
      t('حد مرافق معاك لازم، لأنك مش هتسوق بعدها', 'Someone must come with you, because you will not drive afterwards'),
      t('هدوم واسعة ومريحة، ومن غير دهب أو إكسسوارات', 'Loose, comfortable clothes, and no jewellery'),
      t('الدكتور بيراجع معاك الخطة ويرد على أسئلتك قبل الإجراء', 'The doctor goes over the plan and answers your questions before the procedure'),
      t('القسطرة غالبًا بتتعمل من شريان الفخد أو الرسغ، والدكتور بيقولك أنهى واحد وليه', 'Angiography is usually done through the groin or the wrist; the doctor tells you which and why'),
      t('بعدها فترة راحة فى السرير لعدد ساعات بيحدده الدكتور', 'Afterwards, bed rest for a number of hours the doctor decides'),
    ],
  },
  {
    id: 'after',
    icon: 'HeartHandshake',
    title: t('بعد ما ترجع البيت', 'After you go home'),
    intro: t('هيكون معاك ورقة مكتوبة بالتعليمات، ورقم تكلمنا عليه لو عندك أى سؤال.', 'You will leave with written instructions and a number to call with any question.'),
    items: [
      t('اشرب مية كويس أول يوم، إلا لو عندك تعليمات غير كده', 'Drink plenty of water on the first day, unless told otherwise'),
      t('متشيلش حاجة تقيلة ومتعملش مجهود كبير كام يوم', 'No heavy lifting or strenuous effort for a few days'),
      t('خلى مكان الإبرة نضيف وناشف حسب التعليمات', 'Keep the puncture site clean and dry as instructed'),
      t('كمّل الأدوية زى ما اتكتبت، واحضر ميعاد المتابعة', 'Continue medicines as prescribed, and come to the follow-up visit'),
    ],
  },
];

export const warningSigns = {
  title: t('كلّم الطوارئ أو العيادة فورًا لو حصل', 'Call emergency services or the clinic straight away if'),
  items: [
    t('نزيف أو تورم بيكبر مكان الإبرة', 'Bleeding or growing swelling at the puncture site'),
    t('ضعف أو تنميل مفاجئ فى الوش أو الدراع أو الرجل', 'Sudden weakness or numbness in the face, arm or leg'),
    t('صعوبة مفاجئة فى الكلام أو النظر', 'Sudden difficulty speaking or seeing'),
    t('صداع شديد ومفاجئ مختلف عن العادى', 'A sudden, severe headache unlike usual'),
    t('برودة أو تغير لون فى الرجل أو الإيد اللى اتعملت منها القسطرة', 'A cold or discoloured leg or hand on the side of the puncture'),
  ],
};

export const guideNote = t(
  'دى معلومات عامة عشان تبقى عارف تتوقع إيه. التعليمات الخاصة بحالتك بتأكدها العيادة معاك، وهى اللى بتمشى عليها.',
  'This is general information so you know what to expect. The instructions for your own case are confirmed with you by the clinic, and those are the ones to follow.'
);
