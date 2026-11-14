const catalog = [
  // 3D Arabalar
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738',
  'https://images.unsplash.com/photo-1555353540-64580b51c258',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd',

  // Telefon Kılıfları
  'https://images.unsplash.com/photo-1601593346740-925612772716',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505',
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab',
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9',
  'https://images.unsplash.com/photo-1563720223185-11003d516935',

  // Kolye
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e',

  // Bileklik
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1',
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0',
  'https://images.unsplash.com/photo-1598560917505-59a3ad559071',
  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0',

  // Diğer Aksesuarlar
  'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
  'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa',
  'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
];

async function verifyAll() {
  let allOk = true;
  for (const url of catalog) {
    try {
      const res = await fetch(url + '?w=800&auto=format&fit=crop&q=80');
      if (res.status !== 200) {
        console.log('FAIL:', res.status, url);
        allOk = false;
      }
    } catch (e) {
      console.log('ERR:', e.message, url);
      allOk = false;
    }
  }
  if (allOk) {
    console.log('SUCCESS: All 26 candidate images returned 200 OK!');
  }
}
verifyAll();
