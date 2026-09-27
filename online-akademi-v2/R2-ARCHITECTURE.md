# Online Akademi V2 • R2 Media Architecture

## Karar
Cloudflare Stream kullanılmayacak.
Video depolama için Cloudflare R2 Standard ücretsiz kota hedeflenecek.

## İlk yapı
- R2 bucket adı (plan): kravmaga-online-akademi-media
- Bucket başlangıçta private olacak.
- MP4/H.264 + AAC dosyaları R2 içinde tutulacak.
- GitHub ve Cloudflare Pages içine video dosyaları konmayacak.
- Web arayüzü video adreslerini courses.json içindeki videoUrl alanından okuyacak.
- Üyelik sistemi geldiğinde video erişimi doğrudan herkese açık R2 linki yerine Worker üzerinden yetkilendirilecek.

## R2 klasör yapısı
media/
  basic/
  bear-hug/
  bicak/
  kilit/
  materyal/
  silah/
  sopa/
  tekme/
  yer/
  dimmak-1/
  dimmak-2/
  haber/

## Dosya isim standardı
- Küçük harf
- Türkçe karakter yok
- Boşluk yok
- Ders kimliği ile eşleşen sabit ad

Örnek:
media/basic/basic-17-reaksiyon-4.mp4

## Test videosu
Yerel kaynak:
Basic/reaksiyon_4.wmv

Yerel MP4:
_online-akademi-test-media/basic-reaksiyon-4.mp4

Hedef R2 anahtarı:
media/basic/basic-17-reaksiyon-4.mp4

## Güvenlik yaklaşımı
1. Bucket private.
2. Video erişimi ilk testte kontrollü URL ile yapılacak.
3. Üyelik aşamasında Worker, kullanıcının yetkisini doğrulayıp R2 objesini döndürecek.
4. Instructor/Security gibi özel bölümler ayrı erişim seviyeleriyle korunacak.
5. R2 erişim anahtarları hiçbir zaman frontend veya GitHub dosyalarına yazılmayacak.

## Kota disiplini
- Ham WMV arşivi R2'ye kopyalanmayacak.
- Sadece web için dönüştürülmüş MP4 dosyaları yüklenecek.
- Toplam depolama düzenli izlenecek.
- Ücretsiz kotaya yaklaşınca toplu yükleme durdurulacak.
