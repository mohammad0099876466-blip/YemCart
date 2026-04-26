# 🔥 تعليمات Firebase - الخطوة الأهم

## ⚠️ خطوة حاسمة: إضافة Firebase Config

### 📍 الملف الذي تحتاج لتعديله:
```
yemcart/lib/firebase.ts
```

---

## 📌 خطوات الحصول على Firebase Config

### 1️⃣ اذهب إلى Firebase Console
```
https://console.firebase.google.com
```

### 2️⃣ اختر مشروعك
اختر: **yemcart-ca9cd** (أو مشروعك الخاص)

### 3️⃣ اذهب إلى Settings
```
⚙️ Settings → Project Settings
```

### 4️⃣ اختر Web App
```
Your apps → اختر تطبيقك الويب
```

### 5️⃣ انسخ الـ Config
ستجد هذا الكود:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBGuVre5-N8iQuKoXcXnCuVc...",
  authDomain: "yemcart-ca9cd.firebaseapp.com",
  projectId: "yemcart-ca9cd",
  storageBucket: "yemcart-ca9cd.firebasestorage.app",
  messagingSenderId: "1046616649127",
  appId: "1:1046616649127:web:14c9048c9a3f52e7b39a82",
};
```

---

## 🔧 الآن استبدل في الملف

### الملف الأصلي (`lib/firebase.ts`):

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // ← غيّر هنا
  authDomain: "YOUR_AUTH_DOMAIN",      // ← غيّر هنا
  projectId: "YOUR_PROJECT_ID",        // ← غيّر هنا
  storageBucket: "YOUR_STORAGE_BUCKET",// ← غيّر هنا
  messagingSenderId: "YOUR_SENDER_ID", // ← غيّر هنا
  appId: "YOUR_APP_ID",                // ← غيّر هنا
};
```

### بعد الاستبدال:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBGuVre5-N8iQuKoXcXnCuVcpCJnDAM4ok",
  authDomain: "yemcart-ca9cd.firebaseapp.com",
  projectId: "yemcart-ca9cd",
  storageBucket: "yemcart-ca9cd.firebasestorage.app",
  messagingSenderId: "1046616649127",
  appId: "1:1046616649127:web:14c9048c9a3f52e7b39a82",
};
```

---

## ✅ بعد الاستبدال

### تفعيل Authentication:

1. في Firebase Console اذهب إلى: **Authentication**
2. اختر: **Email/Password**
3. اضغط: **Enable** ✅

### إنشاء Firestore Database:

1. في Firebase Console اذهب إلى: **Firestore Database**
2. اضغط: **Create Database**
3. اختر: **Start in test mode**
4. اختر: **Nearest Region**
5. اضغط: **Create** ✅

---

## 🚀 الآن شغّل التطبيق

```bash
npm run dev
```

ستجد التطبيق على:
```
http://localhost:3000
```

---

## 🧪 اختبر الميزات

1. **الصفحة الرئيسية**: يجب أن ترى الأزرار والعنوان
2. **التسجيل**: انقر "تسجيل" وأنشئ حساب جديد
3. **الدخول**: انقر "دخول" وادخل البريد والكلمة
4. **لوحة التحكم**: بعد الدخول، يجب أن:
   - ترى بريدك الإلكتروني
   - ترى زر "تصفح المنتجات"
   - ترى زر "تسجيل الخروج"
5. **المنتجات**: يجب أن ترى 6 منتجات
6. **تفاصيل المنتج**: انقر على منتج ترى تفاصيله

---

## ⚠️ الأخطاء الشائعة

### ❌ "Firebase not initialized"
**الحل**: تأكد من استبدال Firebase Config

### ❌ "Authentication not enabled"
**الحل**: اذهب لـ Firebase Console → Authentication → Enable Email/Password

### ❌ "Cannot write to Firestore"
**الحل**: اذهب لـ Firestore → Edit Rules → السماح بالكتابة

### ❌ "CORS Error"
**الحل**: هذا نادر - تحقق من اسم المجال في Firebase

---

## 📄 القاعدة الأمنية البسيطة

بعد الاختبار، استخدم هذه القواعد في Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## ✨ نصائح مهمة

- 💾 احفظ الملف بعد الاستبدال
- ⚡ قد تحتاج لـ refresh المتصفح
- 🔑 لا تشارك Firebase Config مع أحد
- 📱 اختبر على هاتفك أيضاً (بنفس الـ WiFi)

---

**الآن أنت جاهز! 🎉**
