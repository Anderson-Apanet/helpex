"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();

  // Login handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Usuário ou senha inválidos");
    } else {
      router.push("/dashboard");
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");
    const { error } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
      options: {
        data: { nome: registerName }
      }
    });
    setRegisterLoading(false);
    if (error) {
      setRegisterError(error.message || "Erro ao criar usuário");
    } else {
      setRegisterSuccess("Usuário criado! Verifique seu e-mail para confirmar o cadastro.");
    }
  };

  // Forgot password handler
  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");
    let redirectTo: string | undefined = undefined;
    if (typeof window !== "undefined") {
      redirectTo = window.location.origin + "/login";
    }
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo
    });
    setForgotLoading(false);
    if (error) {
      setForgotError(error.message || "Erro ao enviar e-mail de recuperação");
    } else {
      setForgotSuccess("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#232526] to-[#2c5364] text-white font-sans p-4">
      <div className="flex flex-col items-center mb-8">
        <Image src="https://dieycvogftvfoncigvtl.supabase.co/storage/v1/object/public/imagens//HELPEX%20BRANCO.png" alt="HELPEX Logo" className="h-16 w-auto mb-4" width={100} height={50} />
      </div>
      <div className="bg-[#181f2a] border border-[#4f6df5] rounded-xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
        {!showRegister && !showForgot && (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-[#232526] text-white border-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-[#232526] text-white border-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
            {error && <div className="text-red-400 bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-red-600 shadow-md animate-fade-in text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#232526] text-white px-6 py-3 rounded-lg font-semibold text-lg border border-[#353b48] shadow-sm transition-all duration-200 hover:bg-[#353b48] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="text-cyan-300 hover:underline text-sm"
                onClick={() => setShowRegister(true)}
              >
                Criar conta
              </button>
              <button
                type="button"
                className="text-cyan-300 hover:underline text-sm"
                onClick={() => setShowForgot(true)}
              >
                Esqueci a senha
              </button>
            </div>
          </form>
        )}
        {showRegister && (
          <form onSubmit={handleRegister}>
            <h2 className="text-2xl font-bold mb-6 text-center neon-blue">Criar Usuário</h2>
            <input
              type="text"
              placeholder="Nome"
              value={registerName}
              onChange={e => setRegisterName(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-[#232526] text-white neon-blue border-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={registerEmail}
              onChange={e => setRegisterEmail(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-[#232526] text-white neon-blue border-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={registerPassword}
              onChange={e => setRegisterPassword(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-[#232526] text-white neon-green border-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
            {registerError && <div className="text-red-400 bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-red-600 shadow-md animate-fade-in text-center">{registerError}</div>}
            {registerSuccess && <div className="text-green-400 bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-green-600 shadow-md animate-fade-in text-center">{registerSuccess}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 shadow-lg neon-green text-black px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 hover:from-orange-400 hover:to-pink-500 hover:text-white border-none"
              disabled={registerLoading}
            >
              {registerLoading ? "Criando..." : "Criar Usuário"}
            </button>
            <button
              type="button"
              className="w-full mt-4 text-cyan-300 hover:underline text-sm"
              onClick={() => setShowRegister(false)}
            >
              Voltar para login
            </button>
          </form>
        )}
        {showForgot && (
          <form onSubmit={handleForgot}>
            <h2 className="text-2xl font-bold mb-6 text-center neon-blue">Recuperar Senha</h2>
            <input
              type="email"
              placeholder="E-mail"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-[#232526] text-white neon-blue border-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
            {forgotError && <div className="text-red-400 bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-red-600 shadow-md animate-fade-in text-center">{forgotError}</div>}
            {forgotSuccess && <div className="text-green-400 bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-green-600 shadow-md animate-fade-in text-center">{forgotSuccess}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 shadow-lg neon-green text-black px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 hover:from-orange-400 hover:to-pink-500 hover:text-white border-none"
              disabled={forgotLoading}
            >
              {forgotLoading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
            <button
              type="button"
              className="w-full mt-4 text-cyan-300 hover:underline text-sm"
              onClick={() => setShowForgot(false)}
            >
              Voltar para login
            </button>
          </form>
        )}
      </div>
      <style jsx global>{`
        .animate-fade-in { animation: fadeIn 0.7s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
