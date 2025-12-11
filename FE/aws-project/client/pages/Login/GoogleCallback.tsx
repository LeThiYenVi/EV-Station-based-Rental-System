import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const processedRef = useRef(false); // Để tránh gọi API 2 lần (React 18 Strict Mode)

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const savedState = sessionStorage.getItem("oauth_state");

    if (processedRef.current) return;
    processedRef.current = true;

    if (!code) {
      console.error("No code found");
      navigate('/login');
      return;
    }

    // Validate State (Optional nhưng recommended)
    if (state !== savedState) {
       console.error("Invalid state");
       navigate('/login');
       return; 
    }

    // Gọi API Backend để trao đổi Code lấy Token
    const exchangeCode = async () => {
      try {
        // Gọi đến endpoint mới mà ta vừa sửa ở Bước 2
        const response = await fetch('http://localhost:8080/api/auth/login/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        
        if (response.ok) {
           // Lưu token vào store/context/localstorage
           console.log("Login Success", data);
           navigate('/'); // Chuyển hướng về trang chủ
        } else {
           console.error("Login failed", data);
           navigate('/login');
        }
      } catch (error) {
        console.error("Error exchanging token", error);
        navigate('/login');
      }
    };

    exchangeCode();
  }, [searchParams, navigate]);

  return <div>Đang xử lý đăng nhập Google...</div>;
};