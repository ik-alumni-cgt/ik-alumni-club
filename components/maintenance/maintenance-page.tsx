"use client";

import { useState } from "react";

export function MaintenancePage() {
  const [showPasscodeInput, setShowPasscodeInput] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/preview-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        setError("パスコードが正しくありません");
      }
    } catch {
      setError("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          メンテナンス中です。
        </h1>
        <p className="text-lg text-gray-600">
          公開までしばらくお待ちください。
        </p>
      </div>

      <div className="mt-12">
        {!showPasscodeInput ? (
          <button
            onClick={() => setShowPasscodeInput(true)}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            管理者の方はこちら
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="パスコード"
              maxLength={4}
              className="w-32 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              autoFocus
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || passcode.length === 0}
              className="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "確認中..." : "確認"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
