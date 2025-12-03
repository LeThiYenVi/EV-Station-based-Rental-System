import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Result
        status="403"
        title="401"
        subTitle="Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập."
        extra={
          <Button type="primary" onClick={() => navigate("/login")}>
            Đi tới đăng nhập
          </Button>
        }
      />
    </div>
  );
}
