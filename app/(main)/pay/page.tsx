"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PayData {
  id: number;
  userId: number;
  tien: string;
  status: string;
  updatedAt: string;
}

interface PayResponse {
  pay: PayData;
  message: string;
}

interface QRResponse {
  qr: string;
  username: string;
}

interface WithdrawResponse {
  message: string;
  withdrawal?: any;
}

interface WithdrawItem {
  id: number;
  user_id: number;
  amount: number;
  bank_name: string;
  bank_number: string;
  bank_owner: string;
  status: string;
  request_at: string;
  success_at: string;
}

interface WithdrawHistoryResponse {
  withdraws: WithdrawItem[];
}

export default function Pay() {
  const router = useRouter();
  const [payData, setPayData] = useState<PayData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchPayData();
    fetchWithdrawHistory();
  }, []);

  const fetchPayData = async () => {
    try {
      setLoading(true);
      setError("");

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        setError("Không tìm thấy thông tin đăng nhập");
        router.push("/login");
        return;
      }

      const userData = JSON.parse(stored);
      const accessToken = userData.access_token;
      const authId = userData.auth_id;



      const response = await fetch(`/api/pay?userId=${authId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });



      const responseText = await response.text();
      let data: PayResponse;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {

        throw new Error("Server returned invalid JSON");
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setPayData(data.pay);
      setMessage(data.message);

    } catch (err) {

      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawHistory = async () => {
    try {
      setHistoryLoading(true);

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(stored);
      const accessToken = userData.access_token;
      const authId = userData.auth_id;



      const response = await fetch(`/api/user-withdraw?userId=${authId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: WithdrawHistoryResponse = await response.json();

      if (!response.ok) {
        throw new Error("Lỗi khi tải lịch sử rút tiền");
      }

      console.log("Withdraw history:", data);
      setWithdrawHistory(data.withdraws || []);

    } catch (err) {
      console.error("Withdraw history error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };



  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(typeof amount === "string" ? parseInt(amount) : amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
            Đang xử lý
          </span>
        );
      case "SUCCESS":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
            Thành công
          </span>
        );
      case "ERROR":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
            Thất bại
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center  bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-b-2 border-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );


  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <div className="text-red-500 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchPayData()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mt-4"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
        <div className="text-center text-white bg-black/60 p-6 rounded-xl backdrop-blur-sm">Không tìm thấy thông tin ví</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-center bg-fixed bg-cover relative" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-6">
          <button
            onClick={() => router.push('/user')}
            className="flex items-center text-white bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm w-fit shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-white/10"
          >
            ← Quay lại
          </button>
        </div>
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
              Ví của tôi
            </h1>
          </div>
          
        </div>

        {/* Balance Card */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8 mb-8 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-400"></div>
          <div className="relative z-10">
            <p className="text-gray-300 text-sm uppercase tracking-wider font-semibold mb-2">Số dư hiện tại</p>
            <p className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {formatCurrency(payData.tien)}
            </p>
          </div>
        
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <button
            onClick={() => router.push('/pay/deposit')}
            className="group relative bg-black/50 backdrop-blur-md border border-blue-500/50 hover:bg-black/70 hover:border-blue-400 transition-all py-6 px-6 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-[0_4px_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-all"></div>
            <span className="text-blue-400 font-black text-xl uppercase tracking-wider relative z-10">Nạp tiền</span>
          </button>

          <button
            onClick={() => router.push('/pay/withdraw')}
            className="group relative bg-black/50 backdrop-blur-md border border-red-500/50 hover:bg-black/70 hover:border-red-400 transition-all py-6 px-6 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-[0_4px_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/20 transition-all"></div>
            <span className="text-red-400 font-black text-xl uppercase tracking-wider relative z-10">Rút tiền</span>
          </button>
        </div>

        {/* Withdraw History Table */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-black/40">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
              <span>📋</span>
              Lịch sử rút tiền
            </h2>
          </div>

          {historyLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              <p className="mt-4 text-gray-300 font-medium tracking-wide">Đang tải lịch sử...</p>
            </div>
          ) : withdrawHistory.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-6xl mb-4 opacity-50">📭</div>
              <p className="text-lg font-medium">Chưa có lịch sử rút tiền</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-black/40 border-b border-white/10 text-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Mã GD</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Số tiền</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Ngân hàng</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Tài khoản</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  {withdrawHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className="bg-white/10 px-2 py-1 rounded-md text-gray-300">#{item.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-400 drop-shadow-sm">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {item.bank_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span className="font-mono bg-black/30 border border-white/5 px-2 py-1 rounded inline-block w-fit tracking-wider">{item.bank_number}</span>
                          <span className="text-xs text-gray-400 mt-1 uppercase">{item.bank_owner}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-1">
                          <span className="text-white/60 text-xs">YC: {formatDate(item.request_at)}</span>
                          {item.status === "SUCCESS" && item.success_at && (
                            <span className="text-green-400 text-xs">TC: {formatDate(item.success_at)}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}