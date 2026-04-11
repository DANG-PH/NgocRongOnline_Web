"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface WithdrawResponse {
  message: string;
  withdrawal?: any;
}

export default function Withdraw() {
  const router = useRouter();
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    bank_name: "",
    bank_number: "",
    bank_owner: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      router.push("/login");
    }
  }, [router]);

  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      setWithdrawError("");
      setWithdrawSuccess("");

      if (!withdrawForm.amount || !withdrawForm.bank_name || !withdrawForm.bank_number || !withdrawForm.bank_owner) {
        setWithdrawError("Vui lòng điền đầy đủ thông tin");
        return;
      }

      if (parseInt(withdrawForm.amount) <= 0) {
        setWithdrawError("Số tiền phải lớn hơn 0");
        return;
      }

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(stored);
      const accessToken = userData.access_token;
      
      const response = await fetch("/api/create-withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: parseInt(withdrawForm.amount),
          bank_name: withdrawForm.bank_name,
          bank_number: withdrawForm.bank_number,
          bank_owner: withdrawForm.bank_owner,
        }),
      });

      const data: WithdrawResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tạo yêu cầu rút tiền");
      }

      setWithdrawSuccess(data.message || "Yêu cầu rút tiền đã được tạo thành công!");

      setWithdrawForm({
        amount: "",
        bank_name: "",
        bank_number: "",
        bank_owner: "",
      });

    } catch (err) {
      setWithdrawError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(typeof amount === "string" ? parseInt(amount) : amount);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-center bg-fixed bg-cover relative" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-6">
          <button 
            onClick={() => router.push('/pay')}
            className="flex items-center text-white bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm w-fit"
          >
            ← Quay lại Ví
          </button>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/10 bg-black/40">
            <h2 className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase tracking-wider text-center w-full">Rút tiền về ngân hàng</h2>
          </div>

          <div className="p-6 sm:p-10">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 font-bold mb-2 uppercase text-sm tracking-wider">
                  Số tiền (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-inner outline-none font-bold text-xl"
                  placeholder="Nhập số tiền muốn rút"
                  min="1000"
                  step="1000"
                />
                {withdrawForm.amount && (
                  <p className="text-md text-red-400 mt-2 font-bold drop-shadow-sm">
                    {formatCurrency(withdrawForm.amount)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["50000", "100000", "200000", "500000", "1000000", "2000000"].map(
                  (value) => (
                    <button
                      key={value}
                      onClick={() => setWithdrawForm({ ...withdrawForm, amount: value })}
                      className={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-md ${withdrawForm.amount === value
                        ? "bg-red-600 text-white border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.6)]"
                        : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                        }`}
                    >
                      {parseInt(value).toLocaleString("vi-VN")}đ
                    </button>
                  )
                )}
              </div>

              <div className="space-y-6 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-gray-300 font-bold mb-2 uppercase text-sm tracking-wider">
                    Tên ngân hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={withdrawForm.bank_name}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_name: e.target.value })}
                    className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-inner outline-none font-medium text-lg placeholder-gray-500"
                    placeholder="VD: Vietinbank, Vietcombank, MB Bank..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-2 uppercase text-sm tracking-wider">
                    Số tài khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={withdrawForm.bank_number}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_number: e.target.value })}
                    className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-inner outline-none font-mono text-lg placeholder-gray-500 tracking-wider"
                    placeholder="Nhập số tài khoản"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-2 uppercase text-sm tracking-wider">
                    Chủ tài khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={withdrawForm.bank_owner}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_owner: e.target.value })}
                    className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-inner outline-none font-medium text-lg uppercase placeholder-gray-500"
                    placeholder="VD: NGUYEN VAN A"
                  />
                </div>
              </div>

              {withdrawError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 shadow-inner">
                  <p className="text-red-300 text-sm font-semibold text-center">{withdrawError}</p>
                </div>
              )}

              {withdrawSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 shadow-inner">
                  <p className="text-green-400 text-sm font-semibold flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {withdrawSuccess}
                  </p>
                </div>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 shadow-inner">
                <p className="text-yellow-200 text-sm font-medium">
                  <strong>⚠️ Lưu ý:</strong> Yêu cầu rút tiền sẽ được xử lý trong vòng 24h. Vui lòng kiểm tra kỹ thông tin ngân hàng trước khi gửi.
                </p>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={withdrawLoading || !withdrawForm.amount || !withdrawForm.bank_name || !withdrawForm.bank_number || !withdrawForm.bank_owner}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-xl transition-all shadow-[0_4px_10px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3 uppercase tracking-wider text-lg mt-6"
              >
                {withdrawLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span>💸</span>
                    Xác nhận rút tiền
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
