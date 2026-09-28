# Krav Maga Turk Online Akademi V2

## Amaç
Mevcut masaüstü eğitim modülünün içerik ve ders organizasyonunu koruyup modern web tabanlı Online Akademi sistemine dönüştürmek.

## Kaynaklar
- Eski modül: \\BULICET\Users\RDC-GUEST\OneDrive\Belgeler\modul
- Mevcut web sayfası: online-akademi.html
- Video sayısı: 76 WMV (2026-09-28 yeniden tarama)
- Toplam video boyutu: yaklaşık 3.99 GB (2026-09-28 yeniden tarama)
- Kitap projesi: ayrı sohbette hazırlanıyor; tamamlandığında QR/video eşleştirmesi bu projeye eklenecek.

## Mimari kararlar
1. Canlı siteye erken müdahale yok; geliştirme ayrı dalda.
2. Eski Run.exe/rbprj/USB koruma yapısı web'e taşınmayacak.
3. Ders kategorileri korunacak.
4. WMV videolar web için MP4/H.264'e dönüştürülecek.
5. Video dosyaları GitHub'da tutulmayacak.
6. Öğrenci, Instructor ve Security yetkileri ayrı olacak.
7. İlerleme takibi eklenecek.
8. Kitaptaki QR kodları aynı video/ders havuzuna bağlanabilecek.
9. Mevcut /online-akademi tasarımı korunarak gerçek ders paneline dönüştürülecek.

## Çalışma yöntemi
Bu dosya sohbetler arası ana kayıt noktasıdır. Her iş sonunda aşağıdaki DURUM bölümü güncellenecek.
Yeni sohbet açıldığında kullanıcı yalnızca “ONLINE AKADEMİ V2 devam” diyebilir; bu dosya okunarak kaldığı yerden devam edilir.

## Aşamalar
- [x] 1. Kaynak modül klasörünü tarama
- [x] 2. Video envanterini çıkarma
- [x] 3. Ayrı geliştirme dalı oluşturma
- [x] 4. Ders bilgi modelini oluşturma
- [x] 5. İlk Basic modül prototipini hazırlama
- [x] 6. WMV -> MP4 dönüşüm planı ve deneme videosu
- [x] 7. Video depolama seçimi (Cloudflare R2/Stream veya YouTube)
- [ ] 8. Üyelik/yetki sistemi (Worker iskeleti hazır; oturum kontrolü bekliyor)
- [ ] 9. İlerleme takibi
- [ ] 10. Kitap QR eşleştirmesi
- [ ] 11. Test yayını
- [ ] 12. Canlıya geçiş

## DURUM
2026-09-27:
- online-akademi-v2 dalı main üzerinden oluşturuldu.
- Kaynak modül kullanıcı temizliği sonrası yeniden tarandı: 76 WMV video ve yaklaşık 3.99 GB içerik kaldı.
- Güncel kategoriler: Basic, Bear_Hug, Bıçak, Kilit, Materyal, Sopa, Tekme, Yer.
- Güncel yerel video envanteri 76 ders üzerinden yeniden üretildi.
- Canlı siteye değişiklik yapılmadı.
- courses.json veri modeli güncel 76 videoya göre yeniden oluşturuldu (8 modül).
- Basic için 23 ders korunuyor; diğer 7 modül de veri modeline eklendi.
- online-akademi.html test dalında Basic ders listesini veri üzerinden açıp kapatan prototipe dönüştürüldü.
- Videoların çoğu henüz oynatılmıyor; toplu MP4 dönüşümü bekliyor.
- FFmpeg 9.0.2 essentials yerel araç klasörüne kuruldu.
- Basic/Reaksiyon 4 için ilk WMV -> MP4 testi tamamlandı.
- Çıktı: H.264 + AAC, 1280x720, 23.98 fps, faststart, ~3.70 MiB.
- Yerel HTML5 oynatıcı test sayfası oluşturuldu ve bilgisayarda açıldı.
- Dönüşüm profili TRANSCODING.md dosyasına kaydedildi.
- Video depolama kararı onaylandı: Stream kullanılmayacak, R2 Standard ücretsiz kota hedeflenecek.
- R2 mimarisi R2-ARCHITECTURE.md dosyasına kaydedildi.
- Planlanan bucket adı: kravmaga-online-akademi-media.
- Kullanıcı gereksiz videoları kaynak klasörden sildi; kaldırılan içerikler veri modelinden çıkarıldı.
- Udemy'deki “Bob kauçuk adam kullanımı” videosu kullanıcı tarafından yarın eklenecek; pending-media.json içinde bekleyen iş olarak kaydedildi.
- Backblaze B2 hesabı ve private bucket oluşturuldu: kravmaga-online-akademi-media.
- Master key kullanılmadan, bucket'a sınırlı ayrı application key oluşturma akışı tamamlandı.
- Private B2 video proxy için Cloudflare Worker iskeleti hazırlandı.
- Worker Range isteklerini geçiriyor; B2 gerçek URL'sini frontend'den gizliyor.
- Worker secret şablonu ve .gitignore eklendi; gerçek anahtarlar GitHub'a yazılmayacak.
- Toplu dönüşüm için güvenli, tekrar çalıştırılabilir transcode-library.ps1 hazırlandı; varsayılan çalışma modu dönüşüm yapmadan doğrulama/dry-run şeklinde.
- Bucket private olacak; videolar GitHub/Pages içine konmayacak.

## Sonraki iş
Backblaze B2 application key değerlerini yalnızca Worker secret olarak tanımla; test MP4 dosyasını private bucket'a yükle; Worker'ı deploy et ve /api/video/basic-17 üzerinden Range destekli oynatma testini tamamla. Bob kauçuk adam videosu eklendiğinde envanteri tekrar tara.


## Yeni onaylanan kapsam — 28 Eylül 2026
- Sistem yeni video, bölüm ve kurs eklemeye açık olacak.
- Kullanıcı grupları: antrenör/eğitmen, akademi öğrencisi, dışarıdan ücretli kullanıcı, yönetici.
- Öğrenci bazında izlenen dakika, izleme yüzdesi, ders tamamlama ve oturum sayısı kaydedilecek.
- Öğrenci panelinde grafiksel ilerleme ve izleme süresi gösterilecek.
- Kurs/bölüm sonunda test sistemi olacak.
- Online Katılım Sertifikası yalnızca zorunlu videolar/bölümler tamamlandıktan ve gerekli test geçildikten sonra üretilecek.
- Sertifika doğrulama kodu/URL altyapısı planlandı.
- Ayrıntılı tasarım: online-akademi-v2/ACADEMY-ARCHITECTURE.md
- Veri modeli taslağı: online-akademi-v2/academy-data-model.json

## Güncel geliştirme sırası
1. [x] Private B2 video erişimi
2. [x] Worker + Range + Plyr test oynatma
3. [ ] Tüm kurs/video kataloğunu tamamla
4. [ ] Kullanıcı ve rol sistemi
5. [ ] Kurs erişim hakları
6. [ ] İzleme dakika / ilerleme kaydı
7. [ ] Grafiksel öğrenci paneli
8. [ ] Test sistemi
9. [ ] Sertifika üretimi ve doğrulama
10. [ ] Ödeme/paket erişimi
11. [ ] Yönetim paneli
12. [ ] Genel test
13. [ ] Kullanıcı onayı sonrası canlıya geçiş

- Akademi öğrencilerine diploma/sertifika erişim hakkı yönetici panelinden ayrıca verilebilecek; eğitim erişiminden bağımsız yetki olarak tutulacak.


## Kitap ↔ Online Akademi QR senkronizasyonu
- Kitap projesindeki QR kodlar mümkün olduğunda doğrudan Krav Maga Türk Online Akademi içindeki ilgili ders/bölüm sayfasına bağlanacak.
- `bookQrKey` alanları bu eşleşme için kullanılacak.
- Kitap projesi ayrı ilerlese de Online Akademi ders ID'leri ve QR hedefleriyle senkron tutulacak.
- Kitap baskıya girmeden önce QR hedefleri test ortamında doğrulanacak; canlı URL'ler en son yayın öncesi sabitlenecek.
- Gelecekte ders/video yolu değişse bile kitap QR'larının bozulmaması için doğrudan B2 video URL'si değil, kalıcı akademi ders/QR yönlendirme adresi kullanılacak.
