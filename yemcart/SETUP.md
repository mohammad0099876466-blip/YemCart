# 🛒 YemCart - منصة التجارة الإلكترونية اليمنية

منصة حديثة لبيع وشراء المنتجات داخل اليمن مبنية بـ Next.js 16، React 19، و TypeScript مع Firebase للمصادقة و Firestore لقاعدة البيانات.

---

## ✨ الميزات الحالية

- ✅ **المصادقة الكاملة**: التسجيل والدخول والخروج
- ✅ **نظام المستخدمين**: حفظ بيانات المستخدمين في Firestore
- ✅ **نظام المنتجات**: عرض وتصفح المنتجات
- ✅ **لوحة التحكم**: لوحة تحكم شخصية للمستخدم
- ✅ **Tailwind CSS**: تصميم حديث وجميل
- ✅ **دعم اللغة العربية**: واجهة كاملة باللغة العربية
- ✅ **TypeScript**: كود آمن من ناحية الأنواع

---

## 🚀 البدء السريع

### 1. التثبيت والإعداد

تثبيت المتطلبات:
```bash
cd /workspaces/YemCart/yemcart
npm install
```

### 2. إضافة Firebase Configuration

**📌 الخطوة المهمة:**

افتح الملف: `lib/firebase.ts`

استبدل كود التكوين بـ Firebase config الخاص بك:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

**أين تجد هذه البيانات؟**
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروعك (yemcart-ca9cd)
3. اضغط على ⚙️ (Settings) ← Project Settings
4. اذهب إلى تبويب "Your apps"
5. اختر تطبيقك الويب
6. انسخ Firebase configuration

### 3. تشغيل المشروع

```bash
npm run dev
```

الموقع سيبدأ على: `http://localhost:3000`

---

## 📁 بنية المشروع

```
yemcart/
├── app/                          # App Router (Next.js)
│   ├── page.tsx                 # 🏠 الصفحة الرئيسية
│   ├── layout.tsx               # 📐 التخطيط الرئيسي
│   ├── login/page.tsx            # 🔓 صفحة الدخول
│   ├── register/page.tsx         # 📝 صفحة التسجيل
│   ├── dashboard/page.tsx        # 👤 لوحة التحكم
│   ├── products/
│   │   ├── page.tsx             # 📦 قائمة المنتجات
│   │   └── [id]/page.tsx        # 🔍 تفاصيل المنتج
│   └── globals.css              # 🎨 الأنماط العامة
├── lib/                          # 📚 مكتبات وأدوات
│   ├── firebase.ts              # 🔥 إعدادات Firebase
│   ├── auth.ts                  # 🔐 دوال المصادقة
│   ├── types.ts                 # 📋 أنواع TypeScript
│   └── products.ts              # 📦 بيانات المنتجات
├── public/                       # 📄 الملفات الثابتة
├── package.json                 # 📦 المتطلبات
├── tsconfig.json                # ⚙️ إعدادات TypeScript
└── next.config.ts               # ⚙️ إعدادات Next.js
```

---

## 🔐 نظام المصادقة

### دوال المصادقة المتاحة (`lib/auth.ts`)

```typescript
// التسجيل
await registerUser(email: string, password: string): Promise<User>

// الدخول
await loginUser(email: string, password: string): Promise<FirebaseUser>

// الخروج
await logoutUser(): Promise<void>

// الحصول على رسالة الخطأ
getAuthErrorMessage(error: any): string
```

### سير العمل

1. **التسجيل**: المستخدم يدخل البريد والكلمة السرية → ينشئ حساب Firebase → يحفظ البيانات في Firestore
2. **الدخول**: المستخدم يدخل البيانات → يتحقق Firebase → ينتقل للوحة التحكم
3. **الخروج**: يتم تسجيل الخروج من Firebase ويعود للصحفة الرئيسية

---

## 📊 Firestore Database Structure

### Collection: `users`

```json
{
  "uid": "user_id_from_firebase",
  "email": "user@example.com",
  "role": "buyer",
  "createdAt": "2024-04-26T00:00:00.000Z"
}
```

---

## 🛍️ نظام المنتجات (Beta)

### المنتجات الحالية (تجريبية)

المنتجات محفوظة في `lib/products.ts` كـ dummy data:
- جهاز كمبيوتر محمول - $500
- سماعات رأس لاسلكية - $150
- ساعة ذكية - $200
- كاميرا رقمية - $800
- لوحة مفاتيح ميكانيكية - $120
- ماوس لاسلكي - $50

---

## 📱 الصفحات المتاحة

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| 🏠 الرئيسية | `/` | الصفحة الرئيسية للمتجر |
| 📝 تسجيل | `/register` | إنشاء حساب جديد |
| 🔓 دخول | `/login` | تسجيل الدخول |
| 👤 لوحة التحكم | `/dashboard` | معلومات المستخدم (محمية) |
| 📦 المنتجات | `/products` | قائمة المنتجات |
| 🔍 تفاصيل المنتج | `/products/[id]` | تفاصيل منتج واحد |

---

## 🔒 الحماية والأمان

- ✅ صفحة `/dashboard` محمية - تتطلب تسجيل دخول
- ✅ كلمات المرور مشفرة بواسطة Firebase
- ✅ التحقق من البيانات جانب العميل والخادم
- ✅ رسائل خطأ واضحة بالعربية

---

## 🛠️ الأدوات المستخدمة

- **Next.js 16** - إطار عمل React حديث
- **React 19** - مكتبة واجهات المستخدم
- **TypeScript** - لغة محسّنة من JavaScript
- **Tailwind CSS** - أنماط CSS حديثة
- **Firebase Auth** - المصادقة السحابية
- **Firestore** - قاعدة البيانات السحابية

---

## 📝 ملاحظات للتطوير

### مميزات قادمة

- 🔜 نظام عربة التسوق
- 🔜 نظام الدفع
- 🔜 بيع المنتجات
- 🔜 تتبع الطلبات
- 🔜 نظام التقييمات والآراء
- 🔜 المحفظة الرقمية

### الأخطاء الشائعة

**خطأ: "Firebase config not found"**
- ✅ تحقق من ملف `lib/firebase.ts` وأضف البيانات الصحيحة

**خطأ: "Authentication not enabled"**
- ✅ اذهب لـ Firebase Console → Authentication → قعّل Email/Password

**خطأ: "Cannot write to Firestore"**
- ✅ اذهب لـ Firebase Console → Firestore → قعّل كتابة القواعد

---

## 📖 القواعد الأساسية في Firestore

لتجنب المشاكل الأمنية، استخدم هذه القواعد:

```javascript
// Firestore Security Rules
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

## 🚀 نشر على Vercel (اختياري)

1. ادفع الكود إلى GitHub
2. اذهب إلى [Vercel.com](https://vercel.com)
3. انقر "Import Project"
4. اختر المستودع
5. أضف متغيرات البيئة (Firebase config - إن لم تكن في الكود)
6. انقر "Deploy"

---

## 📞 الدعم والمساعدة

اذا واجهت مشاكل:
1. تحقق من console في متصفحك (F12)
2. تحقق من Firebase Console للأخطاء
3. تأكد من توفر الإنترنت

---

## 📄 الترخيص

جميع الحقوق محفوظة © 2024 سوق اليمن

---

**صُنع بـ ❤️ لليمن**
