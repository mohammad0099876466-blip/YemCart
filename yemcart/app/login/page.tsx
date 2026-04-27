"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, getAuthErrorMessage } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("البريد الإلكتروني وكلمة المرور مطلوبة");
        setLoading(false);
        return;
      }

      await loginUser(email, password);
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">دخول</h1>
        <p className="text-center text-gray-600 mb-8">تسجيل الدخول إلى حسابك</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="example@email.com"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            تسجيل جديد
          </Link>
        </p>

        {/* Home Link */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
