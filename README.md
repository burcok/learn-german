# Almanca Öğren (Vue 3 + Vite + TailwindCSS)

Modern, profesyonel ve tamamen frontend tabanlı Almanca öğrenme platformu.

## Özellikler
- **Kategoriler:** Kelime Hazinesi, Deyimler & Atasözleri, Gramer Açıklamaları, Mini Quizler, Okuma Parçaları, Dinleme Alıştırmaları, Diyaloglar, Sık Kullanılan Kalıplar
- **Yapay Zeka Destekli Alıştırmalar:** OpenAI API ile örnek cümle, quiz, açıklama, diyalog üretimi (kişisel kullanım için)
- **Bildirim Sistemi:** Web Push API ile zamanlanabilir, kullanıcı ayarlı bildirimler
- **TTS (Text-to-Speech):** Kelime, deyim, okuma, diyalog ve kalıplar için sesli okuma
- **Koyu/Açık Mod:** Otomatik ve kullanıcı seçimine göre
- **Responsive ve Modern Tasarım:** TailwindCSS ile mobil ve masaüstü uyumlu
- **Pinia ile State Management**
- **Vue Router ile SPA Deneyimi**

## Kurulum
1. Projeyi klonlayın veya indirin.
2. Gerekli paketleri yükleyin:
   ```sh
   npm install
   ```
3. Geliştirme sunucusunu başlatın:
   ```sh
   npm run dev
   ```
4. OpenAI API anahtarınızı `.env` dosyasına ekleyin (isteğe bağlı, AI için).

## Dosya Yapısı
```
/public
  /assets
  /data
  sw.js
/src
  /components
  /views
  /stores
  /utils
  App.vue
  main.js
  router.js
  style.css
```

## Notlar
- Tüm içerik dosyaları `/public/data/` altında JSON olarak tutulur.
- Bildirimler ve TTS tamamen tarayıcı desteklidir.
- AI entegrasyonu kişisel kullanım içindir, anahtarınızı kimseyle paylaşmayın.

## Lisans
MIT 