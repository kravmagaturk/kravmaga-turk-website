# ONLINE AKADEMİ V2 — PROJE DURUMU

## Güvenlik / Yayın
- Canlı siteye dokunma: HAYIR. Final onay olmadan live deploy yok.
- Mevcut çalışan auth/register akışı korunacak.
- Firebase Database compat tekrar eklenmeyecek.
- Video kaynağı: Backblaze B2 -> Cloudflare Worker -> Plyr.
- Tam Krav Maga Udemy kursu yeniden indirilmeyecek; modüler video kaynakları kullanılacak.

## Krav Maga Ana Müfredatı
1. Basic Combatives
2. The Best Defense
3. On The Edge
4. Line of Fire

Dim Mak bu yapıda yok.

## Hazır Modüller
- Headlock & Wrist Lock: 7 video, standart adlandırma tamamlandı.
- Ground Fighting: 7 video + 2 görsel referans, standart adlandırma tamamlandı.
- Kick Technique: 15 video, standart adlandırma tamamlandı.
- Mesafeli Dört Yandan Saldırılara Savunma: 6 video, ayrım/adlandırma tamamlandı.
- Yakın Mesafeden Sarmal Saldırılar - Bear Hug: 2 video, Kurt Kapanı dahil.
- On The Edge: ayrı özel hat; kitaba otomatik alınmayacak.
- Sopa Savunma: ayrı özel hat; kitaba otomatik alınmayacak.
- Materyal: ana akademi ve kitap akışından çıkarıldı.

## Test Sistemi
Kapsam:
- Practitioner Level 1-5
- Graduate Level 1-5

Politika:
- Fiziksel video kopyası çoğaltılmayacak.
- Tek ortak video havuzu + seviye manifestleri kullanılacak.
- `test-level-map.json` oluşturuldu.
- Seviye-ders atamaları henüz yapılmadı; kullanıcıdan müfredat seviyelendirmesi geldikçe doldurulacak.

Mevcut ortak test havuzu:
- 01-tanitim.mp4
- 03-mesafeli-saldirilar.mp4
- 04-mesafesiz-saldirilar.mp4
- 05-boyun-kilit.mp4
- 06-bilek-kilit.mp4
- 07-tekmeler.mp4
- 12-yere-dusme-sonrasi-tekme-savunmasi.mp4

Eksik / doğrulanacak:
- 02 Temel Hareketler
- 08 Yer Hareketleri

Ayrı silah testleri:
- 09 Sopa
- 10 Bıçak
- 11 Tabanca

## Yapı Dosyaları
- `academy-curriculum-map.json` — 4 ana Krav Maga başlığı ve modül eşleştirmesi.
- `test-level-map.json` — P1-P5 / G1-G5 test manifest iskeleti.
- `basic-comparison.json` — eski Basic arşivindeki 23 WMV için tekrar/koruma inceleme listesi.
- `KITAP-AKADEMI-ENTEGRASYON.md` — kitap/akademi ortak karar ve QR entegrasyon notları.
- `courses.json` — mevcut kurs verisi.

## Basic Arşivi
23 WMV yerinde korunuyor. Henüz toplu transcode/silme yok.
Karşılaştırma dosyası hazır; özellikle Ground, Headlock/Wrist, Bob ve Kick ile çakışan teknikler tek ana kaynak seçimi için işaretlendi.

## Sonraki Adımlar
1. Test seviyelerini P1-P5 / G1-G5 olarak derslere dağıtmak.
2. Basic 23 WMV ile yeni modüler kaynakları karşılaştırıp tek ana video seçmek.
3. Kitap için teknik ID + bookQrKey eşlemesini genişletmek.
4. Seçilen videolar için kare çıkarma.
5. Final envanterden sonra gerekli WMV'leri H264/AAC dönüştürmek.
6. B2 yükleme ve Worker erişim/entitlement katmanını tamamlamak.

## 2026-09-28 — Devam Güncellemesi
- `basic-media-metadata.json` oluşturuldu: eski Basic arşivindeki 23 WMV codec/süre/çözünürlük envanteri.
- `modular-media-metadata.json` oluşturuldu: mevcut Udemy/modüler MP4 kaynaklarının medya envanteri.
- `test-technique-map.json` oluşturuldu: test videolarının ana müfredat/modül karşılıkları.
- `book-technique-index.json` oluşturuldu: kitap-uygun 39 kayıt için techniqueId + bookQrKey + sabit akademi route anahtarı.
- QR politikası: hiçbir QR doğrudan B2 nesnesine gitmeyecek; Online Akademi kalıcı ders yolu kullanılacak.
- P1-P5 / G1-G5 kesin ders dağılımı için kullanıcı müfredatı/kuralları gelmeden seviye ataması uydurulmayacak.

## 2026-09-28 — Courses V2 Geçiş Planı
- `courses-v2-migration-plan.json` oluşturuldu.
- Mevcut `courses.json` değiştirilmedi.
- Eski 8 modül için hedef:
  - basic -> Basic Combatives (karşılaştır/merge)
  - bear-hug -> M4Y + yakın mesafe Bear Hug
  - bicak -> On The Edge / özel erişim
  - kilit -> Headlock & Wrist Lock
  - materyal -> ana akış dışı/arşiv
  - sopa -> özel erişim
  - tekme -> Kick Technique
  - yer -> Ground Fighting

## Çalışma Yetkisi — 2026-09-28
Kullanıcı, proje bütünlüğü ve daha önce tasarlanan adımlar kapsamında ara iş paketlerinde ayrıca onay beklenmeden devam edilmesini onayladı.
Uygulama kuralı:
- Ara modül/iş paketi tamamlandığında durma; sıradaki plana geç.
- Belirsiz veya eksik noktaları makul proje bütünlüğüne göre tamamla; sonradan revizyon yapılabilir.
- Çalışan canlı site/auth/register akışını bozacak değişiklik yapma.
- Canlı yayına son geçişten hemen önce proje bütünü için son teyit iste.
- Canlıya geçiş onayı ayrı kapı olarak korunur.

## YAYIN AŞAMASI ERİŞİM / GÜVENLİK REFERANSI — 2026-09-29
Kullanıcı kararı:
1. Canlı yayında tüm eğitim içerikleri sadece **Krav Maga üyelerine** açık olacak.
2. Üyelik tek başına yeterli olmayacak; erişim **yönetici panelinden yetki verilerek** açılacak.
3. Google/Firebase oturumu kimlik doğrulama için kullanılabilir; asıl içerik erişimi Worker/D1 tarafındaki rol + access_grants ile kontrol edilecek.
4. Varsayılan kullanıcı rolü/politikası: yetkisiz kullanıcı dersleri oynatamaz.
5. Kitap QR girişleri ayrı hat olacak:
   - QR yalnızca kitap için izin verilen çekirdek derslere yönlenecek.
   - Kitap QR kullanıcısı Materyal / özel erişim / diğer ana eğitim bölümlerine erişemeyecek.
   - QR doğrudan B2 video dosyasına bağlanmayacak; kalıcı Online Akademi ders rotasına bağlanacak.
   - Kitap müfredatı kullanıcı tarafından ayrıca düzenlenecek ve sadece seçilen çekirdek dersler bookEligible/bookQrKey ile açılacak.
6. Dışarıdan ücretli online üye erişimi canlı ilk sürümde açılmayacak.
   - Gelecek faz: paid_external rolü + paket/abonelik + ödeme sistemi.
   - Ücretli erişim ayrı yetki/sona erme tarihi ile yönetilecek.
7. Güvenlik kontrol listesi yayın öncesi:
   - Firebase ID token doğrulaması
   - Worker tarafında active user kontrolü
   - role + access_grants kontrolü
   - video ticket kısa ömürlü olmalı
   - B2 objeleri private kalmalı
   - doğrudan B2 URL yayınlanmamalı
   - özel materyal erişimi yalnız special grant ile
   - admin API yalnız admin rolüyle
   - kitap QR rotaları yalnız bookEligible çekirdek derslere
   - istemci tarafı kontroller güvenlik sınırı sayılmayacak; sunucu/Worker zorunlu kontrol yapacak

Yayın hedefi: bugün canlı sayfaya geçiş; ancak canlıya almadan hemen önce yukarıdaki referanslarla giriş/yetki akışı yeniden doğrulanacak.

## 2026-09-29 — Canlı Yayın / Güvenlik Durumu
- Cloudflare Worker route aktif: `kravmaga.com.tr/online-akademi*`.
- Canlı sayfa ve katalog PC/OneDrive yoluna bağlı değil.
- Public HTML içinde doğrudan B2/S3 adresi bulunmuyor.
- Video erişimi: Firebase ID token -> D1 user/grant -> kısa ömürlü video ticket -> private B2 proxy.
- Doğrudan video URL, ticketsız erişimde 401 döndürüyor.
- Admin API yetkisiz erişimde 403 döndürüyor.
- Normal öğrenci içerikleri artık yalnız `core` grant ile açılıyor; rol tek başına yeterli değil.
- Kitap QR hattı için `book` grant eklendi; yalnız `Krav Maga Kitap Görsel Eğitim` içindeki 18 ders bookEligible.
- Materyal yalnız `special` grant ile açılıyor.
- Progress PUT endpoint'i de lesson erişimini sunucu tarafında doğruluyor.
- Yönetici paneli: Üye Eğitim / Kitap QR / Materyal ayrı erişim kutuları.
- Canlı Worker üzerinden bc-01 için gerçek B2 HEAD testi: 200, byte-range destekli.
- D1 kullanıcı/grant tablolarında şu anda kalıcı test/öğrenci kaydı yok.
- Medya yüklemesi devam ediyor; bitişte 94/94 doğrulaması yapılacak.
