# KMT ortak akıllı video paneli — entegrasyon notları (09.11.2026)

## Mimari
- Ortak arayüz dosyası: `/assets/kmt-smart-player-shared.js` (kravmaga-turk-website Worker).
- Kitap okuyucuları: `/kitap` ve `/admin` üzerinden mevcut kitap oturumu/yönetici yetkileri; kendi Backblaze B2 hesabı ve kota sınırı.
- Akademi öğrencileri: `/online-akademi` üzerinden sicil + Google / yönetici onayı; kendi Backblaze B2 hesabı ve kota sınırı.
- **Tek arayüz dosyası, iki ayrı kimlik ve iki ayrı video depolama hattı.** Ortak dosya B2 videolarını proxy'lemez, oturum bilgisi veya gizli anahtar almaz.
- Ayrı backend Worker'ları silmeyin. Tek kaynak noktası *oynatıcı arayüzü* içindir; backendleri birleştirmek bu projenin amacı değildir.

## Kullanan sistemlerin eklemesi gereken kod
Mevcut oturum ve ders doğrulamasından **sonra**, yetkili video elementi oluştuğunda:

```html
<script src="/assets/kmt-smart-player-shared.js" defer></script>
```

```javascript
// Buradaki video elementi ve id'ler ÖRNEKTİR; gerçek öğrenci/kitap uygulaması kendi seçimlerini kullanır.
const ui = window.KMTSmartPlayer.mount(document.querySelector('video'), {
  userKey: student.registerNo,       // Oturumdaki kullanıcıya özgü, kesinlikle token değil
  lessonId: lesson.id,               // Mevcut dersin tanımlayıcısı
  label: lesson.title,
  resumeSec: progress.lastPosition,  // Yalnızca mevcut backend'den elde edildiyse
  completed: progress.completed,
  previous: previousAllowedLesson ? () => openAuthorizedLesson(previousAllowedLesson) : null,
  next: nextAllowedLesson ? () => openAuthorizedLesson(nextAllowedLesson) : null,
  chapters: lesson.chapters || []     // Sadece gerçek zaman kodları varsa
});
// Sonraki yetkili ders yüklenirken aynı video elementi için ui.setLesson({...}) çağırın.
```

## Güvenlik ve ilerleme
1. Video bağlantısı, yetkili erişim bileti, oturum ve saklama yine **mevcut backend'de** kalır. `mount` yeni erişim yetkisi vermez.
2. Önceki/sonraki düğmesi sadece yetkili dersler için callback verildiğinde etkinleşir. Güvenlik kontrolü backend'de yeniden yapılır.
3. Kaydetme ve tamamlama kayıtları mevcut uygulamanın orijinal `video` olay dinleyicilerinde kalır. Ortak panel kendi sunucu API'sine yazmaz.
4. Aynı cihazda kaldığı yerden devam için bir kullanıcı+ders anahtarıyla `localStorage` yedeği tutulur. Hesaplar arası taşıma için mevcut backend ilerleme verisini kullanın.
5. TR/EN sadece kontrol etiketlerini çevirir; video görüntüsü, ses veya işlenmiş altyazı çevrilmez.
6. Kitap platformu HTML / Worker kaynakları doğrulanmadan `/kitap*` ve `/admin*` rotalarına müdahale etmeyin.
7. Akademi platformu video Worker kaynağı doğrulanmadan `/online-akademi*` rotasına müdahale etmeyin.

## Mevcut durum
- Paylaşılan oynatıcı kaynak dosyası ana web sitesinde hazırlanmıştır; tek başına iki özel uygulamanın panelini **otomatik olarak değiştirmez**.
- `/kitap` yönetimi ve `/online-akademi` öğrenci portalı başka Worker rotalarıyla çalışmaktadır.
- İlgili iki uygulamanın kaynaklarına güvenli erişim sağlayınca mevcut panel markup'ı güncellenir ve canlı öğrenci hesaplarıyla uçtan uca test edilir.
