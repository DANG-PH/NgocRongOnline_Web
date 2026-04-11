"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post } from '../page';

export default function SukienDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  const fetchPostDetail = async () => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        setError('Vui lòng đăng nhập!');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(stored);
      const response = await fetch('/api/all-posts', {
        headers: {
          'Authorization': `Bearer ${userData.access_token}`,
        },
      });

      const data = await response.json();
      
      if (data.posts && Array.isArray(data.posts)) {
        const foundPost = data.posts.find((p: Post) => p.id.toString() === id);
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Không tìm thấy sự kiện!');
        }
      } else {
        setError('Không thể tải dữ liệu!');
      }

    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
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

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
        <div className="text-center bg-white/90 p-8 rounded-xl shadow-xl backdrop-blur-sm">
          <p className="text-red-500 text-xl font-bold mb-4">{error || 'Không tìm thấy thông tin sự kiện!'}</p>
          <button 
            onClick={() => router.push('/sukien')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium cursor-pointer"
          >
            Quay lại trang Sự kiện
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
      {/* Nút quay lại */}
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => router.push('/sukien')}
          className="flex items-center text-white bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm w-fit cursor-pointer"
        >
          <span className="mr-2">←</span> Quay lại
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header Hình Ảnh */}
        <div className="relative h-[400px]">
          <img
            src={post.url_anh || '/placeholder.jpg'}
            alt={post.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
            {post.status && (
              <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold w-fit mb-4 shadow-lg">
                {post.status}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-xl">{post.title}</h1>
            
            <div className="flex items-center gap-6 mt-4 text-gray-200">
              <span className="flex items-center gap-2">
                <span className="text-xl">✍️</span>
                <span className="font-medium text-lg">{post.editor_realname}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <span className="text-lg">
                  {post.create_at ? new Date(post.create_at).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Nôị Dung */}
        <div className="p-8 md:p-12">
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-loose text-lg whitespace-pre-wrap font-medium">
              {post.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
