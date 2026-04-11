"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface Post {
  id: number;
  title: string;
  url_anh: string;
  content: string;
  editor_id: number;
  editor_realname: string;
  status?: string;
  create_at?: string;
  update_at?: string;
}

function Sukien() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        setIsLogged(false);
        setLoading(false);
        return;
      }
      setIsLogged(true);

      const userData = JSON.parse(stored);
      const response = await fetch('/api/all-posts', {
        headers: {
          'Authorization': `Bearer ${userData.access_token}`,
        },
      });

      const data = await response.json();
      console.log('Data from API:', data);

      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
        console.log('Posts set successfully:', data.posts);
      } else {
        console.log('No posts array found');
        setPosts([]);
      }

    } catch (error) {
      console.error('Error:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-b-2 border-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 pt-4">
        <h1 className="text-5xl font-black text-center mb-3 text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>Sự Kiện</h1>
        <p className="text-center text-gray-100 font-semibold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Cập nhật những sự kiện mới nhất</p>
      </div>

      {/* Debug Info */}
      {isLogged && (
        <div className="max-w-7xl mx-auto mb-4">
          <p className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Số sự kiện: {posts?.length || 0}</p>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isLogged ? (
          <div className="col-span-full text-center py-20 bg-black/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Vui lòng đăng nhập!</h2>
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full"
              onClick={() => router.push(`/sukien/${post.id}`)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.url_anh || '/placeholder.jpg'}
                  alt={post.title}
                  className="w-full h-80 object-cover object-top rounded-lg mb-6"
                />
                {post.status && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    {post.status}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-[60px]">{post.content}</p>

                {/* Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span>✍️</span>
                    <span>{post.editor_realname}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📅</span>
                    <span>{post.create_at ? new Date(post.create_at).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </span>
                </div>

                {/* Button */}
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-300">
                  Xem chi tiết →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-black/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
            <p className="text-white text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">📭 Chưa có sự kiện nào</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Sukien;