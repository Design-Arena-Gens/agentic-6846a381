"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CONFIG = {
  uiTitle: "Album Automation Panel",
};

type LogEntry = {
  id: string;
  message: string;
  timestamp: string;
};

const generateId = () => {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && "randomUUID" in cryptoApi) {
    return cryptoApi.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const createLogEntry = (message: string): LogEntry => ({
  id: generateId(),
  message,
  timestamp: new Date().toLocaleTimeString(),
});

function useLogger() {
  const [entries, setEntries] = useState<LogEntry[]>(() => [
    createLogEntry("UI panel is now visible."),
  ]);

  const log = useCallback((message: string) => {
    setEntries((prev) => [...prev, createLogEntry(message)]);
  }, []);

  const combined = useMemo(
    () =>
      entries
        .map((entry) => `[${entry.timestamp}] ${entry.message}`)
        .join("\n"),
    [entries],
  );

  return { log, text: combined, entries };
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const { log, text, entries } = useLogger();
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (!bootstrappedRef.current) {
      log("✅ Album Automation UI loaded.");
      bootstrappedRef.current = true;
    }
  }, [log]);

  const handleStart = () => {
    log("Start button clicked. ScriptUI is working.");
    window.alert("Start button clicked. ScriptUI is working.");
  };

  const handleClose = () => {
    log("UI panel closed by user.");
    setIsOpen(false);
  };

  const handleReopen = () => {
    setIsOpen(true);
    log("UI panel reopened.");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-6 font-sans text-slate-900">
      <main className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-lg">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">{CONFIG.uiTitle}</h1>
            <p className="text-sm text-slate-500">
              ScriptUI-inspired control panel for browser automation.
            </p>
          </div>
          <span className="text-sm font-medium text-emerald-600">
            ✅ ScriptUI Loaded!
          </span>
        </header>

        {isOpen ? (
          <section className="flex flex-col gap-6 px-6 py-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleStart}
                className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                type="button"
              >
                Start Processing
              </button>
              <button
                onClick={handleClose}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                type="button"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Log
                </h2>
                <span className="text-xs text-slate-400">
                  {entries.length} entr{entries.length === 1 ? "y" : "ies"}
                </span>
              </div>
              <textarea
                value={text}
                readOnly
                className="h-56 w-full resize-none rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-mono text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </section>
        ) : (
          <section className="px-6 py-10 text-center">
            <p className="mb-4 text-sm text-slate-600">
              The panel is closed. Reopen it to continue logging activity.
            </p>
            <button
              onClick={handleReopen}
              className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              type="button"
            >
              Reopen Panel
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
