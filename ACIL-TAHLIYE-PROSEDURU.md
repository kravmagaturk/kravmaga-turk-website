# KRAV MAGA TÜRK — ACİL TAHLİYE / GERİ DÖNÜŞ MASTER PROSEDÜRÜ

> **Kritik kural:** Kullanıcı "geriye dön" veya "acil tahliye" dediğinde hiçbir yıkıcı işlem otomatik başlatılmaz. Önce mevcut durum ve yedekler kontrol edilir, yapılacak işlemler özetlenir ve kullanıcıdan açık onay alınır.

## Sistem bileşenleri
- Web sitesi: `kravmagaturk/kravmaga-turk-website`
- Diploma/sicil: `kravmagaturk/international-register`
- Veritabanı / yönetici girişi: Firebase
- Ana veri düğümleri: `diplomaData`, `downloadLogs`, `securityLogs`
- Domain: `kravmaga.com.tr`
- Klasik hosting: Hostinger
- DNS/proxy: Cloudflare
- Portre Worker: `kravmaga-portrait`

## "GERİYE DÖN" KOMUTU GELDİĞİNDE
1. DUR: Silme, kapatma, DNS değiştirme veya canlı dosyanın üzerine yazma.
2. GitHub, Firebase, Cloudflare, Hostinger, domain ve e-posta durumunu kontrol et.
3. Son çalışan sürümlerin ve kritik verilerin yedeklerini doğrula.
4. Kullanıcıya geri dönüş planını ve etkilerini özetle.
5. Kullanıcıdan açık şekilde **"ONAYLIYORUM, GERİ DÖNÜŞÜ BAŞLAT"** onayı iste.
6. Bu onay gelmeden canlı sistemi etkileyen işleme geçme.

## MASTER SIRA

### A — Yedek
1. Her iki GitHub deposunun son sürümünü yedekle.
2. Mümkünse Git geçmişini de koru.
3. Firebase Realtime Database verilerini ayrıca dışarı aktar.
4. Firebase Rules ve Authentication yapılandırmasını kaydet.
5. Diploma şablonları, logolar ve diğer varlıkları kontrol et.
6. Mevcut DNS kayıtlarının kopyasını al.
7. Domain ve hesap kurtarma erişimlerinin kullanıcı kontrolünde olduğunu doğrula.

### B — Hostinger / klasik sistem
8. Hostinger hedef alanını hazırla.
9. Son onaylanmış site dosyalarını hedefe yükle.
10. Domaini çevirmeden önce önizleme/geçici adreste test et.
11. Telefon, tablet, masaüstü, menüler, görseller ve bağlantıları kontrol et.
12. İletişim, Dersler, Belgeler, Konum, Özel Dersler ve Güvenlik gibi kritik sayfaları kontrol et.

### C — Diploma / sicil
13. `international-register` uygulamasını hedef ortamda test et.
14. Firebase Authorized Domains gereksinimini kontrol et.
15. Yönetici girişini ve öğrenci sorgusunu test et.
16. Kayıt ekleme/düzenleme ve PDF üretimini test et.
17. Onaylanan web çiziminin doğru yayınlandığını kontrol et.
18. Gerçek sicil fotoğrafının halka açık profile yanlışlıkla aktarılmadığını doğrula.

### D — Domain / DNS / e-posta
19. Hedef sistem tamamen çalışmadan DNS değiştirme.
20. Web kayıtları ile mail kayıtlarını ayrı değerlendir.
21. MX ve ilgili mail kayıtlarını körlemesine değiştirme veya silme.
22. Domain/DNS değişikliğinden hemen önce kullanıcıdan son onay al.
23. Geçişten sonra `kravmaga.com.tr`, `www`, HTTPS ve SSL'i kontrol et.
24. E-posta gönderme/alma testi yap.

### E — Eski servisleri devreden çıkar
25. Yeni sistem doğrulanmadan GitHub Pages, Worker, Cloudflare zone veya Firebase bileşenlerini silme.
26. Portre Worker'a bağımlılık kalmadığını doğrula.
27. GitHub depolarını mümkünse silme; yedek/arşiv olarak koru.
28. Firebase verisini ancak ayrıca açık onayla sil.
29. Cloudflare'dan çıkılacaksa web ve mail yeni DNS üzerinde doğrulandıktan sonra tamamla.

## SON KABUL TESTİ
- Ana site açılıyor.
- Telefon, tablet ve masaüstü görünümü çalışıyor.
- Kritik sayfalar/görseller açılıyor.
- Yönetici girişi çalışıyor.
- Öğrenci sorgusu çalışıyor.
- Kayıt ekleme/düzenleme çalışıyor.
- Diploma/PDF üretimi çalışıyor.
- Onaylı web portresi akışı çalışıyor.
- Domain doğru sisteme gidiyor.
- HTTPS/SSL çalışıyor.
- E-posta gönderme/alma çalışıyor.
- Eski sistem kapatılsa bile kritik işlevler devam ediyor.

## ONAY KAPILARI
Aşağıdaki işlemler işlem anında ayrıca kullanıcı onayı gerektirir:
- Nameserver değiştirme
- Canlı A/AAAA/CNAME/MX kayıtlarını değiştirme veya silme
- Firebase verisi/rules/auth üzerinde yıkıcı değişiklik
- GitHub deposu veya önemli branch silme
- Cloudflare zone/Worker kapatma veya silme
- Hostinger canlı dosyalarını toplu silme/üzerine yazma
- Canlı siteyi başka ortama yönlendirme
- E-posta kayıtlarını değiştirme

## ALTIN KURAL
**YEDEKLE → HEDEFİ KUR → TEST ET → FIREBASE/DİPLOMAYI TEST ET → ONAY AL → DOMAIN/DNS'İ ÇEVİR → WEB + SSL + E-POSTAYI TEST ET → ANCAK SONRA ESKİ SERVİSLERİ DEVREDEN ÇIKAR.**

**Yasak sıra:** Önce Cloudflare/GitHub/Firebase'i silip sonra geri dönüşü denemek.

Bu dosyada parola, API tokenı, özel anahtar veya başka gizli bilgi tutulmaz.
