# 15 Kasım 2026 – güvenlik ve KVKK uygulama notları

Bu dal, 15 Kasım 2026 tarihli değerlendirme raporları ve kaynak kod kontrollerinden sonra hazırlanmıştır.

- Geri dönüş dalı: backup/pre-security-kvkk-2026-11-15 (a55efbb0202667e8abaf17e5784cb0815d283409).
- Statik yanıtlar için _headers dosyasında güvenli başlangıç başlıkları ve yalnızca raporlama yapan CSP tanımı eklendi. HSTS ilk aşamada 300 saniyedir; includeSubDomains ve preload kullanılmadı. İletişim/abonelik Worker yanıtları ayrı kontrol edilmelidir.
- Formlara KVKK bilgisi ve ayrı aydınlatma bağlantısı eklendi. Tam hukuki uygunluk, veri sorumlusu kimliği, aktarım güvenceleri, saklama süresi ve abonelik onay kayıtlarının uzmanla teyidini gerektirir.
- Sorgu ekranında en az üç karakter ve ilk 20 eşleşme sınırı, istemci tarafında yanlışlıkla toplu listelemeyi azaltır. **Bu, sunucu tarafı erişim güvenliği değildir**: Firebase Realtime Database'de publicInstructors okuma kuralları ve veri alanları denetlenip sunucu taraflı filtreleme/sınırlama uygulanmadan bulk erişim riski devam eder.
- İletişim Worker'ındaki RAM içi Map hız sınırlaması farklı Worker kopyaları/yeniden başlatmalar arasında ortak değildir. Turnstile ve Cloudflare Rate Limiting veya Durable Objects gibi merkezi koruma ayrıca kurulmalıdır. Secrets GitHub'a eklenmemelidir.
- Yayın öncesi: /iletisim formunu; /online-akademi aboneliğini; /egitmen-and-seviye-sorgu kısa, uzun ve boş aramalarını; mobil menüyü; başlıkların gerçek HTTP yanıtına yansımasını kontrol edin.
- Cloudflare Build kullanıcının tercihiyle kapalı olabilir. GitHub'da merge edilen dosyalar otomatik canlıya gitmeyebilir.
