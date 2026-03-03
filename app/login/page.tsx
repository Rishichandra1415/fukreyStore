"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();

    // Use @supabase/ssr browser client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [mode, setMode] = useState<"signin" | "signup">("signin");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === "signin") {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                router.push("/profile");
                router.refresh();
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/profile`,
                    },
                });
                if (error) throw error;
                setMessage({
                    type: "success",
                    text: "Registration successful! Please check your email for a verification link."
                });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Abstract Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-5 dark:opacity-10">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-zinc-400 rounded-full blur-[150px]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-red-600 rounded-full blur-[150px]" />
            </div>

            <div className="w-full max-w-md space-y-10">
                {/* Brand Identity */}
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-block transition-transform hover:scale-105">
                        <h1 className="text-5xl font-black tracking-tighter text-black dark:text-white uppercase italic">
                            FUKREY<span className="text-red-600 animate-pulse">.</span>
                        </h1>
                    </Link>
                    <div className="space-y-1">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">
                            {mode === "signin" ? "Established 2024" : "Join the Movement"}
                        </h2>
                        <p className="text-3xl font-black tracking-tight text-black dark:text-white uppercase">
                            {mode === "signin" ? "Member Login" : "New Account"}
                        </p>
                    </div>
                </div>

                {/* Auth Interface */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/5 dark:shadow-white/2 space-y-8">

                    <form onSubmit={handleAuth} className="space-y-6">
                        {message && (
                            <div className={`p-5 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === "success"
                                    ? "bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400"
                                    : "bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"
                                }`}>
                                {message.type === "success" ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <Mail className="shrink-0 mt-0.5" size={18} />}
                                <p className="text-xs font-bold leading-relaxed">{message.text}</p>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email Access</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                                    <input
                                        required
                                        type="email"
                                        placeholder="user@fukreystore.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-950 focus:border-red-600/20 dark:focus:border-red-600/30 rounded-2xl outline-none transition-all text-sm font-bold placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Key</label>
                                    {mode === "signin" && (
                                        <button type="button" className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-black dark:hover:text-white transition-colors">Forgot?</button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-950 focus:border-red-600/20 dark:focus:border-red-600/30 rounded-2xl outline-none transition-all text-sm font-bold placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] rounded-3xl mt-4 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-black/10 dark:shadow-white/5 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                <>
                                    {mode === "signin" ? "Authenticate" : "Create Account"}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-zinc-400">
                            <span className="bg-white dark:bg-[#121212] px-4 italic">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                        className="w-full py-4 border-2 border-zinc-100 dark:border-zinc-800 text-black dark:text-white font-black uppercase tracking-widest rounded-3xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                    >
                        {mode === "signin" ? "Jump into Registration" : "Sign In to Existing Account"}
                    </button>
                </div>

                {/* Trust Badge */}
                <div className="text-center pt-6 opacity-30">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        Encrypted Session • Fukrey Secure Auth API
                    </p>
                </div>
            </div>
        </div>
    );
}
