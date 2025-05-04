"use client";

import DashboardHeader from "../page";

// Função placeholder para evitar erro de build
function exportarRelatorio() {
  alert('Funcionalidade de exportação em breve!');
}

export default function Relatorios() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-6 text-[#3b82f6]">Relatórios</h1>
      </div>
      <div className="bg-[#232526] rounded-xl p-6 shadow-lg border border-[#3b82f6]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-[#3b82f6]">Exportar dados</span>
          <button
            className="bg-[#3b82f6] text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-[#60a5fa] transition"
            onClick={() => exportarRelatorio()}
          >
            Exportar
          </button>
        </div>
        <p>Em breve você poderá visualizar relatórios de clientes, serviços e credenciais aqui.</p>
      </div>
    </div>
  );
}
