# ⚠️ S3 CORS & Access Issue

## Vấn đề hiện tại:

Avatar images từ S3 bucket không thể load được do lỗi **Access Denied**.

```
Error: AccessDenied
Code: AccessDenied
Message: Access Denied
RequestId: ECT716Z80HXS0DPK
HostId: gpzfzxjGu4hEXbUukPyKZiz/CD1JGSgeuJibQyCRj188cuVcS2R/01mUn65fZf+PUEGzFNfycQJrhCn+RR/30Ns+pQ0NsvK
```

**URL bị lỗi:**

```
https://s3-upload-files-sys.s3.amazonaws.com/assets/avatars/77910f5f-076d-44cd-ad1f-0afcf40394e9.png
```

---

## 🔧 Giải pháp cho Backend Team:

### **Option 1: Cấu hình S3 Bucket Policy (Public Read)**

Thêm policy này vào S3 bucket `s3-upload-files-sys`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::s3-upload-files-sys/assets/*"
    }
  ]
}
```

### **Option 2: Pre-signed URLs (Khuyến nghị - Bảo mật hơn)**

Thay vì trả về URL trực tiếp, generate pre-signed URL có thời gian hết hạn:

```java
// Java example
AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(
    "s3-upload-files-sys",
    "assets/avatars/77910f5f-076d-44cd-ad1f-0afcf40394e9.png"
);
request.setExpiration(new Date(System.currentTimeMillis() + 3600000)); // 1 hour
URL presignedUrl = s3Client.generatePresignedUrl(request);
```

### **Option 3: Cấu hình CORS cho S3 Bucket**

Vào AWS S3 Console → Bucket → Permissions → CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### **Option 4: CloudFront Distribution**

Tạo CloudFront distribution cho S3 bucket và dùng CloudFront URL thay vì S3 URL trực tiếp.

---

## 🎯 Action Items:

- [ ] Backend: Chọn 1 trong 4 options trên và implement
- [ ] Backend: Test URL có thể access được từ browser
- [ ] Backend: Update API response với URL mới (nếu dùng CloudFront)
- [ ] Frontend: Remove fallback placeholder khi S3 đã fix

---

## 📝 Frontend Workaround (Tạm thời):

Đã thêm fallback image khi S3 load fail:

```tsx
<AvatarImage
  src={userData.avatar}
  onError={(e) => {
    // Fallback to ui-avatars.com
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=16a34a&color=fff&size=200`;
  }}
/>
```

Khi S3 đã fix, avatar sẽ tự động hiển thị từ S3. Nếu lỗi, sẽ hiển thị placeholder với chữ cái đầu tên.

---

## 🔗 References:

- [AWS S3 Bucket Policy Examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html)
- [AWS S3 Pre-signed URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- [AWS S3 CORS Configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
