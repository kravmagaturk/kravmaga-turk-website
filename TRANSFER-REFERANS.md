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
- Aktif kullanılan `hero.webp.webp`, `assetsozel-guvenlik-xray.webp`, eğitim ve temsilcilik görselleri korunuyor.
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
