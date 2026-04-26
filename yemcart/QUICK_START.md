# 🚀 البدء السريع - YemCart

## الخطوات الثلاث الأساسية للبدء

---

## 1️⃣ استبدال Firebase Config (الأهم!)

### 📂 افتح الملف:
```
yemcart/lib/firebase.ts
```

### 🔑 استبدل هذا:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // ← 1️⃣ استبدل
  authDomain: "YOUR_AUTH_DOMAIN",      // ← 2️⃣ استبدل
  projectId: "YOUR_PROJECT_ID",        // ← 3️⃣ استبدل
  storageBucket: "YOUR_STORAGE_BUCKET",// ← 4️⃣ استبدل
  messagingSenderId: "YOUR_SENDER_ID", // ← 5️⃣ استبدل
  appId: "YOUR_APP_ID",                // ← 6️⃣ استبدل
};
```

### 🔍 بقيم Firebase الفعلية:
اذهب لـ: https://console.firebase.google.com
- اختر مشروعك
- اذهب لـ Settings
- انسخ Web configuration

### 💾 احفظ الملف

---

## 2️⃣ تفعيل Firebase Services

### في Firebase Console:

**أ) تفعيل Authentication:**
```
1. اذهب لـ: Authentication
2. اختر: Email/Password
3. اضغط: Enable ✅
```

**ب) إنشاء Firestore Database:**
```
1. اذهب لـ: Firestore Database
2. اضغط: Create Database
3. اختر: Start in test mode
4. اختر: Nearest Region
5. اضغط: Create ✅
```

---

## 3️⃣ شغّل التطبيق

### في Terminal:

```bash
# اذهب للمشروع
cd /workspaces/YemCart/yemcart

# ثبّت المتطلبات (إن لم تكن مثبتة)
npm install

# شغّل التطوير
npm run dev
```

### اذهب لـ:
```
http://localhost:3000
```

---

## ✅ اختبر الآن

### على الصفحة الرئيسية:
```
🛒 سوق اليمن

[📦 تصفح المنتجات]
[دخول]  [تسجيل]
```

### جرب هذا:

1. **✅ التسجيل:**
   - اضغط "تسجيل"
   - أدخل البريد والكلمة
   - اضغط "تسجيل"
   - يجب التحويل لـ dashboard

2. **✅ لوحة التحكم:**
   - يجب أن ترى بريدك
   - اضغط "تصفح المنتجات"

3. **✅ المنتجات:**
   - يجب أن ترى 6 منتجات
   - اضغط على منتج
   - رى تفاصيله

4. **✅ تسجيل الخروج:**
   - عد لـ dashboard
   - اضغط "تسجيل الخروج"
   - يجب التحويل للرئيسية

---

## 🎯 المسارات المتاحة

| الصفحة | المسار |
|--------|--------|
| 🏠 الرئيسية | `/` |
| 📝 تسجيل | `/register` |
| 🔓 دخول | `/login` |
| 👤 لوحة التحكم | `/dashboard` |
| 📦 المنتجات | `/products` |
| 🔍 تفاصيل المنتج | `/products/1` |

---

## ⚠️ إذا واجهت مشاكل

### ❌ "Firebase not initialized"
```
✅ الحل: تأكد من استبدال Firebase Config في lib/firebase.ts
```

### ❌ "Cannot sign up"
```
✅ الحل: تفعّل Authentication → Email/Password في Firebase
```

### ❌ "Cannot save user to Firestore"
```
✅ الحل: تأكد من إنشاء Firestore Database
```

### ❌ "Port 3000 in use"
```bash
# افتح port مختلف
npm run dev -- -p 3001
```

---

## 💾 الملفات المهمة

| الملف | الوصف |
|------|-------|
| `lib/firebase.ts` | ⭐ استبدل Config هنا |
| `lib/auth.ts` | دوال المصادقة |
| `SETUP.md` | دليل الإعداد الكامل |
| `FIREBASE_CONFIG.md` | تعليمات Firebase مفصلة |

---

## 📱 الهواتف الذكية

تشغيل على جهازك:
```bash
# من نفس يجهاز الـ WiFi:
http://10.0.1.149:3000
```

استبدل IP بـ IP حهازك

---

## 🎉 بعد الاختبار

### للإنتاج:

```bash
# بناء الإصدار النهائي
npm run build

# تشغيل الإنتاج
npm start
```

### للنشر على Vercel:

```bash
# 1. ادفع إلى GitHub
git push

# 2. اذهب لـ Vercel.com
# 3. Import Project
# 4. ربط Firebase Config
# 5. Deploy
```

---

## 📚 المزيد من المعلومات

- [SETUP.md](./SETUP.md) - دليل كامل
- [FIREBASE_CONFIG.md](./FIREBASE_CONFIG.md) - Firebase بالتفصيل
- [COMPLETION_REPORT.md](./COMPLETION_REPORT.md) - تقرير الإنجاز
- [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md) - ملف شامل

---

## ✨ ماذا بعد؟

بعد النجاح، يمكنك:

1. 🛒 **إضافة عربة التسوق**
2. 💳 **نظام الدفع**
3. 📦 **تتبع الطلبات**
4. ⭐ **تقييمات المنتجات**
5. 🌐 **النشر على الويب**

---

**تم! الآن يمكنك البدء 🚀**

**شرح الخطوات أعلاه ليأخذ أقل من 5 دقائق!**
