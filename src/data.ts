/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const CATEGORIES = [
  {
    id: 'almonds',
    name: 'Almonds',
    subtitle: 'Gourmet Selection',
    description: 'Crisp and premium Californian almonds sourced from private orchards.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSRF9bxqrCRA0mx5kjh3OSh5t1RZTX55V9XuT5s2QxngzxdsIG5HiyxVXguix1TBksKw87HXpAhmBLZB9GxuGz4_90GQYJto3Gay-iYpRMrVmfiA1vfWCdiNxtRSMtvA1c82itH7wFLthwoCDwDBp2ACsnJNWx2bA78LyPS_gq8CHhOVOdOIHXlmMrxbkUKp3oVHCJeKz1d3nrQXf6Br34rQRosG9PwK52TkYBgUuPlFsTIZx46hWirVepW0SFRu8m89inGxLCw5W0'
  },
  {
    id: 'cashews',
    name: 'Cashews',
    subtitle: 'Rich & Creamy',
    description: 'Creamy, whole jumbo cashews hand-sorted for size and perfection.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYul6T_VbRsJ-TnQtQnTadBhrkze-pf21MI_XevRl2FOkcLWUeetavSXREbbiCer0YwwmPm7AYNBVPJ_p42Y6QX7qyDnPsc8tgXxhDaocq00jzf1luao-ZtIXxsngbEVCMUPoLofYQpuS67CGKmtl4iqKtxvIPC-5h36wt7yzhs_JdTruoMNyQ1aliwRWQuBfCTwGfcewHs-J_pAyQLDD8Q_3FqvV4TjTRrl4neVl7Soq9T7k-cPzEV8WGZ6KC_3jXoNxnWRXAXY5t'
  },
  {
    id: 'walnuts',
    name: 'Walnuts',
    subtitle: 'Brain Fuel',
    description: 'Chilean walnut halves with rich oils and intricate premium texture.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNCUlcaFJi6oi9KaoHSkzUPblfBA3ODPx8SCslB-WHDOFy4F46EHF4u9J5KsOAsAdl5I7U7JhQoilRndIY_j70-A1-rgXQy-kjZW9qsTx4dGvNAQ4fvhtVuv6aYskccB82KdZ8jFpgMyiOd0dFW06L34ASE2brWHgAjeBR4ytzdgGhtGHHK5S0_yUcv2CbSszouEeLIwTDBBGrX77QNLFEsAV1vRNPTDbxCZzW0i-sB_NnC2ELXAmStoG8Qu7eZgMNZ-lZ-ytbyQ7D'
  },
  {
    id: 'dried_fruits',
    name: 'Dried Fruits',
    subtitle: "Nature's Candy",
    description: 'Vibrant apricots, sweet plums, dates, and luscious berries.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4YhMu-bNt5_c92jxZt7kcgyXPcVbp9PZrT7lmBFX-S5EDyFagqvvRl9_A5W4TFC0j-ZBfcBzZxuuK7TFglA_b55ib_41gvvSQtq_DDURJON7IiJ4wKrehLr-ln9kYq_QJdYuWAmENTdhUyCN9fhCCHYgc8A0ONxqlGCUJ22sbsqEf_ZJ2QzwzSzzzFoRbrFFGnr-6_hw_S7ymZ3bO1J7gQ5Uqc4whj0HZSWVL5b2LYjW4EYA6VzFEchlPnlcvsD4BrrKqMf42GLIh'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'pistachios_01',
    name: 'Roasted Salted Pistachios',
    subtitle: 'Crunchy Premium Kernels',
    description: 'Irresistibly crisp, lightly salted roasted pistachios in premium glass jars. These vibrant green and purple kernels are carefully sourced, slow-roasted to release their natural oils, and seasoned with a touch of hand-harvested sea salt.',
    category: 'mixes',
    price: 850,
    oldPrice: 1100,
    weightOptions: ['250g', '500g', '1kg'],
    priceOptions: {
      '250g': 850,
      '500g': 1600,
      '1kg': 3000
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjkFKtcfiQDrXGLCj65cRbirM9Gp8PSBoNhCWC6w2KC-vR9VSIAjV-EfJdVeIOobLqJ0h33SLIy4CF-CcSDOpyzZtOn-yxRDqKm_afSa9Km3u3P02H7aiTsE81wYRiQ-Ji54Rlpu3rJ68zQ_T9THMb4vb7JnE1tAU3CpAuyJayp6j2NISzTAryWq6JFz9LpE0P7yyP_VOPfqbOlustQwz1LMvay9qO5SFF4CXzedojMrSgP-7q6IGVvSAgxAPO-t44RJ5Dhx_Fnizn',
    isBestseller: true,
    benefits: [
      'Rich in antioxidants and eye-healthy compounds',
      'Packed with high-quality, plant-based protein',
      'Promotes healthy blood vessels and heart health',
      'Lower in calories and high in dietary fibers'
    ]
  },
  {
    id: 'dates_01',
    name: 'Premium Medjool Dates',
    subtitle: 'Organic & Luscious',
    description: 'Known as the "King of Dates," our premium Medjool dates are exceptionally large, moist, and plump with a glossy, deep mahogany finish. Sourced from organic desert orchards, they offer a rich caramel-like sweetness and melting texture.',
    category: 'dried_fruits',
    price: 1250,
    weightOptions: ['500g', '1kg'],
    priceOptions: {
      '500g': 1250,
      '1kg': 2300
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAAsoX9pvhG_8oyZGvpV0afOuNADX5S_pckDWk2QQ9PM_Q62mCVnUE0r5tc9t_MgjsSyrr-fRTCCG-Z3djIl-2DyoIxvl2WcYrPVHBu8FBEG7D5J5zPeYMpdP7lY22Np1vXfIYAu0pQTJvLdBosLTs86Pva-rTTtYV_XIj6JIAiYMuwyZDVPpqLqJEBfAo7bb80_5hiB7OKYkP_i2U7yJEp_Kko__wz6OiFlahi9tV6KfMjuNNbnpuX0ecHR67RC8DatGC8GVvTeAs',
    benefits: [
      'Natural sweet energy source with a low glycemic index',
      'High in potassium, fiber, and essential minerals',
      'Supports optimal digestion and gut health',
      'Contains heart-protective flavonoids'
    ]
  },
  {
    id: 'mix_01',
    name: 'Assorted Roasted Mix',
    subtitle: 'Four-Chamber Gourmet Platter',
    description: 'A luxurious curation of our finest signature roasted bites. Packaged in an elegant four-compartment platter, this mix contains Spicy Peri-Peri Almonds, Honey-Glazed Cashews, Classic Chilean Walnut Halves, and Smoked Salted Macadamias.',
    category: 'mixes',
    price: 950,
    weightOptions: ['400g', '800g'],
    priceOptions: {
      '400g': 950,
      '800g': 1800
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJnusQB26kansPcPYgmgcqrSR95Xl5tYKTGl9oJlxycMTEGOirf7cOY2MkxiYGCf0x_Mq9Jfc57maEeZLrQab_E-NKaQxZPCeWWxBo61Tig-t5kyNwnly062v9EvEX-XZKysneqj4t-yqwEY5U2HH7BEppiGWiPB8tvCd6a6wMwXQvOHcP8fOh5VAE20EXUS-kfFPzx9BNGxreowyTuJFGw21vFMgWTpndu0vK76jOZkS1sbBmgJpxU-L1l3tSU_1LbwAc3MdA8IC',
    isNew: true,
    benefits: [
      'Balanced blend of premium mono-unsaturated fats',
      'Variety of flavor profiles for the ultimate snacking',
      'Beautiful aesthetic for table serving or premium gifting',
      'Loaded with multiple trace minerals and vitamins'
    ]
  },
  {
    id: 'almond_01',
    name: 'Saffron-Infused Royal Almonds',
    subtitle: 'Kashmiri Kesar Coated',
    description: 'Californian jumbo almonds gently misted with genuine Kashmiri Saffron water and dry-roasted to a crispy perfection. Scented, flavorful, and incredibly unique.',
    category: 'almonds',
    price: 900,
    weightOptions: ['250g', '500g', '1kg'],
    priceOptions: {
      '250g': 900,
      '500g': 1750,
      '1kg': 3300
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSRF9bxqrCRA0mx5kjh3OSh5t1RZTX55V9XuT5s2QxngzxdsIG5HiyxVXguix1TBksKw87HXpAhmBLZB9GxuGz4_90GQYJto3Gay-iYpRMrVmfiA1vfWCdiNxtRSMtvA1c82itH7wFLthwoCDwDBp2ACsnJNWx2bA78LyPS_gq8CHhOVOdOIHXlmMrxbkUKp3oVHCJeKz1d3nrQXf6Br34rQRosG9PwK52TkYBgUuPlFsTIZx46hWirVepW0SFRu8m89inGxLCw5W0',
    benefits: [
      'Infused with antioxidant-rich real Kashmiri saffron',
      'High in Vitamin E for glowing skin and cell health',
      'Supports brain development and cognitive clarity',
      'A perfect rich-snack alternative to sweets'
    ]
  },
  {
    id: 'cashew_01',
    name: 'Rosemary Garlic Roasted Cashews',
    subtitle: 'Herbal Savory Infusion',
    description: 'Whole, cream-white jumbo cashews seasoned with freshly ground dry rosemary, toasted garlic flakes, and premium Himalayan pink salt, then slow-baked.',
    category: 'cashews',
    price: 880,
    weightOptions: ['250g', '500g', '1kg'],
    priceOptions: {
      '250g': 880,
      '500g': 1700,
      '1kg': 3200
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYul6T_VbRsJ-TnQtQnTadBhrkze-pf21MI_XevRl2FOkcLWUeetavSXREbbiCer0YwwmPm7AYNBVPJ_p42Y6QX7qyDnPsc8tgXxhDaocq00jzf1luao-ZtIXxsngbEVCMUPoLofYQpuS67CGKmtl4iqKtxvIPC-5h36wt7yzhs_JdTruoMNyQ1aliwRWQuBfCTwGfcewHs-J_pAyQLDD8Q_3FqvV4TjTRrl4neVl7Soq9T7k-cPzEV8WGZ6KC_3jXoNxnWRXAXY5t',
    benefits: [
      'Heart-healthy monounsaturated and polyunsaturated fats',
      'Rich in magnesium, essential for muscle recovery',
      'Unique gourmet herbal taste with low sodium',
      'Sourced directly from certified private farms'
    ]
  },
  {
    id: 'walnut_01',
    name: 'Kashmir Valley Walnut Halves',
    subtitle: 'Premium Cold-Shelled',
    description: 'Crisp, whole butterfly-style walnut halves from the pristine Kashmir valleys. Hand-cracked, carefully sorted to prevent bitterness, and sealed immediately to retain fresh essential oils.',
    category: 'walnuts',
    price: 990,
    weightOptions: ['250g', '500g', '1kg'],
    priceOptions: {
      '250g': 990,
      '500g': 1900,
      '1kg': 3600
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNCUlcaFJi6oi9KaoHSkzUPblfBA3ODPx8SCslB-WHDOFy4F46EHF4u9J5KsOAsAdl5I7U7JhQoilRndIY_j70-A1-rgXQy-kjZW9qsTx4dGvNAQ4fvhtVuv6aYskccB82KdZ8jFpgMyiOd0dFW06L34ASE2brWHgAjeBR4ytzdgGhtGHHK5S0_yUcv2CbSszouEeLIwTDBBGrX77QNLFEsAV1vRNPTDbxCZzW0i-sB_NnC2ELXAmStoG8Qu7eZgMNZ-lZ-ytbyQ7D',
    benefits: [
      'Exceptional plant source of Omega-3 ALA fatty acids',
      'Supports healthy gut bacteria and immune wellness',
      'Provides high levels of polyphenols to fight inflammation',
      'Assists with natural energy levels and metabolic balance'
    ]
  },
  {
    id: 'dried_02',
    name: 'Sun-Dried Turkish Apricots',
    subtitle: 'Honey Sweet Apricot Halves',
    description: 'Perfect whole apricots, hand-selected in Turkey, sun-dried naturally, and left unsulphured for a pure, sweet honey-like flavor. Soft, chewy, and completely natural.',
    category: 'dried_fruits',
    price: 750,
    weightOptions: ['250g', '500g', '1kg'],
    priceOptions: {
      '250g': 750,
      '500g': 1400,
      '1kg': 2600
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4YhMu-bNt5_c92jxZt7kcgyXPcVbp9PZrT7lmBFX-S5EDyFagqvvRl9_A5W4TFC0j-ZBfcBzZxuuK7TFglA_b55ib_41gvvSQtq_DDURJON7IiJ4wKrehLr-ln9kYq_QJdYuWAmENTdhUyCN9fhCCHYgc8A0ONxqlGCUJ22sbsqEf_ZJ2QzwzSzzzFoRbrFFGnr-6_hw_S7ymZ3bO1J7gQ5Uqc4whj0HZSWVL5b2LYjW4EYA6VzFEchlPnlcvsD4BrrKqMf42GLIh',
    benefits: [
      'Outstanding source of non-heme iron and minerals',
      'Packed with beta-carotene, supporting stellar vision',
      'Naturally high fiber promotes satiety and digestion',
      'Absolutely zero added sugars, artificial colors or preservatives'
    ]
  }
];

export const GIFT_BOX_TYPES = [
  {
    id: 'wooden',
    name: 'Artisanal Hand-Painted Wooden Box',
    description: 'Crafted from sustainable premium timber, beautifully hand-painted by master artisans with traditional heritage gold motifs, lined with plush royal burgundy velvet.',
    price: 1200,
    capacity: 4, // holds up to 4 varieties
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-SmkgAT-TCG8yy8YTNPo-VuEyWpZklJOB9UfP2C0A7IFPvMFd51fod6v_sfRdtHxVR0qm_P6UGKSA0qfGVZ6L_hKgDSevMGrXjoXCHjuMAzGKcmEM-K7JPxhcYz73JOPhhWIfqo34FR1UK9aVwq_xfmOzpqCbc9AYzUwf4MCVK39TyXEfXGaULhjMpXy5aMJRcd3dmvnn4lme1_49oPUsVbt1AKowuRdMZMuKjKQl0aqB3GKq0q-WY9PyrfSuBdIAHtPerzNoVVI4'
  },
  {
    id: 'velvet',
    name: 'Royal Velvet Heritage Box',
    description: 'A deep emerald-green luxury hard box wrapped in premium rich velvet, featuring gold foil-stamped calligraphy patterns and satin compartments.',
    price: 850,
    capacity: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-SmkgAT-TCG8yy8YTNPo-VuEyWpZklJOB9UfP2C0A7IFPvMFd51fod6v_sfRdtHxVR0qm_P6UGKSA0qfGVZ6L_hKgDSevMGrXjoXCHjuMAzGKcmEM-K7JPxhcYz73JOPhhWIfqo34FR1UK9aVwq_xfmOzpqCbc9AYzUwf4MCVK39TyXEfXGaULhjMpXy5aMJRcd3dmvnn4lme1_49oPUsVbt1AKowuRdMZMuKjKQl0aqB3GKq0q-WY9PyrfSuBdIAHtPerzNoVVI4'
  },
  {
    id: 'heritage',
    name: 'Syamala Signature Gold Tin',
    description: 'Embossed reusable metallic tin canister in brilliant gold and burgundy finishes, reflecting standard classiness and compact gifting perfection.',
    price: 450,
    capacity: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-SmkgAT-TCG8yy8YTNPo-VuEyWpZklJOB9UfP2C0A7IFPvMFd51fod6v_sfRdtHxVR0qm_P6UGKSA0qfGVZ6L_hKgDSevMGrXjoXCHjuMAzGKcmEM-K7JPxhcYz73JOPhhWIfqo34FR1UK9aVwq_xfmOzpqCbc9AYzUwf4MCVK39TyXEfXGaULhjMpXy5aMJRcd3dmvnn4lme1_49oPUsVbt1AKowuRdMZMuKjKQl0aqB3GKq0q-WY9PyrfSuBdIAHtPerzNoVVI4'
  }
];
