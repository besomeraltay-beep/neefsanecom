import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronDown
} from 'lucide-react';

export default function CorporateModal({
  isOpen,
  modalType, // 'about', 'contact', 'faq', 'shipping', 'privacy', 'terms'
  onClose
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  if (!isOpen || !modalType) return null;

  const titles = {
    about: 'Hakkımızda',
    contact: 'İletişim',
    faq: 'Sıkça Sorulan Sorular',
    shipping: 'Teslimat ve İade Politikası',
    privacy: 'Gizlilik ve Güvenlik Politikası',
    terms: 'Mesafeli Satış Sözleşmesi'
  };

  const faqs = [
    {
      q: '3D renkli araba figürleri hangi malzemeden üretiliyor?',
      a: 'Tüm 3D figürlerimiz endüstriyel çok renkli FDM/SLA yazıcılar ile 0.08mm katman hassasiyetinde, darbelere ve UV güneş ışınlarına dayanıklı biyolojik PLA+ malzemeden üretilmektedir.'
    },
    {
      q: 'Kolyeler ve bileklikler suda veya denizde kararır mı?',
      a: 'Takı koleksiyonumuz 316L medikal sınıf cerrahi titanyum çelikten üretilmiştir. Kesinlikle paslanma, kararma veya tende renk bırakma yapmaz. Suya, tere ve parfüme dayanıklıdır.'
    },
    {
      q: 'Siparişim ne zaman kargoya verilir?',
      a: 'Hafta içi saat 16:00\'a kadar verilen tüm siparişler aynı gün özenle paketlenerek anlaşmalı kargo firmamıza teslim edilir. Tahmini teslimat süresi 1-2 iş günüdür.'
    },
    {
      q: 'Ürünü beğenmezsem nasıl iade edebilirim?',
      a: 'Siparişinizi teslim aldığınız tarihten itibaren 14 gün içerisinde koşulsuz ve kolay iade hakkınız bulunmaktadır. İade talebi için iletişim kanallarımızdan bize ulaşmanız yeterlidir.'
    },
    {
      q: 'Ödeme güvenliği nasıl sağlanıyor?',
      a: 'Web sitemiz üzerinden yapılan tüm işlemler 256-Bit SSL güvenlik sertifikası ve 3D Secure banka onay kodu ile şifrelenir. Kredi kartı bilgileriniz sistemimizde kesinlikle saklanmaz.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[85vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider">NEEFSANE Kurumsal</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">{titles[modalType]}</h2>
        </div>

        {/* Modal Content based on modalType */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm text-gray-600 leading-relaxed">
          
          {modalType === 'about' && (
            <div className="space-y-4">
              <p>
                <strong>NEEFSANE</strong>, modern yaşam tarzını yansıtan özel tasarım aksesuarları, dayanıklı telefon kılıflarını ve yüksek hassasiyetli 3D figürleri tek bir çatı altında buluşturan özgün bir e-ticaret markasıdır.
              </p>
              <p>
                Amacımız; sıradanlıktan uzak, tasarım ve fonksiyonelliği bir arada sunan kaliteli ürünleri güvenilir ve hızlı bir alışveriş deneyimiyle sizlere ulaştırmaktır.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-900 mb-1">Özgün Tasarım</div>
                  <div className="text-xs text-gray-500">Masaüstü ve kişisel stilinizi tamamlayan seçkin koleksiyonlar.</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-900 mb-1">Müşteri Memnuniyeti</div>
                  <div className="text-xs text-gray-500">Hızlı kargo, koşulsuz 14 gün iade ve satış sonrası tam destek.</div>
                </div>
              </div>
            </div>
          )}

          {modalType === 'contact' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">
                Sorularınız, toptan talepleriniz veya önerileriniz için aşağıdaki kanallardan bize dilediğiniz zaman ulaşabilirsiniz:
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <Mail className="w-5 h-5 text-[#C2410C]" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">E-Posta Destek</div>
                    <div className="text-xs text-gray-500">destek@neefsane.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <Phone className="w-5 h-5 text-[#C2410C]" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Müşteri Hizmetleri & WhatsApp</div>
                    <div className="text-xs text-gray-500">+90 (850) 840 00 00 (Hafta içi 09:00 - 18:00)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <MapPin className="w-5 h-5 text-[#C2410C]" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Ofis & Atölye</div>
                    <div className="text-xs text-gray-500">Maslak Mah. Büyükdere Cad. No: 255 Sarıyer / İstanbul</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {modalType === 'faq' && (
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                    className="w-full p-3.5 text-left font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs sm:text-sm cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="p-3.5 text-xs text-gray-600 bg-white border-t border-gray-200 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {modalType === 'shipping' && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">1. Kargo ve Teslimat Süreçleri</h4>
              <p>
                Siparişleriniz anlaşmalı kargo firmamız güvencesiyle gönderilmektedir. 500 TL ve üzeri alışverişlerinizde kargo ücretsizdir. 500 TL altındaki siparişler için standart kargo bedeli 49 TL'dir.
              </p>
              <h4 className="font-bold text-gray-900 pt-2">2. İade ve Değişim Koşulları</h4>
              <p>
                Teslim aldığınız ürünleri, ambalajı bozulmamış ve yeniden satılabilirliği kaybolmamış şekilde 14 gün içerisinde herhangi bir gerekçe göstermeksizin iade edebilirsiniz. İade edilen ürünler tarafımıza ulaştıktan sonra 3 iş günü içinde kartınıza geri iade edilir.
              </p>
            </div>
          )}

          {modalType === 'privacy' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-gray-900 text-sm">Gizlilik ve Güvenlik Bildirimi</h4>
              <p>
                NEEFSANE olarak kişisel verilerinizin güvenliğine en üst düzeyde önem veriyoruz. Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında bilgileriniz yalnızca sipariş teslimi ve müşteri hizmetleri amacıyla işlenmektedir.
              </p>
              <p>
                Ödeme işlemlerinde kullanılan kredi kartı bilgileri sistemlerimizde tutulmaz; doğrudan 256-bit SSL güvenlik sertifikalı banka ödeme ağ geçitleri üzerinden onaylanır.
              </p>
            </div>
          )}

          {modalType === 'terms' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-gray-900 text-sm">Mesafeli Satış Sözleşmesi Özeti</h4>
              <p>
                İşbu sözleşme 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca alıcı ve satıcı arasındaki hak ve yükümlülükleri düzenler.
              </p>
              <p>
                Alıcı, web sitesi üzerinden sipariş verdiği anda sipariş konusu ürünün temel nitelikleri, satış fiyatı, ödeme şekli ve teslimat koşullarına ilişkin ön bilgileri okuyup bilgi sahibi olduğunu kabul ve teyit eder.
              </p>
            </div>
          )}

        </div>

        {/* Close CTA */}
        <div className="pt-4 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
