# Firebase publicInstructors korumalı sorguya geçiş

CANLI DEĞİL — Bu dal hazırlıktır. Eski sayfa ve Firebase Rules değiştirilmemiştir.

Problem: publicInstructors koleksiyonunda .read=true olduğu için 19 eğitmen kaydı (giriş/çıkış tarihi alanları dahil) doğrudan okunabiliyor.

Yeni API: kmt-instructor-lookup Worker, POST /search ile en az üç harflik isim araması; rol/durum filtreleri; en çok 20 kayıt; yalnız izin verilen alanlar; 10 sorgu/60 saniye Cloudflare rate limit. Token sunucu tarafında kullanılır.

Yayın aşamaları:
1. Sadece veritabanını okuyan ayrı bir Google hizmet kimliği hazırlanır; yetkileri en düşük düzeyde tutulur. Gerekli iki bilgi Cloudflare secrets olarak atanır: FIREBASE_SERVICE_ACCOUNT_EMAIL ve FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY. Anahtarın kendisi sohbet/GitHub/log'a yazılmaz.
2. Bu Worker dağıtılır, sağlık, CORS, kötü kaynak, min. karakter, gerçek isim, rol/durum ve rate limit test edilir.
3. Site egitmen-and-seviye-sorgu.html sayfası Worker API'sini kullanacak sürüme alınır; gerçek arama, resimler ve mobil görünüm doğrulanır.
4. Ancak sonra Firebase publicInstructors .read değeri mevcut açık true yerine yönetici hesabını koşullandıran kural olarak değiştirilir. Diğer kurallar ve publicDiplomaData aynı kalır.
5. Anonim doğrudan koleksiyon GET engellenirken, Worker ile gerçek isim araması çalışır durumda olmalıdır.

Orijinal kuralların yerel yedeği: C:\Users\bulic\OneDrive\Masaüstü\KMT_WEB_YEDEKLERI\firebase-rtdb-rules-snapshot-2026-11-15.json
Henüz veri tabanı izni, anahtar veya canlı site değişmedi. Anahtar üretimi ve güvenli geçiş kesinleştirilmeden merge ETMEYİN.
KVKK değerlendirmesi: joinDate ve exitDate alanlarının kamuya görünür olmasının gerekliliği ayrıca değerlendirilmelidir.