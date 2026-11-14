export const CATEGORIES = [
  { 
    id: 'all', 
    name: 'Tüm Ürünler', 
    slug: 'tum-urunler',
    description: 'NEEFSANE koleksiyonundaki tüm özel tasarım ürünler',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80'
  },
  { 
    id: '3d-araba-figuru', 
    name: '3D Araba Figürleri', 
    slug: '3d-araba-figuru',
    description: 'Yüksek hassasiyetli 3D baskı, çok renkli detaylı koleksiyon figürleri',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80'
  },
  { 
    id: 'telefon-kilifi', 
    name: 'Telefon Kılıfları', 
    slug: 'telefon-kilifi',
    description: 'Darbe emici, MagSafe uyumlu ve şık koruyucu kılıflar',
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80'
  },
  { 
    id: 'kolye', 
    name: 'Kolye', 
    slug: 'kolye',
    description: 'Kararmaz 316L cerrahi titanyum çelik zincir ve madalyon kolyeler',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
  },
  { 
    id: 'bileklik', 
    name: 'Bileklik', 
    slug: 'bileklik',
    description: 'Doğal taş, hakiki deri ve çelik tokalı günlük kombin bileklikleri',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=80'
  },
  { 
    id: 'diger-aksesuarlar', 
    name: 'Diğer Aksesuarlar', 
    slug: 'diger-aksesuarlar',
    description: 'AirPods kılıfları, araç içi tutucular ve kişisel hediyelikler',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PRODUCTS = [
  // ================= 1. 3D ARABA FİGÜRLERİ =================
  {
    id: 'neef-3d-01',
    name: '3D Renkli Porsche 911 GT3 RS Masaüstü Figürü',
    category: '3d-araba-figuru',
    categoryName: '3D Araba Figürleri',
    price: 850,
    discountPrice: 649,
    rating: 4.9,
    reviewsCount: 348,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'ÇOK SATAN',
    inStock: true,
    stockCount: 8,
    description: 'Yüksek hassasiyetli çok renkli 3D katman baskısıyla üretilmiş ikonik GT3 RS masaüstü sergi figürü. Aerodinamik rüzgarlık, detaylı yarış kaliperleri ve mıknatıslı pleksi standı ile çalışma masanıza estetik bir dokunuş katar.',
    features: [
      'Ölçek: 1:28 (16 cm x 7.5 cm x 5 cm)',
      'Malzeme: Biyouyumlu UV dirençli PLA+ kompozit',
      'Hassasiyet: 0.08mm endüstriyel katman detayı',
      'Pleksi stand ve plaka etiketi dahildir'
    ],
    models: ['16 cm Masaüstü Standlı', '22 cm Büyük Koleksiyon Standlı'],
    colors: [
      { name: 'Kertenkele Yeşili (Lizard Green)', hex: '#65a30d' },
      { name: 'Yarış Sarısı (Speed Yellow)', hex: '#eab308' },
      { name: 'Lava Turuncusu', hex: '#ea580c' },
      { name: 'Alpin Beyazı', hex: '#f8fafc' }
    ]
  },
  {
    id: 'neef-3d-02',
    name: 'Nissan Skyline GT-R R34 Midnight Purple 3D Koleksiyon Figürü',
    category: '3d-araba-figuru',
    categoryName: '3D Araba Figürleri',
    price: 890,
    discountPrice: 699,
    rating: 5.0,
    reviewsCount: 312,
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555353540-64580b51c258?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'YENİ GELEN',
    inStock: true,
    stockCount: 6,
    description: 'JDM efsanesi R34 GT-R V-Spec II. Işığa göre mor ve lacivert tonlarında parlayan özel filament dokusu ve ikonik yuvarlak stop lambaları ile koleksiyonerler için özel olarak modellendi.',
    features: [
      'Midnight Purple özel renk değiştiren kaplama',
      'Ayrıntılı çift yuvarlak stop ve Nismo egzoz hatları',
      'Ağırlaştırılmış kauçuk taban kaidesi',
      'El işçiliği hassas detay rötuşu'
    ],
    models: ['16 cm Standart', '20 cm Koleksiyoner Boyutu'],
    colors: [
      { name: 'Midnight Purple', hex: '#4c1d95' },
      { name: 'Bayside Blue', hex: '#1d4ed8' },
      { name: 'Gümüş Gri', hex: '#94a3b8' }
    ]
  },
  {
    id: 'neef-3d-03',
    name: 'Klasik BMW E30 M3 DTM Yarışçı 3D Standlı Figür',
    category: '3d-araba-figuru',
    categoryName: '3D Araba Figürleri',
    price: 790,
    discountPrice: 589,
    rating: 4.8,
    reviewsCount: 74,
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1555353540-64580b51c258?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1555353540-64580b51c258?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'KLASİK SERİ',
    inStock: true,
    stockCount: 11,
    description: '80lerin efsanevi DTM şampiyonu BMW E30 M3. Genişletilmiş karakteristik kutu çamurlukları ve M Motorsport yarış şeritleriyle çalışma odanıza nostaljik bir hava katar.',
    features: [
      'Karakteristik Boxy DTM geometri detayları',
      'Entegre rüzgarlık ve yarış difüzörü',
      'Dayanıklı ve solmayan biyolojik PLA+',
      'Özel tasarım kutu ambalajı'
    ],
    models: ['15 cm Standart'],
    colors: [
      { name: 'M Spor Beyazı', hex: '#f8fafc' },
      { name: 'Misano Kırmızı', hex: '#dc2626' },
      { name: 'Mat Karbon Siyah', hex: '#18181b' }
    ]
  },
  {
    id: 'neef-3d-04',
    name: 'Cyberpunk Konsept Supercar Fütüristik 3D Figürü',
    category: '3d-araba-figuru',
    categoryName: '3D Araba Figürleri',
    price: 920,
    discountPrice: 729,
    rating: 4.9,
    reviewsCount: 53,
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'FÜTÜRİSTİK',
    inStock: true,
    stockCount: 5,
    description: 'Neon geleceğin hiper otomobil tasarımı. Karanlıkta parlayan fosforlu şeritleri ve keskin origami aerodinamik çizgileriyle dikkat çeker.',
    features: [
      'Lüminesans fosforlu detay hatları',
      'Agresif aerodinamik çift difüzör',
      'Pleksi şeffaf sergi kaidesi'
    ],
    models: ['18 cm Kaideli'],
    colors: [
      { name: 'Neon Camgöbeği & Siyah', hex: '#06b6d4' },
      { name: 'Cyber Turuncu', hex: '#ea580c' }
    ]
  },
  {
    id: 'neef-3d-05',
    name: 'İtalyan Rosso Corsa Spor Araba 3D Masa Figürü',
    category: '3d-araba-figuru',
    categoryName: '3D Araba Figürleri',
    price: 880,
    discountPrice: 679,
    rating: 4.9,
    reviewsCount: 81,
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'ÖZEL SERİ',
    inStock: true,
    stockCount: 7,
    description: 'İtalyan süper spor otomobillerin tutkulu kırmızı çizgileri. Detaylı hava giriş kanalları ve spor jant tasarımı ile tam bir masaüstü sanat eseri.',
    features: [
      'Özel parlak İtalyan kırmızısı pigmentasyon',
      'Dahili pleksi masa standı',
      'Hafif ve darbelere dayanıklı PLA+'
    ],
    models: ['16 cm Masaüstü Standlı'],
    colors: [
      { name: 'Rosso Kırmızı', hex: '#dc2626' },
      { name: 'Modena Sarısı', hex: '#eab308' }
    ]
  },

  // ================= 2. TELEFON KILIFLARI =================
  {
    id: 'neef-case-01',
    name: 'MagSafe Mat Titanyum Zırh Telefon Kılıfı',
    category: 'telefon-kilifi',
    categoryName: 'Telefon Kılıfları',
    price: 499,
    discountPrice: 389,
    rating: 4.9,
    reviewsCount: 224,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'ÇOK SATAN',
    inStock: true,
    stockCount: 35,
    description: 'Telefonunuzun orijinal şıklığını korurken 3 metreye kadar düşmelere karşı askeri düzeyde koruma sağlayan N52 neodimyum manyetik MagSafe kılıf.',
    features: [
      'Güçlü N52 MagSafe manyetik kilitleme',
      'Alüminyum alaşım yükseltilmiş kamera çerçevesi',
      'Sararmaz 4H çizilmeye dirençli polikarbonat',
      'Hassas metalik butonlar'
    ],
    models: [
      'iPhone 16 Pro Max',
      'iPhone 16 Pro',
      'iPhone 16',
      'iPhone 15 Pro Max',
      'iPhone 15 Pro',
      'iPhone 15',
      'Samsung Galaxy S25 Ultra',
      'Samsung Galaxy S24 Ultra'
    ],
    colors: [
      { name: 'Doğal Titanyum Gri', hex: '#64748b' },
      { name: 'Kömür Siyahı', hex: '#0f172a' },
      { name: 'Koyu Lacivert', hex: '#1e3a8a' },
      { name: 'Çöl Titanyumu', hex: '#ca8a04' }
    ]
  },
  {
    id: 'neef-case-02',
    name: 'İpeksi Sıvı Silikon Kadife Astarlı Kılıf',
    category: 'telefon-kilifi',
    categoryName: 'Telefon Kılıfları',
    price: 340,
    discountPrice: 249,
    rating: 4.8,
    reviewsCount: 189,
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'YENİ SEZON',
    inStock: true,
    stockCount: 42,
    description: 'İpeksi yumuşak dokunuşlu sıvı silikon ve iç kısımda çizilmeleri önleyen mikrofiber süet astar. Toz tutmaz ve kolayca temizlenir.',
    features: [
      'İç süet mikrofiber koruyucu katman',
      '360 derece tam saran darbe sönümleyici silikon',
      'Kablosuz hızlı şarj uyumlu ince profil',
      'Leke tutmayan oleofobik dış kaplama'
    ],
    models: [
      'iPhone 16 Pro Max',
      'iPhone 16 Pro',
      'iPhone 15',
      'iPhone 14',
      'Samsung S24 Ultra'
    ],
    colors: [
      { name: 'Adaçayı Yeşili', hex: '#4d7c0f' },
      { name: 'Pudra Pembe', hex: '#f472b6' },
      { name: 'Gece Mavisi', hex: '#1e3a8a' },
      { name: 'Mat Siyah', hex: '#111827' }
    ]
  },
  {
    id: 'neef-case-03',
    name: 'Airbag Köşe Korumalı Kristal Şeffaf Kılıf',
    category: 'telefon-kilifi',
    categoryName: 'Telefon Kılıfları',
    price: 290,
    discountPrice: 199,
    rating: 4.7,
    reviewsCount: 146,
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'FIRSAT',
    inStock: true,
    stockCount: 50,
    description: 'Telefonun orijinal rengini birebir yansıtan kristal berraklık. Güçlendirilmiş 4 köşe hava yastığı ile düşmelere karşı tam koruma.',
    features: [
      'Sararma yapmayan optik polikarbonat',
      'Dört köşede gizli airbag darbe emici',
      '1.5 mm yükseltilmiş kamera çerçevesi',
      'Kaymaz kenar ergonomik tutuş'
    ],
    models: [
      'iPhone 16 Pro',
      'iPhone 16',
      'iPhone 15 Pro',
      'iPhone 15',
      'iPhone 13'
    ],
    colors: [
      { name: 'Kristal Şeffaf', hex: '#f8fafc' },
      { name: 'Duman Grisi Şeffaf', hex: '#64748b' }
    ]
  },
  {
    id: 'neef-case-04',
    name: 'Cyber Mecha Zırhlı & Açılır Standlı Kılıf',
    category: 'telefon-kilifi',
    categoryName: 'Telefon Kılıfları',
    price: 520,
    discountPrice: 399,
    rating: 4.8,
    reviewsCount: 92,
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'ZIRHLI STAND',
    inStock: true,
    stockCount: 18,
    description: 'Arka kamera kapağını korurken aynı zamanda dikey ve yatay video izleme standına dönüşen metalik alaşımlı zırh kılıf.',
    features: [
      'Metal açılır kapanır kamera koruma kapağı ve stand',
      'Çift katmanlı darbe emici polimer gövde',
      'Kaymaz karbon dokulu kenarlar'
    ],
    models: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'Samsung S24 Ultra'],
    colors: [
      { name: 'Titanyum Füme', hex: '#475569' },
      { name: 'Mat Siyah', hex: '#18181b' }
    ]
  },
  {
    id: 'neef-case-05',
    name: 'Hakiki Eskitme Deri Cüzdanlı & Kartlıklı Kılıf',
    category: 'telefon-kilifi',
    categoryName: 'Telefon Kılıfları',
    price: 590,
    discountPrice: 449,
    rating: 4.9,
    reviewsCount: 67,
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'HAKİKİ DERİ',
    inStock: true,
    stockCount: 14,
    description: 'El işçiliği birinci sınıf dana derisi. Arka kısmındaki 2 adet kart yuvası ile cüzdan taşıma zorunluluğunu ortadan kaldırır.',
    features: [
      '%100 Orijinal eskitme hakiki deri',
      '2 adet kart ve nakit yuvası',
      'Manyetik kablosuz şarj desteği',
      'Yumuşak mikrofiber iç astar'
    ],
    models: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 15 Pro'],
    colors: [
      { name: 'Taba Kahve', hex: '#78350f' },
      { name: 'Gece Siyahı', hex: '#0f172a' }
    ]
  },

  // ================= 3. KOLYE =================
  {
    id: 'neef-neck-01',
    name: '316L Cerrahi Çelik Elmas Kesim Küba Zincir Kolye',
    category: 'kolye',
    categoryName: 'Kolye',
    price: 450,
    discountPrice: 329,
    rating: 4.9,
    reviewsCount: 184,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'ÇOK SATAN',
    inStock: true,
    stockCount: 30,
    description: 'Asla paslanmaz, kararmaz ve cildi yeşertmez. Cerrahi medikal sınıf 316L titanyum çelikten imal edilmiş 6mm elmas kesim Küba zincir kolye. Denizde ve duşta güvenle kullanılabilir.',
    features: [
      '316L Medikal Çelik garantisi (Ömür boyu kararmaz)',
      'Hipoalerjenik, nikel içermez',
      'Güçlü ve güvenli kilit mekanizması',
      'Kadife saklama kesesi ile gönderilir'
    ],
    models: ['50 cm (Standart Boy)', '55 cm (Geniş Boy)', '60 cm (Uzun Boy)'],
    colors: [
      { name: 'Parlak Çelik Gümüş', hex: '#e2e8f0' },
      { name: '18K Altın Kaplama', hex: '#eab308' },
      { name: 'Mat Obsidyen Siyah', hex: '#18181b' }
    ]
  },
  {
    id: 'neef-neck-02',
    name: 'Viking Pusulası (Vegvisir) Antik Madalyon Kolye',
    category: 'kolye',
    categoryName: 'Kolye',
    price: 490,
    discountPrice: 369,
    rating: 4.9,
    reviewsCount: 95,
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'ÖZEL TASARIM',
    inStock: true,
    stockCount: 16,
    description: 'Kuzey mitolojisinde yol gösterici koruma sembolü olan Vegvisir pusula kabartmalı, antik oksitlenmiş vintage çelik madalyon ve tilki kuyruğu zincir.',
    features: [
      '30 mm çapında derin kabartmalı çelik madalyon',
      'Çift taraflı detaylı işleme',
      'Suya ve tere tam dayanıklı',
      '60 cm sağlam burgu zincir'
    ],
    models: ['60 cm Burgu Zincir'],
    colors: [
      { name: 'Antik Eskitme Gümüş', hex: '#94a3b8' },
      { name: 'Antik Bronz Altın', hex: '#ca8a04' }
    ]
  },
  {
    id: 'neef-neck-03',
    name: 'Minimalist Geometrik Çelik Bar Kolye',
    category: 'kolye',
    categoryName: 'Kolye',
    price: 380,
    discountPrice: 279,
    rating: 4.8,
    reviewsCount: 58,
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'MİNİMALİST',
    inStock: true,
    stockCount: 22,
    description: 'Sade ve modern tarzı benimseyenler için 4 köşeli dikey çelik çubuk kolye ucu. Günlük kombinlerin zarif tamamlayıcısı.',
    features: [
      '316L Paslanmaz çelik çubuk (4x40 mm)',
      'Hafif ve konforlu günlük kullanım',
      '55 cm ince Venedik zincir'
    ],
    models: ['55 cm İnce Zincir'],
    colors: [
      { name: 'Mat Çelik', hex: '#cbd5e1' },
      { name: 'Kömür Siyahı', hex: '#111827' }
    ]
  },
  {
    id: 'neef-neck-04',
    name: 'İtalyan Elmas Kesim Burgu Çelik Halat Kolye',
    category: 'kolye',
    categoryName: 'Kolye',
    price: 430,
    discountPrice: 319,
    rating: 4.9,
    reviewsCount: 110,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'PARLAK KESİM',
    inStock: true,
    stockCount: 25,
    description: 'Özel burgulu elmas kesimi sayesinde ışığı her açıdan kırarak parlayan 4mm burgu halat zincir kolye. Kararmaz çelik garantisi.',
    features: [
      '4mm kalınlığında yoğun örgü burgu',
      'Lazer elmas kesim kenarlar',
      'Cilde batmayan pürüzsüz doku'
    ],
    models: ['50 cm Zincir', '55 cm Zincir'],
    colors: [
      { name: 'Gümüş Parlak', hex: '#e2e8f0' },
      { name: 'Altın Parlak', hex: '#eab308' }
    ]
  },
  {
    id: 'neef-neck-05',
    name: 'Vintage Kuzey Yıldızı Madalyon Çelik Kolye',
    category: 'kolye',
    categoryName: 'Kolye',
    price: 470,
    discountPrice: 349,
    rating: 4.8,
    reviewsCount: 73,
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'YENİ SEZON',
    inStock: true,
    stockCount: 17,
    description: 'Ortasında parlayan zirkon taşlı sekiz köşeli Kutup Yıldızı motifi bulunan vintage madalyon kolye.',
    features: [
      'Sekiz köşeli yıldız kabartması',
      'Merkezi mikro zirkon taş detayı',
      '55 cm tilki kuyruğu zincir'
    ],
    models: ['55 cm Standart'],
    colors: [
      { name: 'Antik Eskitme Gümüş', hex: '#94a3b8' },
      { name: '18K Altın Kaplama', hex: '#ca8a04' }
    ]
  },

  // ================= 4. BİLEKLİK =================
  {
    id: 'neef-brac-01',
    name: 'Doğal Mat Oniks & Metalik Hematit Enerji Bilekliği',
    category: 'bileklik',
    categoryName: 'Bileklik',
    price: 320,
    discountPrice: 229,
    rating: 4.9,
    reviewsCount: 172,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'DOĞAL TAŞ',
    inStock: true,
    stockCount: 34,
    description: '8mm orijinal mat siyah oniks taşları ve negatif enerjiyi nötrleyen hematit ara halkalarıyla el yapımı elastik bileklik.',
    features: [
      '%100 Orijinal sertifikalı doğal oniks taşları',
      'Japon yüksek mukavemetli elastik kordon',
      'Her bilek ölçüsüne esneyen ergonomik yapı',
      'Özel hediye kutusunda'
    ],
    models: ['M (17-19 cm Bilek)', 'L (19-21 cm Bilek)'],
    colors: [
      { name: 'Mat Oniks Siyahı', hex: '#18181b' },
      { name: 'Metalik Hematit Füme', hex: '#475569' }
    ]
  },
  {
    id: 'neef-brac-02',
    name: 'Çift Katmanlı Hakiki Dana Derisi Manyetik Tokalı Bileklik',
    category: 'bileklik',
    categoryName: 'Bileklik',
    price: 390,
    discountPrice: 289,
    rating: 4.8,
    reviewsCount: 125,
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'EL İŞÇİLİĞİ',
    inStock: true,
    stockCount: 21,
    description: 'Örgü dana derisi ve düz mat deri kordonun güçlü neodimyum mıknatıslı çelik kilit mekanizması ile birleşimi. Günlük ve takım elbise kombinleriyle kusursuz uyum sağlar.',
    features: [
      'Birinci sınıf yumuşak hakiki dana derisi',
      'Emniyet pimli kaymaz mıknatıslı çelik toka',
      'Aşınmaya ve tere dayanıklı özel kaplama'
    ],
    models: ['19 cm (Standart Bilek)', '21 cm (Geniş Bilek)'],
    colors: [
      { name: 'Koyu Taba Kahve & Gümüş Toka', hex: '#78350f' },
      { name: 'Asil Siyah & Mat Siyah Toka', hex: '#18181b' }
    ]
  },
  {
    id: 'neef-brac-03',
    name: 'Minimalist Mat Çelik Kelepçe Bileklik (Bangle)',
    category: 'bileklik',
    categoryName: 'Bileklik',
    price: 350,
    discountPrice: 259,
    rating: 4.8,
    reviewsCount: 64,
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'ZARİF ÇELİK',
    inStock: true,
    stockCount: 26,
    description: 'Açık uçlu ayarlanabilir minimalist paslanmaz çelik kelepçe bileklik. Saat yanına takmak için ideal sade tasarım.',
    features: [
      'Esnetilebilir ergonomik açık tasarım',
      '316L Kararmaz titanyum çelik gövde',
      'Zarif yuvarlatılmış konforlu kenarlar'
    ],
    models: ['Ayarlanabilir Standart'],
    colors: [
      { name: 'Mat Çelik Gri', hex: '#cbd5e1' },
      { name: '18K Altın Kaplama', hex: '#eab308' },
      { name: 'Obsidyen Siyah', hex: '#18181b' }
    ]
  },
  {
    id: 'neef-brac-04',
    name: 'İtalyan Figaro Zincir 316L Çelik Bileklik',
    category: 'bileklik',
    categoryName: 'Bileklik',
    price: 340,
    discountPrice: 239,
    rating: 4.9,
    reviewsCount: 88,
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'KLASİK İTALYAN',
    inStock: true,
    stockCount: 30,
    description: 'Üç kısa bir uzun bakla sıralamasıyla klasik İtalyan Figaro zincir tasarımı. Kararmaz ve renk atmaz.',
    features: [
      '5mm genişliğinde sağlam bakla yapısı',
      'Sağlam yaylı ıstakoz kilit',
      'Ömür boyu paslanmazlık garantisi'
    ],
    models: ['19 cm Bileklik', '21 cm Bileklik'],
    colors: [
      { name: 'Parlak Çelik', hex: '#e2e8f0' },
      { name: 'Altın Kaplama', hex: '#ca8a04' }
    ]
  },
  {
    id: 'neef-brac-05',
    name: 'Kaplan Gözü & Lav Taşı Denge Bilekliği',
    category: 'bileklik',
    categoryName: 'Bileklik',
    price: 310,
    discountPrice: 219,
    rating: 4.8,
    reviewsCount: 76,
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'DOĞAL TAŞ',
    inStock: true,
    stockCount: 28,
    description: 'Kahverengi kaplan gözü taşlarının parlak ipeksi ışıltısı ile gözenekli lav taşlarının harmanlandığı özel el yapımı bileklik.',
    features: [
      'Gerçek Kaplan Gözü ve Lav Taşları (8mm)',
      'Aromaterapi uçucu yağ damlatmaya uygun lav taşları',
      'Yüksek mukavemetli elastik kordon'
    ],
    models: ['M (17-19 cm)', 'L (19-21 cm)'],
    colors: [
      { name: 'Kaplan Gözü Kahve', hex: '#92400e' }
    ]
  },

  // ================= 5. DİĞER AKSESUARLAR =================
  {
    id: 'neef-acc-01',
    name: 'Retro El Konsolu Nostalji AirPods Pro Zırh Kılıfı',
    category: 'diger-aksesuarlar',
    categoryName: 'Diğer Aksesuarlar',
    price: 360,
    discountPrice: 269,
    rating: 4.9,
    reviewsCount: 156,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'ÇOK SATAN',
    inStock: true,
    stockCount: 25,
    description: '90ların ikonik el konsolundan ilham alan 3D kabartmalı silikon AirPods koruma kılıfı. Çantanıza veya kemerinize asabileceğiniz metal karabina askı dahil.',
    features: [
      'Dokunsal 3D kabartma tuşlar',
      'Kutuya dahil metal karabina kanca',
      'Şarj giriş kapağı ve LED durum penceresi',
      'Kablosuz MagSafe şarjı engellemez'
    ],
    models: ['AirPods Pro 2', 'AirPods Pro', 'AirPods 4', 'AirPods 3'],
    colors: [
      { name: 'Klasik Gri Konsol', hex: '#94a3b8' },
      { name: 'Retro Siyah', hex: '#1e293b' }
    ]
  },
  {
    id: 'neef-acc-02',
    name: 'Hakiki Crazy Horse Deri AirPods Kılıfı & Kemer Askısı',
    category: 'diger-aksesuarlar',
    categoryName: 'Diğer Aksesuarlar',
    price: 440,
    discountPrice: 339,
    rating: 4.8,
    reviewsCount: 84,
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'VINTAGE LÜKS',
    inStock: true,
    stockCount: 14,
    description: 'Zamanla kendine has karakterli bir patina kazanan el yapımı hakiki eskitme deri kılıf. Antik pirinç çıtçıt kilidi ile lüks ve dayanıklı koruma.',
    features: [
      '%100 Hakiki Crazy Horse eskitme dana derisi',
      'Antik pirinç sağlam basma çıtçıt',
      'İç süet çizilme önleyici astar'
    ],
    models: ['AirPods Pro 2', 'AirPods Pro', 'AirPods 4'],
    colors: [
      { name: 'Kestane Kahve', hex: '#78350f' },
      { name: 'Koyu Çikolata', hex: '#451a03' }
    ]
  },
  {
    id: 'neef-acc-03',
    name: 'Alüminyum Alaşımlı 360° Mıknatıslı Araç Telefon Tutucu',
    category: 'diger-aksesuarlar',
    categoryName: 'Diğer Aksesuarlar',
    price: 390,
    discountPrice: 289,
    rating: 4.9,
    reviewsCount: 139,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'GÜÇLÜ MANYETİK',
    inStock: true,
    stockCount: 22,
    description: 'Aracınızın havalandırma ızgarasına veya torpidosuna sağlam tutunan, 8 adet N52 güçlü mıknatıslı kompakt alüminyum alaşım tutucu. En sert virajlarda bile telefonunuzu sabit tutar.',
    features: [
      'Havacılık sınıfı eloksallı alüminyum gövde',
      '360 derece dönebilen bilyeli eklem mekanizması',
      'Kutu içeriğinde 2 adet ultra ince metal plaka dahil',
      'Telefon sinyalini ve GPS’i etkilemeyen manyetik alan'
    ],
    models: ['Evrensel Havalandırma & Torpido Tipi'],
    colors: [
      { name: 'Uzay Grisi', hex: '#475569' },
      { name: 'Mat Siyah', hex: '#18181b' }
    ]
  },
  {
    id: 'neef-acc-04',
    name: 'Zırhlı Manyetik Kilitli Karbon AirPods Pro Kılıfı',
    category: 'diger-aksesuarlar',
    categoryName: 'Diğer Aksesuarlar',
    price: 410,
    discountPrice: 299,
    rating: 4.8,
    reviewsCount: 95,
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'GÜVENLİ KİLİT',
    inStock: true,
    stockCount: 19,
    description: 'Düşmelerde kapağın istemsiz açılmasını önleyen emniyet kilit mekanizması ve karbon fiber dokulu dış yüzey.',
    features: [
      'Tek dokunuşla açılan yaylı emniyet mandalı',
      'Darbe emici güçlendirilmiş köşe tamponları',
      'Alaşımlı siyah karabina halka'
    ],
    models: ['AirPods Pro 2', 'AirPods Pro', 'AirPods 4'],
    colors: [
      { name: 'Karbon Siyah', hex: '#18181b' },
      { name: 'Asker Yeşili', hex: '#3f6212' }
    ]
  },
  {
    id: 'neef-acc-05',
    name: 'Titanyum EDC Çok Amaçlı Anahtarlık & Şişe Açacağı',
    category: 'diger-aksesuarlar',
    categoryName: 'Diğer Aksesuarlar',
    price: 320,
    discountPrice: 229,
    rating: 4.9,
    reviewsCount: 68,
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'TİTANYUM EDC',
    inStock: true,
    stockCount: 26,
    description: 'Ultra hafif ve paslanmaz Gr5 titanyum alaşımından üretilmiş kompakt anahtarlık klipsi ve şişe açacağı aparatı.',
    features: [
      'Gr5 Havacılık sınıfı titanyum alaşımı',
      'Sadece 18 gram ağırlık',
      'Entegre şişe açacağı ve kemer klipsi'
    ],
    models: ['Evrensel Standart'],
    colors: [
      { name: 'Kumlama Gri', hex: '#64748b' },
      { name: 'Yanık Mavi Titanyum', hex: '#2563eb' }
    ]
  }
];
