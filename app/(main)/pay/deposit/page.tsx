"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface QRResponse {
  qr: string;
  username: string;
}

export default function Deposit() {
  const router = useRouter();
  const [amount, setAmount] = useState("50000");
  const [username, setUsername] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [qrError, setQrError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const userData = JSON.parse(stored);
      setUsername(userData.username || "");
    } else {
      router.push("/login");
    }
  }, [router]);

  const generateQR = async () => {
    try {
      setQrLoading(true);
      setQrError("");
      setQrData(null);

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(stored);
      const accessToken = userData.access_token;
      const authId = userData.auth_id;

      const response = await fetch(
        `/api/qr?userId=${authId}&amount=${amount}&username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi tạo mã QR");
      }

      setQrData(data);
    } catch (err) {
      setQrError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setQrLoading(false);
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
            <h2 className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase tracking-wider text-center w-full">Nạp tiền qua QR</h2>
          </div>

          <div className="p-6 sm:p-10">
            {!qrData ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-bold mb-2 uppercase text-sm tracking-wider">
                    Tên tài khoản
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner outline-none font-medium text-lg"
                    placeholder="Nhập tên tài khoản"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-2 uppercase text-sm tracking-wider">
                    Số tiền (VND)
                  </label>

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner outline-none font-bold text-xl"
                    placeholder="Nhập số tiền"
                    min="1000"
                    step="1000"
                  />
                  <p className="text-md text-blue-400 mt-2 font-bold drop-shadow-sm">
                    {formatCurrency(amount)}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["10000", "50000", "100000", "200000", "500000", "1000000"].map(
                    (value) => (
                      <button
                        key={value}
                        onClick={() => setAmount(value)}
                        className={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-md ${amount === value
                          ? "bg-blue-600 text-white border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                          : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                          }`}
                      >
                        {parseInt(value).toLocaleString("vi-VN")}đ
                      </button>
                    )
                  )}
                </div>

                {qrError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 shadow-inner">
                    <p className="text-red-300 text-sm font-semibold text-center">{qrError}</p>
                  </div>
                )}

                <button
                  onClick={generateQR}
                  disabled={qrLoading || !username || !amount}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-xl transition-all shadow-[0_4px_10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 uppercase tracking-wider text-lg mt-8"
                >
                  {qrLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      Tạo mã QR
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-black text-green-400 flex items-center justify-center gap-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Mã QR đã tạo thành công!
                </h3>

                <div className="bg-white p-6 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] inline-block mx-auto border-4 border-blue-500/30">
                  <img
                    src={qrData.qr}
                    alt="QR Code"
                    className="w-full max-w-sm mx-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      setQrError('Không thể tải mã QR');
                    }}
                  />
                </div>

                <div className="p-6 bg-blue-900/30 border border-blue-500/30 rounded-2xl max-w-sm mx-auto shadow-inner">
                  <p className="text-gray-300 text-sm uppercase tracking-wider font-semibold">Thông tin thanh toán</p>
                  <p className="text-white font-bold mt-2 text-lg">
                    Tài khoản: <span className="text-blue-400">{qrData.username}</span>
                  </p>
                  <p className="text-4xl font-black text-blue-400 mt-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">
                    {formatCurrency(amount)}
                  </p>
                </div>

                <div className="flex gap-4 max-w-sm mx-auto">
                  <button
                    onClick={() => setQrData(null)}
                    className="flex-1 text-white hover:text-white bg-white/10 hover:bg-white/20 font-bold px-4 py-3 rounded-xl transition-colors border border-white/20 uppercase tracking-wide text-sm"
                  >
                    Tạo mã mới
                  </button>
                  <a
                    href={qrData.qr}
                    download="qr-payment.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] text-center uppercase tracking-wide text-sm flex items-center justify-center gap-2"
                  >
                     Tải xuống
                  </a>
                </div>

                <p className="text-sm text-gray-400 font-medium pt-4">
                  Quét mã QR bằng ứng dụng ngân hàng để nạp tiền. Giao dịch sẽ tự động được cập nhật.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
