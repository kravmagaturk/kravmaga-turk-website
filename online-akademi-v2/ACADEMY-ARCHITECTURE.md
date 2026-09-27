# ONLINE AKADEMİ V2 — Üyelik, İlerleme, Test ve Sertifika Mimarisi

## Temel hedef
Sistem sonradan yeni video, bölüm, kurs, test ve sertifika eklenmesine açık kalacak. İçerik yapısı kod içine gömülmeyecek; ders/kurs verileri JSON veya veritabanından okunacak.

## Kullanıcı türleri
1. **Antrenör / Eğitmen**
   - Akademi tarafından yetkilendirilir.
   - Yetki verilen kurslara erişir.
   - İlerleme ve test kayıtları tutulur.
2. **Akademi öğrencisi**
   - Krav Maga Türk bünyesindeki aktif öğrenci.
   - Atanan eğitimlere üyelik hakkıyla erişir.
   - Yönetici panelinden diploma/sertifika erişim hakkı ayrıca verilebilir.
   - Diploma erişimi eğitim erişiminden bağımsız bir yetki olarak açılıp kapatılabilir.
3. **Dışarıdan ücretli kullanıcı**
   - Satın aldığı kurs/paket kadar erişir.
   - Süreli veya süresiz erişim pakete göre belirlenebilir.
4. **Yönetici**
   - Kurs, bölüm, video, test, kullanıcı erişimi ve sertifika kurallarını yönetir.

## Kurs yapısı
Kurs > Bölüm > Ders > Video

Her içerik benzersiz ID ile tutulur. Yeni video eklemek için mevcut sayfa kodunun değiştirilmesi zorunlu olmayacak.

Örnek:
- courseId: krav-maga-temel
- moduleId: basic
- lessonId: basic-17
- video endpoint: /api/video/basic-17

## İzleme ve ilerleme verileri
Her öğrenci için en az:
- userId
- courseId
- lessonId
- firstOpenedAt
- lastOpenedAt
- watchedSeconds
- videoDurationSeconds
- watchedPercent
- completed
- completedAt
- sessionCount

Video tamamlandı sayılması için yalnızca sayfanın açılması yeterli olmayacak. Gerçek izlenen süre ve yüzde takip edilecek.

## Grafiksel öğrenci paneli
Panelde:
- Toplam izlenen dakika
- Bu hafta izlenen dakika
- Kurs tamamlanma yüzdesi
- Tamamlanan ders / toplam ders
- Bölüm bazında ilerleme çubukları
- Gün/hafta bazında çalışma grafiği
- Son izlenen ders
- Test sonucu
- Sertifika durumu

## Test sistemi
Her kursun sonunda veya bölüm sonunda test tanımlanabilir.

Test alanları:
- testId
- courseId / moduleId
- soru havuzu
- geçme puanı
- deneme sayısı
- son puan
- en yüksek puan
- passed
- passedAt

## Sertifika kuralı
Online Katılım Sertifikası ancak aşağıdaki şartlar birlikte sağlandığında üretilecek:
1. Zorunlu tüm bölümler tamamlanmış olmalı.
2. Zorunlu tüm videolar tamamlanmış olmalı.
3. Kurs tamamlama oranı %100 olmalı.
4. Varsa final testinden geçer puan alınmalı.
5. Kullanıcının kurs erişimi geçerli olmalı.

Sertifika verileri:
- certificateId
- userId
- courseId
- fullName
- issueDate
- verificationCode
- verificationUrl
- status

Sertifika doğrulama sayfası daha sonra diploma/sertifika sorgu altyapısıyla uyumlu hale getirilebilir.

## Erişim modeli
- Antrenör: admin tarafından atanmış eğitimler
- Akademi öğrencisi: aktif akademi üyeliğine bağlı eğitimler
- Dış kullanıcı: satın alınmış paket/kurs
- Yönetici: tam erişim
- Akademi öğrencisi için ek yetki: diploma/sertifika görüntüleme ve indirme erişimi yönetici tarafından ayrıca atanabilir.

Frontend hiçbir B2 anahtarı taşımaz. Video erişimi Worker üzerinden ve kullanıcı yetkisi kontrol edilerek verilir.

## Sonraki backend katmanı
Video Worker içindeki mevcut yetki TODO alanına:
1. kullanıcı oturumu doğrulama,
2. course/lesson erişim kontrolü,
3. izleme oturumu kaydı
eklenecek.

İlerleme ve test verileri video dosyalarından ayrı tutulacak.

## Geliştirme sırası
1. Video altyapısı ve ders kataloğu
2. Kullanıcı/rol sistemi
3. Kurs erişim hakları
4. İzleme dakika ve ilerleme kayıtları
5. Grafiksel öğrenci paneli
6. Bölüm/kurs test sistemi
7. Sertifika üretimi ve doğrulama
8. Ödeme/paket erişimi
9. Yönetim paneli
10. Test ve canlı yayın
