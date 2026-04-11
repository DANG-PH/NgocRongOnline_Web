"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Account {
  id: number;
  url: string;
  description: string;
  price: number;
  status: string;
  partner_id: number;
  createdAt: string;
}

interface PurchaseResult {
  username: string;
  password: string;
}

function ShopAcc() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLogged, setIsLogged] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        setIsLogged(false);
        setLoading(false);
        return;
      }
      setIsLogged(true);

      const userData = JSON.parse(stored);
      const response = await fetch('/api/all-account-sell', {
        headers: {
          'Authorization': `Bearer ${userData.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách account');
      }

      const data = await response.json();

      let accountsList: Account[] = [];

      if (Array.isArray(data)) {
        accountsList = data;
      } else if (data.accounts && Array.isArray(data.accounts)) {
        accountsList = data.accounts;
      } else if (data.data && Array.isArray(data.data)) {
        accountsList = data.data;
      } else {
        console.error('Unexpected data structure:', data);
        throw new Error('Dữ liệu từ server không đúng định dạng');
      }

      const activeAccounts = accountsList.filter((acc: Account) => acc.status === 'ACTIVE');
      setAccounts(activeAccounts);
    } catch (error: any) {
      console.error('Error fetching accounts:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải danh sách account');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (account: Account) => {
    router.push(`/shopacc/${account.id}`);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-5xl font-black text-center mb-3 text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>Shop Bán Account</h1>
          <p className="text-gray-100 font-semibold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Chọn và mua account phù hợp với bạn</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Account Grid */}
        {!isLogged ? (
          <div className="text-center py-20 bg-black/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Vui lòng đăng nhập!</h2>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-20 bg-black/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
            <div className="text-6xl mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">🛒</div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Không có account nào</h2>
            <p className="text-gray-200 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Hiện tại chưa có account nào để bán</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={account.url}
                    alt={account.description}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23e5e7eb" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2 min-h-[40px]">
                    {account.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Giá</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {account.price.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    ID: #{account.id} • {new Date(account.createdAt).toLocaleDateString('vi-VN')}
                  </p>

                  {/* View Detail Button */}
                  <button
                    onClick={() => handleViewDetail(account)}
                    className="w-full py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ShopAcc;