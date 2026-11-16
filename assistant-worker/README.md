# KMT Akıllı Asistan — bağımsız AI servisi

## Ön yüzde
- assets/kmt-assistant-knowledge.json: kamuya açık doğrulanmış soru-cevap bilgi tabanı.
- assets/kmt-assistant.js: yazılı sohbet, tercih edilirse sesli okuma / tarayıcı konuşmayı algılama.
- assets/kmt-assistant.css: mobil uyumlu hafif maskot arayüzü.
- Anasayfa ve ortak footer, ilk sayfa yüklenmesinden sonra arayüzü devreye alır.

## Yapay zeka bağlantısı
Bu Worker ayrı dağıtılmalıdır; öğrenci, video, yönetici servislerine erişim verilmeyecektir.
1. Ayrı Cloudflare Worker servisi oluştur; worker.js ve wrangler.toml dosyaları bu dizindedir.
2. OPENAI_API_KEY ve RATE_SALT secret olarak sakla; GitHub koduna yazma.
3. RATE_LIMIT_KV KV namespace binding ekle; KV yalnızca kaba sınırdır, Cloudflare WAF rate limiting de kur.
4. OpenAI hesabında API bütçe sınırı oluştur.
5. test.kravmaga.com.tr üzerinde test et ve yalnızca tek bir /api/kmt-assistant route'una bağla.
6. API etkin değilken sistem sitede yayınlanan sınırlı bilgi kartları ile yanıt verir; bu mod gerçek serbest yapay zeka sohbeti DEĞİLDİR.
7. Fiyat ve saat değiştiğinde bilgi tabanını da güncelle.

## KVKK ve güvenlik
- Yazılı ve sesli modda kişisel veri paylaşılmaması açıklanır.
- Tarayıcının yerleşik SpeechRecognition özelliği, konuşmayı tarayıcı sağlayıcısına işletebilir; üçüncü taraf değerlendirmesi gerekir.
- SpeechSynthesis sesi otomatik başlamaz, yalnızca kullanıcı seçimi ile açılır.
- Model yanıtları API tarafında store:false ile istenir.
- Üretimde KVKK aydınlatma metni, çerez/analitik politikası ve sağlayıcı uyumluluğu incelenmelidir.
- Yetkili belge, fiyat, kitap tarihi gibi kritik içerik bağımsız onay olmadan icat edilmez.

## Performans
Hafif CSS animasyonu, dış 3D kütüphane yok. İlk sayfa load sonrasında idle fırsatında JS yüklenir. Açılışta ses veya mikrofon çağrısı yapılmaz.
