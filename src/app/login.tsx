import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Usuário ou senha inválidos");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181f2a]">
      <form
        onSubmit={handleLogin}
        className="bg-[#181f2a] border border-[#42b883] p-8 rounded-xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-extrabold tracking-wide text-[#42b883] mb-6 text-center">Login HELPEX</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border-none bg-[#232526] text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border-none bg-[#232526] text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          required
        />
        {error && <div className="text-[#f58a42] bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-[#f58a42] shadow-md animate-fade-in text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-[#1e2d24] text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-[#16351c] transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
