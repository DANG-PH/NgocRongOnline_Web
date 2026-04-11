"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Account {
  username: string;
  password: string;
}

interface ApiResponse {
  accounts: Account[];
}

function AccHistory() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        alert('Vui lòng đăng nhập!');
        setLoading(false);
        return;
      }

      const user = JSON.parse(stored);
      const accessToken = user.access_token;

      if (!accessToken) {
        alert('Token không hợp lệ!');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/all-account-buyer', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-no-repeat bg-center bg-fixed bg-cover relative" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-2xl p-8 max-w-md relative z-10 shadow-2xl text-center">
          <h3 className="text-red-400 font-bold text-2xl mb-3 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">Lỗi</h3>
          <p className="text-red-200 mb-6 font-medium">{error}</p>
          <button
            onClick={fetchAccounts}
            className="w-full bg-red-600/80 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-[0_4px_10px_rgba(220,38,38,0.3)] cursor-pointer"
          >
            Thử Lại
          </button>
        </div>
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
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
              Lịch sử tài khoản đã mua
            </h1>
            <p className="text-gray-200 mt-2 text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium">
              Tổng số tài khoản: <span className="font-bold text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] text-xl">{accounts.length}</span>
            </p>
          </div>
          <button
            onClick={fetchAccounts}
            className="bg-blue-600/80 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2 uppercase tracking-wide cursor-pointer"
          >
            <span>🔄</span> Làm mới
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-16 text-center shadow-2xl">
            <div className="text-6xl mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">📦</div>
            <p className="text-gray-200 text-xl font-medium drop-shadow-md">Chưa có tài khoản nào</p>
          </div>
        ) : (
          <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-black/40 border-b border-white/10 text-gray-300">
                  <tr>
                    <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider">
                      Tên đăng nhập
                    </th>
                    <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider">
                      Mật khẩu
                    </th>
                    <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-gray-200">
                  {accounts.map((account, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className="bg-white/10 px-3 py-1 rounded-full shadow-inner">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-white drop-shadow-md">
                          {account.username}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-black/50 border border-white/5 px-3 py-1.5 rounded-lg text-gray-300 font-mono tracking-wider shadow-inner">
                            {account.password}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Username: ${account.username}\nPassword: ${account.password}`
                            );
                            alert('Đã sao chép!');
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
                        >
                          📋 Sao chép
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccHistory;