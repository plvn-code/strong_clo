/**
 * STRONG catalogue — the assortment the store manager (Юра, @podgaynyy11) sent on 2026-11-25:
 * names, prices («X грн замість Y» → price / oldPrice), colours, sizes and descriptions come only
 * from his messages (research/pod-messages.json); photos are his original files → message id →
 * public/images/p/<id>.webp (3:4, 960×1280). `source` = id of the message with the description.
 * Ids below 3000 are older photos from the brand's Telegram channel (research/tg-all.json).
 * `price: null` — the manager did not send a price → «Ціна за запитом», ordered via the manager.
 * `sizesConfirmed: false` — sizes were not stated (see docs/STATUS.md).
 */

export type CategoryId = "puffers" | "vests" | "suits-demi" | "suits-winter" | "shirts" | "tees" | "longs" | "knit" | "thermo" | "pants";

export interface Colour {
  name: string;
  hex: string;
  photos: number[];
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  /** extra categories the model also shows up in */
  also?: CategoryId[];
  /** current price, UAH; null = price on request */
  price: number | null;
  /** «замість …» price, UAH */
  oldPrice?: number;
  sizes: string[];
  sizesConfirmed?: boolean;
  colours: Colour[];
  /** one sentence built from the manager's description */
  lead: string;
  /** bullet facts as the manager wrote them */
  details: string[];
  isNew?: boolean;
  bestseller?: boolean;
  /** message with the description */
  source: number;
}

const TWO = ["XS/S", "M/L"];
const ONE = ["One size"];

const C = {
  black: "#0d0d0d",
  milk: "#efe9de",
  ivory: "#f3eee2",
  choco: "#3f2a20",
  mocha: "#8a6c58",
  graphite: "#4a4c51",
  burgundy: "#5e1420",
  cherry: "#4a1420",
  melange: "#b7b5b0",
  grey: "#8f8f8f",
  beige: "#cdb89c",
  navy: "#1c2340",
  electric: "#1f3aa8",
};

export const PRODUCTS: Product[] = [
  // ───────────── Fall Winter 26/27 ─────────────
  {
    slug: "kostyum-over-na-flisi",
    name: "Костюм OVER на флісі",
    category: "suits-winter",
    price: 2950,
    oldPrice: 3150,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Сірий меланж", hex: C.melange, photos: [3298, 3299, 3300, 3301] },
      { name: "Чорний", hex: C.black, photos: [3302, 3303, 3304, 3305] },
    ],
    lead: "Оверсайз-костюм на теплому флісі: обʼємна кофта на замку з капюшоном і вільні прямі штани.",
    details: ["Утеплення — фліс", "Вільний OVER-крій", "Затяжки внизу кофти й штанів", "Розміри XS/S та M/L"],
    isNew: true,
    bestseller: true,
    source: 3297,
  },
  {
    slug: "kostyum-polar-z-kapiushonom",
    name: "Костюм з флісу полар з капюшоном",
    category: "suits-winter",
    price: 2990,
    oldPrice: 3290,
    sizes: TWO,
    sizesConfirmed: false,
    colours: [
      { name: "Графіт", hex: C.graphite, photos: [3307, 3308, 3309, 3310] },
      { name: "Шоколадний", hex: C.choco, photos: [3311, 3312, 3313, 3314] },
    ],
    lead: "Костюм з мʼякого флісу полар: кофта з капюшоном, затяжки на кофті й штанах і фірмова вишивка.",
    details: ["Мʼякий фліс полар", "Затяжки на кофті і штанах", "Фірмова вишивка"],
    isNew: true,
    bestseller: true,
    source: 3306,
  },
  {
    slug: "kostyum-polar",
    name: "Костюм з флісу полар",
    category: "suits-winter",
    price: 2890,
    oldPrice: 3190,
    sizes: TWO,
    sizesConfirmed: false,
    colours: [
      { name: "Графіт", hex: C.graphite, photos: [3316, 3317, 3318] },
      { name: "Шоколадний", hex: C.choco, photos: [3320, 3319, 3321] },
      { name: "Молочний", hex: C.milk, photos: [3322, 3323, 3324] },
    ],
    lead: "Костюм з мʼякого флісу полар із затяжками на кофті й штанах і фірмовою вишивкою.",
    details: ["Мʼякий фліс полар", "Затяжки на кофті і штанах", "Фірмова вишивка"],
    isNew: true,
    bestseller: true,
    source: 3315,
  },
  {
    slug: "puhovyk-lakovyi",
    name: "Лаковий пуховик",
    category: "puffers",
    price: 3950,
    oldPrice: 4150,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3641, 3335] },
      { name: "Бордовий", hex: C.burgundy, photos: [3332, 3333, 3334] },
      { name: "Темно-синій", hex: C.navy, photos: [3329, 3330, 3331] },
      { name: "Молочний", hex: C.milk, photos: [3326, 3327, 3328] },
    ],
    lead: "Пуховик з лакової вологостійкої тканини з капюшоном на кнопках і наповнювачем еко-пух.",
    details: ["Лакова вологостійка тканина", "Затяжки внизу", "Металева фурнітура", "Капюшон на кнопках", "Наповнювач еко-пух", "Розміри XS/S та M/L"],
    isNew: true,
    bestseller: true,
    source: 3325,
  },
  {
    slug: "viazanyi-kostyum",
    name: "Вʼязаний костюм",
    category: "knit",
    price: 2990,
    oldPrice: 3350,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Сірий", hex: C.grey, photos: [3337, 3338, 3339, 3340] },
      { name: "Темно-синій", hex: C.navy, photos: [3342, 3341, 3343, 3344] },
    ],
    lead: "Вʼязаний костюм з якісної пряжі: кофта на замку з металевою фурнітурою і прямі штани.",
    details: ["Кофта на замку і прямі штани", "Металева фурнітура", "Якісна пряжа", "Розміри XS/S та M/L"],
    isNew: true,
    source: 3336,
  },
  {
    slug: "kombinezon-z-uteplenniam",
    name: "Утеплений комбінезон",
    category: "thermo",
    price: 1990,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [{ name: "Чорний", hex: C.black, photos: [3346, 3595, 3596, 3597, 3598] }],
    lead: "Комбінезон з еластичної термотканини з мʼяким флісом усередині та поясом, що гарно моделює фігуру.",
    details: [
      "Еластична термотканина — вбирає вологу, зберігає тепло",
      "Усередині мʼякий фліс",
      "Пояс іде в комплекті окремо — виріб можна носити і без нього",
      "Розміри XS/S та M/L",
    ],
    isNew: true,
    source: 3345,
  },
  {
    slug: "termokomplekt",
    name: "Термокомплект: лонгслів + лосини",
    category: "thermo",
    price: 1680,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [{ name: "Чорний", hex: C.black, photos: [3349, 3348, 3350, 3352, 3351, 3589, 3588, 3590, 3591, 3593, 3592] }],
    lead: "Термобілизна з еластичної тканини, що не сковує рухів: лонгслів і лосини з мʼяким шаром утеплення.",
    details: [
      "Еластична термотканина, що не сковує рухів",
      "Вбирає вологу, зберігає тепло",
      "Усередині мʼякий шар утеплення",
      "Фірмова накатка STRONG",
      "Лонгслів і лосини можна носити як окремі речі",
      "Розміри XS/S та M/L",
    ],
    isNew: true,
    source: 3347,
  },
  {
    slug: "top-maika-z-lohotypom",
    name: "Топ-майка з логотипом",
    category: "tees",
    price: 680,
    sizes: TWO,
    sizesConfirmed: false,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3355, 3356, 3354] },
      { name: "Молочний з окантовкою", hex: C.milk, photos: [3357, 3358, 3354] },
      { name: "Молочний", hex: C.ivory, photos: [3359] },
    ],
    lead: "Топ-майка з мʼякої еластичної тканини з фірмовим вишитим лого — ідеальна база для гардеробу.",
    details: ["Мʼяка еластична тканина", "Фірмове вишите лого", "Ідеальна база для гардеробу"],
    isNew: true,
    bestseller: true,
    source: 3353,
  },
  {
    slug: "top-maika-z-lohotypom-melanzh",
    name: "Топ-майка з логотипом, сірий меланж",
    category: "tees",
    price: 780,
    sizes: TWO,
    sizesConfirmed: false,
    colours: [{ name: "Сірий меланж", hex: C.melange, photos: [3364, 3361, 3362, 3363] }],
    lead: "Топ-майка з мʼякої еластичної тканини з фірмовим вишитим лого — ідеальна база для гардеробу.",
    details: ["Мʼяка еластична тканина", "Фірмове вишите лого", "Ідеальна база для гардеробу"],
    isNew: true,
    bestseller: true,
    source: 3360,
  },

  // ───────────── Верхній одяг: пуховики / куртки ─────────────
  {
    slug: "puhovyk-oversize",
    name: "Пуховик oversize",
    category: "puffers",
    price: 3950,
    oldPrice: 4150,
    sizes: ONE,
    sizesConfirmed: true,
    colours: [
      { name: "Мокко", hex: C.mocha, photos: [3372, 3373, 3374] },
      { name: "Чорний", hex: C.black, photos: [3368, 3369, 3370] },
      { name: "Графіт", hex: C.graphite, photos: [3376, 3377, 3378] },
      { name: "Шоколадний", hex: C.choco, photos: [3379, 3380, 3381] },
      { name: "Молочний", hex: C.milk, photos: [3382, 3383, 3384] },
    ],
    lead: "Пуховик oversize-фасону з вологостійкої тканини з капюшоном на кнопках і наповнювачем еко-пух.",
    details: ["Вологостійка тканина", "Затяжки внизу", "Металева фурнітура", "Капюшон на кнопках", "Наповнювач еко-пух", "Розмір one size"],
    source: 3367,
  },
  {
    slug: "puhovyk-na-zapakh",
    name: "Пуховик на запах",
    category: "puffers",
    price: 3650,
    oldPrice: 3950,
    sizes: ONE,
    sizesConfirmed: true,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3386, 3387, 3388] },
      { name: "Молочний", hex: C.milk, photos: [3390, 3389, 3391] },
      { name: "Шоколадний", hex: C.choco, photos: [3393, 3392, 3394] },
    ],
    lead: "Пуховик на запах з вологостійкої тканини з додатковими завʼязками всередині та наповнювачем еко-пух.",
    details: ["Вологостійка тканина", "Додаткові завʼязки всередині", "Наповнювач еко-пух", "Розмір one size"],
    source: 3385,
  },
  {
    slug: "puhovyk-barkhatnyi",
    name: "Пуховик з бархатним ефектом",
    category: "puffers",
    price: null,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Electric blue", hex: C.electric, photos: [3396, 3397, 3398] },
      { name: "Burgundy", hex: C.burgundy, photos: [3399, 3400, 3401] },
    ],
    lead: "Пуховик з вологостійкої тканини з візуальним бархатним ефектом і капюшоном на кнопках.",
    details: ["Вологостійка тканина з візуальним бархатним ефектом", "Затяжки внизу", "Металева фурнітура", "Капюшон на кнопках", "Розміри XS/S та M/L"],
    source: 3395,
  },
  {
    slug: "puhovyk-transformer",
    name: "Пуховик-трансформер 2в1",
    category: "puffers",
    also: ["vests"],
    price: 4100,
    oldPrice: 4500,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3407, 3408, 3409, 3410] },
      { name: "Айворі", hex: C.ivory, photos: [3411, 3412, 3413, 3414] },
      { name: "Шоколадний", hex: C.choco, photos: [3405, 3403, 3404, 3406] },
    ],
    lead: "Пуховик з відстібними рукавами — його можна носити і як жилет. Капюшон на молнії.",
    details: ["Вологостійка тканина", "Капюшон на молнії", "Відстібні рукави", "Розміри XS/S та M/L"],
    source: 3402,
  },
  {
    slug: "kurtka-z-khutrom",
    name: "Утеплена куртка з хутром",
    category: "puffers",
    price: 4490,
    oldPrice: 5100,
    sizes: TWO,
    sizesConfirmed: false,
    colours: [{ name: "Шоколадний", hex: C.choco, photos: [3416, 3419, 3417, 3418, 3420, 3421] }],
    lead: "Куртка з теплої пальтової тканини з додатковим утепленням і знімним еко-хутром на ґудзиках.",
    details: ["Тепла пальтова тканина", "Додаткове утеплення всередині", "Знімне еко-хутро на ґудзиках", "Куліски на талії"],
    source: 3415,
  },

  // ───────────── Жилетки / піджаки ─────────────
  {
    slug: "zhylet-na-knopkakh",
    name: "Жилет на кнопках",
    category: "vests",
    price: 1690,
    oldPrice: 1990,
    sizes: ONE,
    sizesConfirmed: false,
    colours: [
      { name: "Шоколадний", hex: C.choco, photos: [3424, 3425, 3426] },
      { name: "Чорний", hex: C.black, photos: [3427, 3428, 3429] },
      { name: "Графіт", hex: C.graphite, photos: [3432, 3430, 3431] },
      { name: "Молочний", hex: C.milk, photos: [3433, 3434, 3435] },
    ],
    lead: "Дутий жилет на кнопках з вологостійкої плащівки з еко-пухом усередині.",
    details: ["Вологостійка плащівка", "Еко-пух усередині"],
    source: 3423,
  },
  {
    slug: "zhylet-vkorochenyi",
    name: "Вкорочений жилет",
    category: "vests",
    price: 1670,
    oldPrice: 1970,
    sizes: ONE,
    sizesConfirmed: false,
    colours: [
      { name: "Молочний", hex: C.milk, photos: [3437, 3438, 3439] },
      { name: "Шоколадний", hex: C.choco, photos: [3441, 3440] },
      { name: "Чорний", hex: C.black, photos: [3442, 3443, 3444] },
    ],
    lead: "Вкорочений дутий жилет з вологостійкої плащівки з еко-пухом і затяжками внизу.",
    details: ["Вологостійка плащівка", "Еко-пух усередині", "Затяжки внизу"],
    source: 3436,
  },
  {
    slug: "zhylet-na-poiasi",
    name: "Жилет на поясі",
    category: "vests",
    price: 1790,
    oldPrice: 2090,
    sizes: ONE,
    sizesConfirmed: false,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3452, 3453, 3454] },
      { name: "Шоколадний", hex: C.choco, photos: [3448, 3446, 3447] },
      { name: "Бордовий", hex: C.burgundy, photos: [3451, 3449, 3450] },
    ],
    lead: "Дутий жилет з поясом з вологостійкої плащівки з еко-пухом усередині.",
    details: ["Вологостійка плащівка", "Еко-пух усередині"],
    source: 3445,
  },
  {
    slug: "zhylet-lakovyi",
    name: "Лаковий жилет",
    category: "vests",
    price: 1960,
    oldPrice: 2260,
    sizes: ONE,
    sizesConfirmed: false,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3456, 3457, 3458] },
      { name: "Молочний", hex: C.milk, photos: [3459, 3460, 3461] },
      { name: "Cherry wine", hex: C.cherry, photos: [3463, 3462, 3464] },
    ],
    lead: "Дутий жилет з вологостійкої лакової плащівки з еко-пухом усередині.",
    details: ["Вологостійка лакова плащівка", "Еко-пух усередині"],
    source: 3455,
  },
  {
    slug: "pidzhak-z-cholovichoho-plecha",
    name: "Вкорочений піджак з чоловічого плеча",
    category: "vests",
    also: ["shirts"],
    price: 2690,
    sizes: ONE,
    sizesConfirmed: true,
    colours: [
      { name: "Молочний", hex: C.milk, photos: [3520, 3521, 3522, 3523] },
      { name: "Бежевий", hex: C.beige, photos: [3524, 3525, 3526, 3527] },
      { name: "Чорний", hex: C.black, photos: [3531, 3528, 3529, 3530, 3532] },
    ],
    lead: "Вкорочений піджак з щільної костюмної тканини, крій з чоловічого плеча.",
    details: ["Щільна костюмна тканина", "Крій з чоловічого плеча", "Вкорочений фасон", "Розмір one size"],
    source: 3519,
  },

  // ───────────── Спортивні костюми: осінь / весна ─────────────
  {
    slug: "kostyum-over-bez-uteplennia",
    name: "Костюм OVER без утеплення",
    category: "suits-demi",
    price: 2750,
    oldPrice: 3150,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3471, 3470, 3472, 3473] },
      { name: "Сірий меланж", hex: C.melange, photos: [3468, 3467, 3469, 3474] },
    ],
    lead: "Костюм OVER з тринитки пеньє: штани з кишенею позаду і затяжками внизу, акцентна фірмова вишивка.",
    details: [
      "Тринитка пеньє",
      "Позаду на штанах є кишеня",
      "Затяжки внизу штанів — з прямого фасону можна зробити джогери",
      "Акцентна фірмова вишивка",
      "Розміри XS/S та M/L",
    ],
    source: 3466,
  },
  {
    slug: "kostyum-velurovyi",
    name: "Велюровий костюм",
    category: "suits-demi",
    price: 1990,
    oldPrice: 2290,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Молочний", hex: C.milk, photos: [3476, 3477, 3478, 3479] },
      { name: "Шоколадний", hex: C.choco, photos: [3481, 3480, 3482, 3483] },
      { name: "Сірий меланж", hex: C.melange, photos: [3484, 3485, 3486, 3487] },
    ],
    lead: "Костюм з бавовняного велюру: кофта з капюшоном і металевою фурнітурою та штани прямого фасону.",
    details: [
      "Бавовняний велюр",
      "Кофта з капюшоном та металевою фурнітурою",
      "Штани прямого фасону",
      "Акцентна фірмова вишивка",
      "Розміри XS/S та M/L",
    ],
    source: 3475,
  },
  {
    slug: "zip-kostyum-bez-uteplennia",
    name: "ZIP-костюм без утеплення",
    category: "suits-demi",
    price: 2450,
    oldPrice: 2750,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Молочний", hex: C.milk, photos: [3629, 3627, 3628] },
      { name: "Чорний", hex: C.black, photos: [3630, 3631, 3632] },
      { name: "Сірий меланж", hex: C.melange, photos: [3633, 3634, 3635] },
      { name: "Шоколадний", hex: C.choco, photos: [3489, 3490, 3491] },
    ],
    lead: "Костюм з тринитки пеньє: кофта з капюшоном і металевою фурнітурою та штани прямого фасону.",
    details: ["Тринитка пеньє", "Кофта з капюшоном та металевою фурнітурою", "Штани прямого фасону", "Розміри XS/S та M/L"],
    source: 3488,
  },

  // ───────────── Спортивні костюми: зима ─────────────
  {
    slug: "kostyum-teddy",
    name: "Костюм Teddy",
    category: "suits-winter",
    price: 2750,
    oldPrice: 3150,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Молочний", hex: C.milk, photos: [3495, 3494, 3496] },
      { name: "Шоколадний", hex: C.choco, photos: [3497, 3498, 3499] },
      { name: "Графіт", hex: C.graphite, photos: [3501, 3500, 3502] },
    ],
    lead: "Костюм з мʼякого флісу: кофта з капюшоном і металевою фурнітурою та штани прямого фасону.",
    details: ["Мʼякий фліс", "Штани прямого фасону", "Кофта з капюшоном та металевою фурнітурою", "Розміри XS/S та M/L"],
    source: 3493,
  },
  {
    slug: "kostyum-z-mikroflisu",
    name: "Костюм з мікрофлісу",
    category: "suits-winter",
    price: 2550,
    oldPrice: 2850,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Графіт", hex: C.graphite, photos: [3506, 3505, 3507, 3508] },
      { name: "Шоколадний", hex: C.choco, photos: [3511, 3509, 3510, 3512] },
    ],
    lead: "Костюм з мʼякого мікрофлісу з термовластивостями: вишите лого на кофті та прямі штани із затяжками.",
    details: [
      "Мʼякий мікрофліс — тканина має термовластивості й дуже тепла",
      "Фірмове вишите лого на кофті",
      "Штани прямого фасону із затяжками внизу — можна зробити джогерами",
      "Розміри XS/S та M/L",
    ],
    source: 3504,
  },

  // ───────────── Сорочки ─────────────
  {
    slug: "sorochka-v-klitynku",
    name: "Сорочка в клітинку",
    category: "shirts",
    price: 1250,
    oldPrice: 1750,
    sizes: ONE,
    sizesConfirmed: true,
    colours: [{ name: "Burgundy", hex: C.burgundy, photos: [3517, 3515, 3516, 3518] }],
    lead: "Сорочка вільного oversize-фасону з бавовняної тканини.",
    details: ["Вільний oversize-фасон", "Бавовняна тканина", "Розмір one size"],
    source: 3514,
  },

  // ───────────── Футболки / топи ─────────────
  {
    slug: "bazova-futbolka",
    name: "Базова футболка",
    category: "tees",
    price: 899,
    sizes: ONE,
    sizesConfirmed: true,
    colours: [
      { name: "Молочний", hex: C.milk, photos: [3535, 3536, 3537] },
      { name: "Шоколадний", hex: C.choco, photos: [3538, 3539, 3540] },
      { name: "Чорний", hex: C.black, photos: [3542, 3541, 3543] },
    ],
    lead: "Футболка з щільного куліру помірного oversize-крою.",
    details: ["Щільний кулір", "Помірний oversize-крій", "Розмір one size"],
    source: 3534,
  },
  {
    slug: "futbolka-balance",
    name: "Футболка з принтом Balance",
    category: "tees",
    price: 1099,
    sizes: ONE,
    sizesConfirmed: true,
    colours: [
      { name: "Молочний", hex: C.milk, photos: [3549, 3548, 3550] },
      { name: "Шоколадний", hex: C.choco, photos: [3545, 3546, 3547] },
    ],
    lead: "Футболка з принтом Balance з щільного куліру помірного oversize-крою.",
    details: ["Щільний кулір", "Помірний oversize-крій", "Розмір one size"],
    source: 3544,
  },
  {
    slug: "futbolka-z-merezhyvom",
    name: "Футболка з мереживом",
    category: "tees",
    price: 1290,
    sizes: ONE,
    sizesConfirmed: true,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3556, 3555, 3557] },
      { name: "Молочний", hex: C.milk, photos: [3552, 3553, 3554] },
    ],
    lead: "Футболка з мереживом з щільного куліру помірного oversize-крою.",
    details: ["Щільний кулір", "Помірний oversize-крій", "Розмір one size"],
    source: 3551,
  },

  // ───────────── Лонги / кофти ─────────────
  {
    slug: "bodi-z-dovhym-zamkom",
    name: "Боді з довгим замком",
    category: "longs",
    price: 1299,
    sizes: TWO,
    sizesConfirmed: false,
    colours: [{ name: "Чорний", hex: C.black, photos: [427, 426] }],
    lead: "Елегантний боді з довгим замком і довгим рукавом.",
    details: ["Довгий замок", "Облягаючий силует"],
    source: 3560,
  },
  {
    slug: "khudi-teddy",
    name: "Худі Тедді",
    category: "longs",
    price: 1650,
    oldPrice: 2050,
    sizes: ONE,
    sizesConfirmed: true,
    colours: [
      { name: "Молочний", hex: C.milk, photos: [3563, 3562, 3564] },
      { name: "Шоколадний", hex: C.choco, photos: [3566, 3565, 3567] },
    ],
    lead: "Худі з тканини букле з мʼяким флісом усередині та затяжками по боках.",
    details: ["Усередині мʼякий фліс", "Тканина букле", "По боках є затяжки", "Розмір one size"],
    source: 3561,
  },

  // ───────────── Вʼязані вироби ─────────────
  {
    slug: "svetr-z-vysokoiu-horlovynoiu",
    name: "Светр з високою горловиною",
    category: "knit",
    price: 1695,
    sizes: ONE,
    sizesConfirmed: true,
    colours: [
      { name: "Шоколадний", hex: C.choco, photos: [3576, 3577, 3642] },
      { name: "Бордовий", hex: C.burgundy, photos: [3572, 3573] },
      { name: "Сірий", hex: C.grey, photos: [3570, 3571] },
      { name: "Молочний", hex: C.milk, photos: [3575, 3574] },
    ],
    lead: "Светр вільного фасону з мʼякої приємної пряжі з високою горловиною, що не викликає дискомфорту.",
    details: ["Мʼяка приємна пряжа", "Висока горловина, що не викликає дискомфорту", "Вільний фасон", "Розмір one size"],
    source: 3569,
  },
  {
    slug: "viazana-shapka",
    name: "Вʼязана шапка",
    category: "knit",
    price: 550,
    sizes: ONE,
    sizesConfirmed: false,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3638, 3580, 3579] },
      { name: "Сірий", hex: C.grey, photos: [3636, 3581, 3579] },
      { name: "Графіт", hex: C.graphite, photos: [3585, 3584, 3579] },
      { name: "Молочний", hex: C.milk, photos: [3583, 3582, 3579] },
      { name: "Бежевий", hex: C.beige, photos: [3640, 3584, 3579] },
      { name: "Шоколадний", hex: C.choco, photos: [3639, 3583, 3579] },
    ],
    lead: "Шапка якісної вʼязки з комфортною посадкою.",
    details: ["Якісна вʼязка", "Комфортна посадка"],
    source: 3578,
  },

  // ───────────── Штани / шорти / лосини ─────────────
  {
    slug: "shtany-dzhohery",
    name: "Штани-джогери",
    category: "pants",
    price: 1750,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Сірий меланж · на флісі", hex: C.melange, photos: [3602, 3603, 3604, 3605, 3606, 3601] },
      { name: "Сірий меланж · без утеплення", hex: C.melange, photos: [3602, 3603, 3604, 3605, 3606, 3601] },
    ],
    lead: "Штани-джогери помірного oversize-фасону з фірмовою накаткою STRONG — є на флісі та без утеплення.",
    details: ["Помірний oversize-фасон", "Фірмова накатка STRONG", "Шнурок на поясі", "Є на флісі та без утеплення", "Розміри XS/S та M/L"],
    source: 3600,
  },
  {
    slug: "losyny-zi-shtrypkamy",
    name: "Лосини зі штрипками",
    category: "pants",
    price: null,
    sizes: TWO,
    sizesConfirmed: true,
    colours: [
      { name: "Чорний", hex: C.black, photos: [3610, 3608, 3609] },
      { name: "Шоколадний", hex: C.choco, photos: [3613, 3611, 3612, 3614] },
      { name: "Молочний", hex: C.milk, photos: [3615, 3616, 3617, 3618] },
    ],
    lead: "Лосини з щільного біфлексу зі штрипками через палець, що візуально подовжують ноги.",
    details: ["Щільний біфлекс", "Комфортна посадка", "Штрипки через палець, що візуально подовжують ноги", "Розміри XS/S та M/L"],
    source: 3607,
  },
];
