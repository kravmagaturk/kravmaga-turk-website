# KRAV MAGA TÜRK — TRANSFER REFERANS NOTU

Bu dosya, `transfer-test` dalındaki bağımsız web sitesi aktarımının çalışma kurallarını kaydeder.

## Temel kural
- Canlı `https://kravmaga.com.tr` Hostinger sitesi referans ve geri dönüş noktasıdır.
- Canlı Hostinger siteye TRANSFER tamamlanmadan riskli değişiklik yapılmaz.
- Çalışma alanı GitHub `kravmagaturk/kravmaga-turk-website` deposunun `transfer-test` dalıdır.
- `international-register` diploma/sicil sistemi ayrı tutulur.

## Her sayfada uygulanacak temizlik
1. Hostinger Website Builder / Zyro kalıntılarını kaldır.
2. Kullanılan görselleri mümkün olduğunca `assets/` altında yerelleştir.
3. `assets.zyrosite.com` ve benzeri eski tema bağımlılıklarını kaldır.
4. Gereksiz, kullanılmayan görsel / CSS / JS / arşiv dosyalarını doğrulamadan tutma.
5. Ortak menü, footer, siyah tema, kırmızı vurgu ve 1948 Krav Maga Türk görsel standardını koru.
6. Mobil ve tablet görünümünü sayfa onayından önce kontrol et.
7. SEO canonical, title, description, robots ve sitemap bağlantılarını bağımsız site yapısına göre koru.
8. Bir sayfa kullanıcı tarafından onaylanmadan sıradaki modüle geçme.

## Özel notlar
- Legionnaire sayfasındaki eski Hostinger/Zyro fotoğraf URL'leri yerel `assets/legionnaire/` dosyalarına çevrilmelidir.
- Eğitmen & Seviye Sorgu sayfasında siyah tam sayfa görünüm, 1948 logo ve KVKK bölümü korunmalıdır.
- GitHub kökünde ve assets klasörlerinde kullanılmayan eski dosyalar periyodik olarak taranıp temizlenmelidir.


## MODÜL 7 — Temizlik Durumu
- 1948 logo ana site deposuna taşındı: `assets/brand/logo-1948.png`.
- Legionnaire 8 arşiv görseli yerel `assets/legionnaire/` klasöründen kullanılıyor.
- Kullanılmayan eski `KRAV-MAGA-TURK-V4-MENU.png`, `KURULUM.txt` ve `assets/site.js` kaldırıldı.
- Eski `international-register/main/logo.png` görsel bağımlılığı ana site sayfalarından kaldırıldı.
- Aktif kullanılan `hero.webp`, `assets/security/ozel-guvenlik-xray.webp`, eğitim ve temsilcilik görselleri korunuyor.
- Kalan Zyro bağımlılığı: YOK. Ana Sayfa ve Belgeler görselleri `assets/home/` ve `assets/documents/` altına yerelleştirildi.


## MODÜL 8 — Tam Site Testi
- Başlangıç: 24 Eylül 2026.
- Ana sayfa ve Temsilcilikler menüsündeki canlı siteye kaçan Eğitmen & Seviye Sorgu / Blog bağlantıları test dalındaki yerel HTML sayfalarına çevrildi.
- Eğitimler sayfasındaki harici GitHub avatar görseli yerel `assets/brand/logo-1948.png` ile değiştirildi.
- `hakkimizda.html` dosyasının Bülent Çetin sayfasının eski/noindex kopyası olduğu doğrulandı; Eğitimler bağlantısı `bulent-cetin.html` olarak düzeltildi ve eski kopya kaldırıldı.
- Canonical `/temsilcilik` adresinin `temsilcilikler.html` dosyasına eşlenmesi için `_redirects` eklendi.
- Taranan sayfalarda aktif Hostinger/Zyro bağımlılığı bulunmadı; kalan `kravmaga.com.tr` adresleri canonical SEO URL'leridir.
- Kod seviyesi son turunda eski `hakkimizda.html` bağlantıları Ana Sayfa ve Özel Güvenlik sayfasında `bulent-cetin.html` olarak düzeltildi.
- Ortak `assets/footer.js` menü kodu kontrol edildi: mobil menü, alt menüler, ESC ile kapatma ve tüm sayfalara ortak header/footer enjeksiyonu mevcut.
- CSP başlığı mevcut inline CSS/JS mimarisiyle uyumlu hale getirildi; Firebase sorguları için `https://kravmaga-diploma-default-rtdb.firebaseio.com` connect-src iznine eklendi ve HTTPS profil görsellerine izin verildi.
- MODÜL 8 kod seviyesi testi tamamlandı; kullanıcı tarafında gerçek tarayıcı masaüstü/telefon görsel kontrolü kaldı.

- Main/transfer-test karşılaştırması: transfer-test main dalının 174 commit önünde, 0 commit gerisinde. Main üzerinde kaçırılmış yeni değişiklik yok.
- Statik yerel bağlantı/asset bütünlük taramasında kalan kırık iç referans bulunmadı.
- Firebase REST uç noktaları bu çalışma ortamının web erişim kısıtı nedeniyle dışarıdan doğrudan doğrulanamadı; kod ve CSP izinleri kontrol edildi.
- MODÜL 8 için kalan tek doğrulama gerçek yayın URL'sinde tarayıcı görsel/etkileşim testidir; canlı main dalına geçiş yapılmadı.

- Vercel preview deployment tetikleme notu: 24 Eylül 2026, MODÜL 8 tarayıcı testi için.

- Vercel `transfer-test` preview başarıyla tetiklendi: `kravmaga-transfer-test-git-transfer-test-bulicet-9162.vercel.app`.
- Preview dış erişimi Vercel koruması nedeniyle araçlardan doğrulanamadı; kullanıcı tarayıcı testi gerekli.
- Aynı committe eski Cloudflare entegrasyonları `kravmaga-turk-website`, `kravmaga-turk-test` ve `kravmaga-portrait` için otomatik build denedi ve başarısız oldu. Bunlar MODÜL 9 öncesi entegrasyon temizliği olarak ele alınacak; repo kodu şu aşamada değiştirilmedi.

## MODÜL 9 — Canlıya Geçiş Hazırlığı
- Geri dönüş dalı oluşturuldu: `backup-pre-transfer-2026-09-24` (main SHA: `7da9d39417e1cd2c12787711812ea4caed7e67ca`).
- `transfer-test -> main` için draft PR açıldı: #1 `TRANSFER: canlıya geçiş hazırlığı`.
- PR mergeable durumda; ancak eski Cloudflare GitHub entegrasyonları nedeniyle check durumu unstable.
- Vercel preview kontrolü başarılı.
- Hata veren/eski Cloudflare kontrolleri: `kravmaga-portrait` ve `kravmaga-turk-test` (bazı commitlerde `kravmaga-turk-website` de tetiklendi).
- Bu eski entegrasyonlar temizlenmeden PR main'e merge edilmeyecek ve `kravmaga.com.tr` DNS/yönlendirmesi değiştirilmeyecek.

### MODÜL 9 — Domain geçişi tamamlandı
- `kravmaga.com.tr` Vercel Production ortamına bağlandı ve Valid Configuration durumuna geldi.
- `www.kravmaga.com.tr` Vercel üzerinde 308 Permanent Redirect ile `kravmaga.com.tr` adresine yönlendirildi ve Valid Configuration durumuna geldi.
- Cloudflare kök web kayıtları Vercel CNAME hedefine taşındı: `eae4c6c2485b91d4.vercel-dns-017.com` (DNS only).
- Hostinger e-posta kayıtları (MX, SPF, DKIM, DMARC, autoconfig, autodiscover) korunarak bırakıldı.
- Geri dönüş dalı: `backup-pre-transfer-2026-09-24`.
- Post-cutover doğrulama tamamlanmadan eski Hostinger/Cloudflare yardımcı entegrasyonları silinmeyecek.

### Post-cutover kontrolü
- Ana sayfa, İletişim, Eğitimler, Belgeler, Legionnaire, Eğitmen & Seviye Sorgu ve Diploma Sorgu üretim kodları kontrol edildi; aktif Hostinger/Zyro bağımlılığı bulunmadı.
- Tüm kritik sayfalarda H1 ve ortak `assets/footer.js` yüklemesi mevcut.
- Vercel için eksik olan native yapılandırma eklendi: `vercel.json`.
- `cleanUrls: true` ile sitemap/canonical uzantısız URL yapısı Vercel'e uyarlandı.
- `/temsilcilik -> /temsilcilikler` internal rewrite eklendi.
- Güvenlik header'ları Vercel native `headers` yapılandırmasına taşındı; Firebase REST bağlantısı CSP içinde izinli.
- `robots.txt` ve `sitemap.xml` mevcut ve Vercel clean URL yapısıyla uyumlu hale getirildi.
- Dış web crawler halen eski Hostinger önbelleği döndürebildiği için gerçek zamanlı içerik doğrulamasında referans alınmamalı; Vercel/DNS Valid Configuration ve repo üretim kodu esas alınmalı.

### TRANSFER sonrası temizlik
- Vercel geçişinden sonra artık gereksiz kalan `_headers` ve `_redirects` dosyaları kaldırıldı; görevleri `vercel.json` içinde korunuyor.
- Repo genelinde `hostinger`, `zyro`, `hstgr.net` ve `assets.zyrosite.com` referansları tarandı; aktif web kodunda kalıntı bulunmadı.
- `cloudflare/portrait-worker` ayrı çalışan servis olduğu için korundu.
- Son `main` commitlerinde eski Cloudflare GitHub build check'leri tetiklenmiyor; Vercel artık ana üretim akışı.

### Mobil / SEO / Performans son turu
- Ana içerik sayfalarına Open Graph ve Twitter paylaşım meta etiketleri eklendi.
- Ana sayfaya `og:image`, Twitter paylaşım görseli ve Organization JSON-LD yapılandırılmış verisi eklendi.
- Eğitimler ve Belgeler görsellerinde eksik `decoding="async"` ayarları tamamlandı.
- Ortak mobil menüye küçük ekranlarda güvenli dikey kaydırma, overscroll kontrolü ve touch scrolling eklendi.
- Vercel `vercel.json` içinde statik `/assets/*` ve hero görseli için kontrollü cache header'ları eklendi.
- Büyük dosya tespiti: `assets/home/egitim-secenekleri.png` ~1.9 MB, `assets/brand/logo-1948.png` ~0.92 MB, `assets/documents/muay-thai-hakem.png` ~0.88 MB. Bunlar binary sıkıştırma için sonraki medya optimizasyonu adaylarıdır.

### Görsel sıkıştırma / Vercel Image Optimization
- Vercel native Image Optimization aktif edildi (`images` yapılandırması, AVIF/WebP, minimum cache TTL 86400).
- `assets/home/egitim-secenekleri.png` (~1.9 MB) ana sayfada responsive optimize edilmiş 768/1080/1500px çıktılar üzerinden servis ediliyor (q=78).
- `assets/brand/logo-1948.png` (~0.92 MB) görünür kullanımlarda 128px/512px optimize edilmiş çıktı üzerinden servis ediliyor (q=82).
- `assets/documents/muay-thai-hakem.png` (~0.88 MB) Belgeler sayfasında 1334px optimize edilmiş çıktı üzerinden servis ediliyor (q=88).
- Orijinal PNG dosyaları kalite/yedek amacıyla repoda korunuyor; ziyaretçiye ağır orijinal yerine Vercel'in sıkıştırılmış modern formatı gönderiliyor.

### Dosya adı temizliği
- Eski çift uzantılı `hero.webp.webp` dosyası `hero.webp` olarak yeniden adlandırıldı; ana sayfa, Yakın Koruma, Vercel cache/image config ve sosyal paylaşım görsel referansları atomik commit ile güncellendi.

### Asset klasör düzeni
- Kök dizindeki `assetsozel-guvenlik-xray.webp` dosyası `assets/security/ozel-guvenlik-xray.webp` altına taşındı.
- `assets/cpo-egitim-icerigi.webp` dosyası `assets/security/cpo-egitim-icerigi.webp` altına taşındı.
- `assets/bulent-cetin-hero.png` dosyası `assets/about/bulent-cetin-hero.png` altına taşındı.
- İlgili sayfa referansları aynı atomik commit içinde güncellendi; kök dosya kirliliği azaltıldı ve güvenlik görselleri Vercel `/assets/*` optimizasyon kapsamına alındı.
