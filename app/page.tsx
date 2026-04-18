"use client";
import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Download, ShieldCheck } from "lucide-react";

export default function SwillPassGen() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(12);
    const [options, setOptions] = useState({
        upper: true, lower: true, nums: true, symbols: true, noRepeat: false
    });

    const generate = () => {
        const sets = {
            upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lower: "abcdefghijklmnopqrstuvwxyz",
            nums: "0123456789",
            symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
        };
        let pool = "";
        if (options.upper) pool += sets.upper;
        if (options.lower) pool += sets.lower;
        if (options.nums) pool += sets.nums;
        if (options.symbols) pool += sets.symbols;
        if (!pool) return setPassword("Выберите параметры!");

        let res = "";
        const used = new Set();
        while (res.length < length) {
            const char = pool[Math.floor(Math.random() * pool.length)];
            if (options.noRepeat && used.has(char)) continue;
            res += char;
            used.add(char);
            if (options.noRepeat && used.size >= pool.length) break;
        }
        setPassword(res);
    };

    useEffect(generate, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-[#0f0f0f] border border-yellow-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(234,179,8,0.1)]">
                <h1 className="text-2xl font-black italic text-yellow-500 mb-2 tracking-tighter uppercase">SWILL GENERATOR</h1>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] mb-8">SECURE ENCRYPTION NODE</p>

                <div className="bg-black/50 border border-white/5 rounded-2xl p-6 mb-6 flex items-center justify-between group">
                    <span className="text-xl font-mono break-all">{password}</span>
                    <button onClick={() => navigator.clipboard.writeText(password)} className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors">
                        <Copy size={20} className="text-yellow-500" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-4 text-gray-400">ДЛИНА: <span className="text-yellow-500">{length}</span></div>
                        <input type="range" min="4" max="20" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none accent-yellow-500 cursor-pointer" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(options).map(([key, val]) => (
                            <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" checked={val} onChange={() => setOptions({...options, [key]: !val})} className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-yellow-500 focus:ring-0" />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300 uppercase">{key}</span>
                            </label>
                        ))}
                    </div>

                    <button onClick={generate} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center space-x-2">
                        <RefreshCw size={18} /> <span>СГЕНЕРИРОВАТЬ</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

