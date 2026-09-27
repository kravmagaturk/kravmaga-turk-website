# Online Akademi V2 — Private Video Worker

Bu Worker private Backblaze B2 bucket ile web oynatıcı arasında güvenli bir proxy katmanı oluşturur.

## Amaç
- B2 bucket public yapılmaz.
- B2 keyID/applicationKey frontend veya GitHub içine yazılmaz.
- Tarayıcı yalnızca /api/video/<ders-id> adresini görür.
- Gerçek B2 dosya yolu Worker içinde kalır.
- HTTP Range istekleri geçirilerek video ileri/geri sarma desteklenir.
- İlk test eşlemesi: basic-17 -> media/basic/basic-17-reaksiyon-4.mp4

## Güvenlik
- Master Application Key kullanılmaz.
- Sadece kravmaga-online-akademi-media bucket'ına bağlı sınırlı application key kullanılmalı.
- B2_KEY_ID ve B2_APPLICATION_KEY yalnızca Cloudflare Worker secret olarak eklenmeli.
- Secret değerleri GitHub'a, courses.json'a veya HTML'e yazılmamalı.
- Üyelik aşamasında Worker içindeki TODO bölümüne oturum ve ders yetkisi doğrulaması eklenecek.

## Yerel kullanım
1. npm install
2. .dev.vars.example dosyasını .dev.vars olarak kopyala.
3. Gerçek anahtarları yalnızca yerel .dev.vars içine koy.
4. npm run dev

## Cloudflare deploy
1. npx wrangler login
2. npx wrangler secret put B2_KEY_ID
3. npx wrangler secret put B2_APPLICATION_KEY
4. npm run deploy

Bucket adı wrangler.toml içinde değişken olarak bulunur; secret değildir.
