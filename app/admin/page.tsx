"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-surface rounded-card shadow-sm p-6"
      >
        <h1 className="font-heading text-xl text-ink mb-6 text-center">
          Admin Login
        </h1>

        <label className="block font-body text-sm text-ink mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 mb-4 font-body"
        />

        <label className="block font-body text-sm text-ink mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 mb-4 font-body"
        />

        {error && (
          <p className="font-body text-sm text-red-600 mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white font-body font-medium min-h-[44px] rounded-card disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
