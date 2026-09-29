# Kitap – Online Akademi Entegrasyon Listesi

Amaç: Kitaptaki teknik anlatım, çizim referansları ve QR kodları ile Online Akademi derslerini tek kimlik sistemi altında eşleştirmek.

## Temel Kurallar
- Her teknik tek bir benzersiz teknik ID alacak.
- Kitaptaki QR doğrudan B2/video dosyasına değil, Online Akademi içindeki kalıcı ders/redirect adresine gidecek.
- Aynı teknik birden fazla Udemy kursunda varsa en iyi/temiz video tek ana kaynak olarak seçilecek.
- Silah, tabanca, tüfek, bıçak ve sopa içerikleri mevcut kapsam kararına göre ana akademi hattına alınmayacak.
- Kitap için videodan seçilecek kareler: başlangıç, temas/savunma anı, yön-değişim ve bitiş pozisyonu.
- Çizim notlarında ayak yerleşimi, el pozisyonu, açı, denge, temas noktası ve yön oku ayrı ayrı işaretlenecek.

## Entegrasyon Tablosu
| Kod | Kaynak / Modül | Kitap Bölümü | Video Durumu | Çizim Referansı | QR | Not |
|---|---|---|---|---|---|---|
| BAS | Basic Combatives | Temel Teknikler | Eski arşiv + Udemy | Gerekli | Evet | Tekrarlar karşılaştırılacak |
| GF | Ground Fighting / Yer Hareketleri | Yer Teknikleri | 7 video + 2 görsel referans hazır | Gerekli | Evet | Standart adlandırma tamamlandı; 2 PNG için video karşılığı kontrol edilecek |
| HL | Headlock & Wrist Lock | Boyun ve Bilek Kilitleri | 7 video hazır | Gerekli | Evet | Video isimleri standartlaştırıldı |
| KICK | Kick Technique | Tekme Teknikleri | 15 video hazır | Gerekli | Evet | Standart adlandırma tamamlandı |
| M4Y | Mesafeli Dört Yandan Saldırılara Savunma | Mesafeli Savunmalar | 6 video hazır | Gerekli | Evet | Ayrım ve standart adlandırma tamamlandı |
| BH | Yakın Mesafeden Sarmal Saldırılar - Bear Hug | Yakın Mesafe Kavrama Savunmaları | 2 video hazır | Gerekli | Evet | Kurt Kapanı dahil; ayrım ve standart adlandırma tamamlandı |
| MAT | Materyal | KAPSAM DIŞI | Çıkarıldı | Hayır | Hayır | Kitaba ve ana akademiye alınmayacak |
| PT | Practitioner / Graduate Test | Akademi Seviye Testleri | Test videoları hazır/ayrılıyor | Kitapta sınırlı | Evet | Practitioner L1-L5 ve Graduate L1-L5 öğrencileri kapsar |
| KM | Krav Maga | Çekirdek Krav Maga | 1–24 uygun, tekrarlar var | Gerekli | Evet | 25+ içindeki silah/bıçak/sopa içerikleri hariç |
| BOB | Bob ile Krav Maga | Temel Uygulamalar | Müfredat hazır | Gerekli | Evet | Dim Mak birleşik ders hariç |

## İlk Teknik-Görsel Çıkarma Önceliği
1. Headlock & Wrist Lock — 7 video
2. Ground Fighting / Yer Hareketleri
3. Kick Technique
4. Mesafeli Dört Yandan Saldırılara Savunma
5. Yakın Mesafeden Sarmal Saldırılar - Bear Hug
6. Krav Maga çekirdek dersleri
7. Basic Combatives tekrar karşılaştırması

## Her Teknik İçin Üretilecek Kayıt
- Teknik ID
- Kitap başlığı
- Online Akademi modül/ders adı
- Kaynak video dosyası
- Videoda referans zaman kodları
- Çizim için 2–4 ana kare
- Teknik açıklama özeti
- Kritik uygulama notları
- QR hedef anahtarı (bookQrKey)
- Yayın/inceleme durumu

## İlk Çalışılacak Dosyalar
Headlock & Wrist Lock hazır set:
01-tanitim.mp4
02-bilek-isinma.mp4
03-boyun-kilit-yandan.mp4
04-boyun-kilit-arkadan.mp4
05-boyun-arka-kilit-cozme.mp4
06-giyotin.mp4
07-tutuslar-kilitler.mp4

## Teknik Görsel Çıkarma Çalışması – Başlangıç
### HL-03 — Boyun Kilit Yandan
Kaynak: `03-boyun-kilit-yandan.mp4`
Durum: İlk görsel tarama başladı.
İlk teknik referans aralıkları:
- ~02:30: yandan boyun kilidi uygulama/pozisyon gösterimi; başlangıç–kontrol ilişkisi için aday kare.
- ~05:30: savunma/karşı teknik uygulamasının yakın gösterimi; el-konumu, baş yönü ve gövde açısı için güçlü aday kare.
- ~01:30, 03:30, 04:30, 06:30 civarı kareler daha çok açıklama/geçiş niteliğinde; çizim ana karesi olarak düşük öncelik.
Detay tarama için 02:10–03:00 ve 05:00–05:50 aralıklarından 10 saniyelik örnek kareler çıkarıldı.
Çizim hedefi: 3–4 aşama — saldırı/kilit, savunma başlangıcı, kontrol/denge bozma, bitiş.
QR hedefi: `bookQrKey=HL-03` (kalıcı akademi ders adresi oluşturulunca bağlanacak).

## Kitap Referans Notu — Akademi Test Videoları
Akademi test videoları, kitap düzenleme ve çizim hazırlığında da teknik referans kaynağı olarak kullanılacak.
Ana akademi hattından ayrı tutulan sopa, bıçak ve tabanca test videoları kitaba otomatik dahil edilmeyecek; ancak kitap projesinde ilgili teknik/bölüm varsa görsel ve teknik referans olarak ayrıca değerlendirilecek.
Kitap düzenlemesinde video kaynakları; duruş, el/ayak konumu, açı, temas anı, denge, yön ve bitiş pozisyonu için referans kabul edilecek.

## Kapsam Güncellemesi — Materyal / On The Edge
- Materyal modülü Online Akademi kapsamından çıkarıldı; gerekçe: zararlı alet kullanımına giren içerik.
- Eski "Materyal Videolari" klasör/kısa yol adı kaldırıldı.
- İndirme klasörü ve masaüstü kısa yolu "On The Edge Videolari" olarak değiştirildi.
- On The Edge içeriği kitap entegrasyonuna ALINMAYACAK.
- Bu içerikten kitap için teknik çizim, QR, bölüm veya görsel referans üretilmeyecek.

## Bear Hug / Sarmal Saldırı Kapsam Ayrımı
- 1. modül: **Mesafeli Dört Yandan Saldırılara Savunma**.
- 2. modül: **Yakın Mesafeden Sarmal Saldırılar - Bear Hug**.
- Mesafeli modülde Bear Hug başlığı kullanılmayacak.
- Yakın mesafe Bear Hug modülünde sarmal saldırılar ve Kurt Kapanı birlikte değerlendirilecek.
- Kitap sayfa ve çizim eşleştirmelerinde bu iki modül ayrı teknik aileleri olarak tutulacak.

## Bear Hug / Mesafeli Savunma Video Durumu — Güncel
Kontrol edildi ve dosyalar doğru hedef klasörlere ayrıldı.

### M4Y — Mesafeli Dört Yandan Saldırılara Savunma
Hedef klasör: `udemy-import/mesafeli-dort-yandan-saldirilara-savunma`
Mevcut dosyalar:
- tanıtım
- önden mesafeli saldırılar
- önden mesafeli tutuşlu itmek
- yandan mesafeli tutuş
- arkadan mesafeli tutuş
- tek el tutuş / önden saldırı
Durum: video ayrımı ve standart adlandırma tamamlandı.

### BH — Yakın Mesafeden Sarmal Saldırılar - Bear Hug
Hedef klasör: `udemy-import/yakin-mesafeden-sarmal-saldirilar-bear-hug`
Mevcut dosyalar:
- bear_hug_full mesafesiz saldırılar
- arkadan mesafesiz tutuş / Kurt Kapanı
Durum: video ayrımı ve standart adlandırma tamamlandı.

## Ground Fighting / Kick Technique — Güncel Durum
### GF — Ground Fighting / Yer Hareketleri
Standart adlandırma tamamlandı.
- 01-giris.mp4
- 02-dusme-nasil-olmali.mp4
- 03-takla-atmak.mp4
- 04-yandan-boyun-tehdit-kol-kilit.mp4
- 05-karin-ustunden-itis.mp4
- 06-yerde-ayaklara-makas.mp4
- 07-yerde-dusme-sonrasi-tekme-savunmasi.mp4
- 08-yerde-tekme-tutmak-referans.png
- 09-yerde-tekme-atmak-referans.png
Not: İki PNG yalnızca görsel referans; eksik video karşılığı varsa sonradan tamamlanacak.

### KICK — Kick Technique
15 dersin standart adlandırması tamamlandı.
- 01-giris.mp4
- 02-esnetme.mp4
- 03-on-tekme.mp4
- 04-yan-tekme.mp4
- 05-geri-tekme.mp4
- 06-diz-vurmak.mp4
- 07-kaval-vurusu-low-kick.mp4
- 08-makas-kirik.mp4
- 09-mesafe-kapama.mp4
- 10-onden-gelen-tekmeye-savunma.mp4
- 11-yandan-gelen-tekmeye-savunma.mp4
- 12-kaval-vurusuna-savunma.mp4
- 13-geri-tekmeye-savunma.mp4
- 14-yerde-tekme-atmak.mp4
- 15-yerden-tekme-ile-kalkmak.mp4

## Sonraki İndirme / Karşılaştırma Aşaması
### KM — Krav Maga Ana Müfredatı
Durum: ayrı bir çekirdek video indirmesi gerekmiyor; mevcut indirilen modüller Krav Maga ana yapısını oluşturuyor.
Ana başlıklar: Basic Combatives, The Best Defense, On The Edge, Line of Fire.
İçerik eşleştirmesi mevcut klasörler üzerinden yapılacak.

### BOB — Bob ile Krav Maga
Hedef klasör: `udemy-import/bob-ile-krav-maga`
Masaüstü kısa yolu: `Bob ile Krav Maga Videolari`
Durum: klasör hazır; video indirme/karşılaştırma bekleniyor.
Not: Dim Mak ile birleşik ders kapsam dışı tutulacak.

## Krav Maga Ana Yapı — Kullanıcı Tarafından Netleştirildi
Krav Maga çekirdek eğitim yapısı, indirilen/parçalara ayrılmış mevcut modüllerin birleşiminden oluşur. Ayrı bir "krav-maga-core" video seti indirmek zorunlu değildir.

Ana yapı:
- **Basic Combatives**
- **The Best Defense**
- **On The Edge**
- **Line of Fire**

İçerik kapsamı:
- Materyal
- Sopa
- Bıçak
- Tabanca

Uygulama notu:
- Bu başlıklar Krav Maga ana müfredatının parçaları olarak kabul edilecek.
- Daha önce ayrı klasörlere indirilen Ground, Kick, Headlock/Wrist Lock, Mesafeli Dört Yandan Savunma ve Bear Hug içerikleri, uygun ana başlık altında eşleştirilecek.
- On The Edge, sopa, bıçak ve tabanca içerikleri kitap kapsamına otomatik alınmayacak; akademi tarafında ayrı/özel erişim politikasıyla tutulabilir.
- "krav-maga-core" klasörü bağımsız yeni indirme hedefi olmaktan çıkarıldı; mevcut parçaların müfredat eşleştirmesi yapılacak.

## Krav Maga Udemy Müfredatı — Son Netleştirme
- Udemy'deki **Krav Maga** dersi ayrı bir yeni indirme hedefi değildir.
- Bu dersin müfredatı zaten mevcut parça/modül klasörleriyle temsil edilmektedir; yeniden indirmek gereksiz disk kullanımı yaratır.
- Parça/modül halinde tutulması tercih edilir ve ana müfredatta birleştirilir.
- Bu yapı içinde **Dim Mak yoktur**.

## Krav Maga Ana Müfredat Eşleştirmesi — Güncel
### 1. Basic Combatives
Bu başlık altında temel vuruş, hareket ve tekme altyapısı tutulacak.
- Basic Combatives / eski Basic arşivi
- Kick Technique
- Bob ile Krav Maga içindeki temel uygulamalar
Not: tekrar eden tekniklerde tek ana video seçilecek; Dim Mak yok ve eklenmeyecek.

### 2. The Best Defense
Bu başlık altında silahsız savunma ve yakın/orta mesafe savunma teknikleri tutulacak.
- Headlock & Wrist Lock
- Ground Fighting / Yer Hareketleri
- Mesafeli Dört Yandan Saldırılara Savunma
- Yakın Mesafeden Sarmal Saldırılar - Bear Hug
- Practitioner Level 1–5 ve Graduate Level 1–5 testlerindeki silahsız teknikler
Not: kitap için teknik çizim ve QR üretiminde ana kaynak gruplarından biridir.

### 3. On The Edge
Bu başlık kesici/delici alet ve ilgili özel savunma içeriği için ayrılmıştır.
- On The Edge video klasörü
- Bıçak savunma içerikleri
- ilgili materyal alt içerikleri gerektiğinde bu özel hatta tutulur
Kitap politikası: otomatik olarak kitaba ALINMAYACAK; kitap projesinde ayrıca karar verilmedikçe çizim/QR üretilmeyecek.

### 4. Line of Fire
Bu başlık ateşli silah tehdit/savunma içeriği için ayrılmıştır.
- Tabanca savunma / tehdit içerikleri
- ilgili test videoları
Kitap politikası: otomatik olarak kitaba ALINMAYACAK; ayrıca onay verilmedikçe çizim/QR üretilmeyecek.

### Ayrı Uzmanlık / Materyal Hattı
- Sopa savunma içerikleri ayrı klasörde korunur.
- Materyal modülü ana kitap ve ana akademi akışından çıkarılmıştır.
- Bu içerikler Krav Maga genel arşivinin parçası olabilir ancak standart öğrenci/kitap akışına otomatik bağlanmaz.

### Disk / Kaynak Politikası
Udemy'deki tam Krav Maga kursu yeniden indirilmeyecek. Mevcut parça/modül videoları ana müfredatı yeterli biçimde temsil ediyor ve disk alanı tasarrufu için modüler halde tutulacak.

## Akademi Test Videoları — Seviye Kapsamı
Test videoları yalnız tek bir Practitioner seviyesine ait değildir.
Kapsam:
- Practitioner Level 1
- Practitioner Level 2
- Practitioner Level 3
- Practitioner Level 4
- Practitioner Level 5
- Graduate Level 1
- Graduate Level 2
- Graduate Level 3
- Graduate Level 4
- Graduate Level 5

Erişim kuralı: test videoları öğrencinin kendi seviye hattına göre açılacak; seviye dışı testler varsayılan olarak gösterilmeyecek. Kitap tarafında bu test videoları ana teknik anlatım yerine yalnızca ilgili teknik/QR referansı gerektiğinde kullanılacak.

## KITAP SOHBETİNE SENKRON BİLDİRİMİ — 2026-09-28
Bu dosyanın bu sürümü Online Akademi tarafındaki güncel kararları içerir. Kitap çalışması bu sürümü esas almalıdır.
Özellikle güncellenen başlıklar:
- Krav Maga ana yapı: Basic Combatives / The Best Defense / On The Edge / Line of Fire.
- Tam Krav Maga kursu yeniden indirilmeyecek; modüler/parça videolar ana kaynak kabul edilecek.
- Dim Mak bu yapıda yoktur.
- Mesafeli Dört Yandan Saldırılara Savunma ile Yakın Mesafeden Sarmal Saldırılar - Bear Hug ayrı teknik aileleridir.
- Ground Fighting, Kick Technique, Headlock/Wrist Lock, M4Y ve Bear Hug dosya adları standartlaştırıldı.
- Test kapsamı Practitioner Level 1-5 ve Graduate Level 1-5 olarak güncellendi.
- On The Edge / bıçak, Line of Fire / tabanca ve sopa içerikleri kitaba otomatik eklenmeyecek; ayrı onay olmadan çizim/QR üretilmeyecek.
Kitap sohbeti bu sürümü okuduğunda önceki eski entegrasyon kopyalarını değil, ana `KITAP-AKADEMI-ENTEGRASYON.md` dosyasını esas almalıdır.

## Akademi Yapı Dosyaları — 2026-09-28 Güncellemesi
Online Akademi tarafında aşağıdaki yapı dosyaları oluşturuldu:
- `academy-curriculum-map.json`: Basic Combatives / The Best Defense / On The Edge / Line of Fire ana eşleştirmesi.
- `test-level-map.json`: Practitioner Level 1-5 ve Graduate Level 1-5 için ortak video havuzu + seviye manifest iskeleti. Videolar fiziksel olarak çoğaltılmayacak.
- `basic-comparison.json`: eski Basic arşivindeki 23 WMV için tekrar/koruma inceleme listesi.
- `PROJECT.md`: ONLINE AKADEMİ V2 güncel proje durum ve sonraki adım kaydı.

Kitap tarafı için not:
- Kitap yalnızca kitap-uygun teknik ailelerini kullanacak.
- Test videoları seviye P1-P5 / G1-G5 bağlamında referanslanacak.
- On The Edge, Line of Fire, sopa ve materyal içerikleri kitap akışına otomatik alınmayacak.

## Courses V2 Geçiş Eşleştirmesi — 2026-09-28
Mevcut `courses.json` korunmaktadır; V2 için geçiş planı ayrı dosyada tutulur.
- Basic -> Basic Combatives
- Bear_Hug -> Mesafeli Dört Yandan Saldırılara Savunma + Yakın Mesafeden Sarmal Saldırılar - Bear Hug
- Bıçak -> On The Edge / özel erişim / kitap dışı
- Kilit -> Headlock & Wrist Lock
- Materyal -> ana akış dışı / kitap dışı
- Sopa -> özel erişim / kitap dışı
- Tekme -> Kick Technique
- Yer -> Ground Fighting
Kaynak: `courses-v2-migration-plan.json`.

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

## Krav Maga Kitap Görsel Eğitim — QR Hattı
- Önceki **Çekirdek Dersler** görünüm adı, **Krav Maga Kitap Görsel Eğitim** olarak güncellendi.
- Bu bölüm kitap QR erişimi için ayrılmış çekirdek eğitim hattıdır.
- Toplam 18 ders QR kapsamındadır.
- QR kalıbı: `https://kravmaga.com.tr/online-akademi?lesson=<lesson-id>`
- QR doğrudan B2/video dosyasına yönlenmez.
- Kitap QR erişimi yalnız bu 18 çekirdek derse izin verecek; The Best Defense ve Materyal otomatik açılmayacak.
- Masaüstü kitap bölümüne `KITAP-QR-KRAV-MAGA-KITAP-GORSEL-EGITIM.md` bırakıldı.
- Aktif video yüklemesini bozmamak için fiziksel eski `cekirdek` kaynak yolu yükleme tamamlanana kadar korunuyor; masaüstünde yeni adla güvenli bağlantı/alias oluşturuldu. Yükleme bittikten sonra eski yol temizlenebilir.
## Depolama Optimizasyonu — 2026-09-29
- Backblaze B2 toplam sürüm boyutu eski/tekrar sürümler temizlendikten sonra yaklaşık 8.42 GiB seviyesine indirildi.
- 7 eski video sürümü silindi; yaklaşık 1.21 GiB alan geri kazanıldı.
- Büyük Materyal videoları optimize edildi ve güncel sürümler B2'ye aktarıldı.
- stick-01 ve stick-14 yerel dosyalarının SHA1 değerleri birebir aynıdır: 0AA4D532E892F2396893E83B8441E7BC2B5B92EB
- Bu nedenle iki ders B2'de aynı fiziksel video nesnesini bilinçli olarak paylaşır. 94 ders için 93 benzersiz B2 nesnesi normal ve beklenen durumdur.
- Canlı medya denetimi: 94/94 ders erişilebilir.
- Canlı güvenlik denetimi: 94 ders, PC yolu sızıntısı yok, B2 doğrudan adres sızıntısı yok, yetkisiz api/me 401, doğrudan video 401, admin 403, kitap QR kapsamı yalnız çekirdek 18 ders.
- Backblaze günlük yükleme/storage cap uyarısı yeni yükleme URL'sini geçici olarak engelleyebilir; mevcut canlı 94 ders için ek yükleme gerekmiyor.
