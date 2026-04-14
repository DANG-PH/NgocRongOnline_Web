"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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

export default function ShopAccDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<PurchaseResult | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAccountDetail();
    }
  }, [id]);

  const fetchAccountDetail = async () => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        setError('Vui lòng đăng nhập!');
        setLoading(false);
        return;
      }

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
      }

      const foundAccount = accountsList.find((acc: Account) => acc.id.toString() === id);
      if (foundAccount) {
        if (foundAccount.status !== 'ACTIVE') {
           setError('Account này đã được bán hoặc không còn tồn tại.');
        } else {
           setAccount(foundAccount);
        }
      } else {
        setError('Không tìm thấy acc!');
      }

    } catch (error: any) {
      console.error('Error fetching account details:', error);
      setError(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAccount = async () => {
    if (!account) return;

    if (!confirm('Bạn có chắc muốn mua account này?')) {
      return;
    }

    setPurchasing(true);
    setError("");

    try {
      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        alert("Vui lòng đăng nhập");
        return;
      }

      const userData = JSON.parse(stored);
      const response = await fetch('/api/buy-account-sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.access_token}`,
        },
        body: JSON.stringify({ id: account.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể mua account');
      }

      setPurchaseSuccess({
        username: data.username,
        password: data.password,
      });
      setShowPurchaseModal(true);

    } catch (error: any) {
      console.error('Error buying account:', error);
      setError(error.message || 'Có lỗi xảy ra khi mua account');
      alert(error.message || 'Có lỗi xảy ra khi mua account');
    } finally {
      setPurchasing(false);
    }
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setPurchaseSuccess(null);
    router.push('/shopacc'); // Redirect back after closing success modal
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã copy vào clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-b-2 border-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-white font-semibold drop-shadow-md">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
        <div className="text-center bg-white/90 p-8 rounded-xl shadow-xl backdrop-blur-sm">
          <p className="text-red-500 text-xl font-bold mb-4">{error || 'Không tìm thấy thông tin account!'}</p>
          <button 
            onClick={() => router.push('/shopacc')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium cursor-pointer"
          >
            Quay lại trang Shop Acc
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => router.push('/shopacc')}
          className="flex items-center text-white bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm w-fit cursor-pointer"
        >
          <span className="mr-2">←</span> Quay lại
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden relative p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Chi Tiết Account</h2>
        
        <div className="mb-8">
          <img
            src={account.url}
            alt={account.description}
            className="w-full max-h-[500px] object-contain object-center rounded-lg bg-gray-100 shadow-inner min-h-[200px]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23e5e7eb" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="24"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Mô tả</h3>
            <p className="text-gray-900 text-lg break-words leading-relaxed">{account.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
              <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-2">Giá</h3>
              <p className="text-4xl font-black text-blue-600">
                {account.price.toLocaleString('vi-VN')} ₫
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Trạng thái</h3>
              <div>
                <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  {account.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">ID Account</h3>
              <p className="text-gray-900 font-mono text-xl font-medium">#{account.id}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Ngày tạo</h3>
              <p className="text-gray-900 text-lg font-medium">
                {new Date(account.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleBuyAccount}
          disabled={purchasing}
          className={`w-full py-5 rounded-xl font-bold text-xl uppercase tracking-wider transition-all shadow-lg hover:shadow-xl ${purchasing
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-green-600 hover:bg-green-500 text-white transform hover:-translate-y-1'
            }`}
        >
          {purchasing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang xử lý...
            </span>
          ) : (
            'Mua Account Này'
          )}
        </button>
      </div>

      {showPurchaseModal && purchaseSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in border border-gray-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 shadow-inner">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Thành Công!</h2>
              <p className="text-gray-600 font-medium">Thông tin đăng nhập của bạn:</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-4 shadow-inner border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={purchaseSuccess.username}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono font-medium shadow-sm outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(purchaseSuccess.username)}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    title="Copy"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={purchaseSuccess.password}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono font-medium shadow-sm outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(purchaseSuccess.password)}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    title="Copy"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                ⚠️ Vui lòng lưu lại thông tin này. Bạn sẽ không thể xem lại sau khi đóng cửa sổ này!
              </p>
            </div>

            <button
              onClick={closePurchaseModal}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors shadow-lg"
            >
              Đã lưu, Đóng & Quay lại
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
