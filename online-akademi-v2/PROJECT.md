# Krav Maga Turk Online Akademi V2

## Amaç
Mevcut masaüstü eğitim modülünün içerik ve ders organizasyonunu koruyup modern web tabanlı Online Akademi sistemine dönüştürmek.

## Kaynaklar
- Eski modül: \\BULICET\Users\RDC-GUEST\OneDrive\Belgeler\modul
- Mevcut web sayfası: online-akademi.html
- Video sayısı: 110 WMV
- Toplam video boyutu: yaklaşık 6.65 GB
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
- [ ] 7. Video depolama seçimi (Cloudflare R2/Stream veya YouTube)
- [ ] 8. Üyelik/yetki sistemi
- [ ] 9. İlerleme takibi
- [ ] 10. Kitap QR eşleştirmesi
- [ ] 11. Test yayını
- [ ] 12. Canlıya geçiş

## DURUM
2026-09-27:
- online-akademi-v2 dalı main üzerinden oluşturuldu.
- Kaynak modülde 110 WMV video ve yaklaşık 6.65 GB içerik tespit edildi.
- Kategoriler: Basic, Bear_Hug, Bıçak, DimMak-1, DimMak-2, Haber, Kilit, Materyal, Silah, Sopa, Tekme, Yer.
- Yerel tam video envanteri online-akademi-course-catalog.json olarak üretildi.
- Canlı siteye değişiklik yapılmadı.
- courses.json veri modeli oluşturuldu.
- Basic Combatives için 23 ders veri modeline bağlandı.
- online-akademi.html test dalında Basic ders listesini veri üzerinden açıp kapatan prototipe dönüştürüldü.
- Videoların çoğu henüz oynatılmıyor; toplu MP4 dönüşümü bekliyor.
- FFmpeg 9.0.2 essentials yerel araç klasörüne kuruldu.
- Basic/Reaksiyon 4 için ilk WMV -> MP4 testi tamamlandı.
- Çıktı: H.264 + AAC, 1280x720, 23.98 fps, faststart, ~3.70 MiB.
- Yerel HTML5 oynatıcı test sayfası oluşturuldu ve bilgisayarda açıldı.
- Dönüşüm profili TRANSCODING.md dosyasına kaydedildi.

## Sonraki iş
Video depolama seçimini yap: Cloudflare R2/Stream veya mevcut YouTube yapısı. Seçimden sonra Basic modülündeki videoUrl alanlarını gerçek yayın adreslerine bağla.
