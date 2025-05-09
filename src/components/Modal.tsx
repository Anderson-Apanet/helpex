"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
      <div className="bg-[#232526] border border-[#4f6df5] rounded-xl shadow-2xl max-w-md w-full relative p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
          aria-label="Fechar"
        >
          ×
        </button>
        {children}
      </div>
      <style jsx global>{`
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
