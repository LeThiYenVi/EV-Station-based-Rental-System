# 🚨 BACKEND FIX REQUIRED - 401 Unauthorized on /auth/register

## Vấn đề hiện tại

Frontend đang gọi `POST /api/auth/register` **KHÔNG CÓ** Authorization header (đúng thiết kế).

Nhưng Backend đang trả về **401 Unauthorized**, có nghĩa là endpoint này đang yêu cầu authentication.

## ❌ Sai lầm trong Backend

Endpoint đăng ký tài khoản (`/auth/register`) **KHÔNG NÊN** yêu cầu authentication vì:

- User chưa có tài khoản → không có token
- Đây là endpoint public
- Chỉ cần validate dữ liệu input

## ✅ Cách fix trong Spring Boot

### 1. Kiểm tra SecurityConfig.java

Tìm file `SecurityConfig.java` hoặc `WebSecurityConfig.java`:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .authorizeHttpRequests(auth -> auth
                // ⭐ QUAN TRỌNG: Cho phép public access cho auth endpoints
                .requestMatchers(
                    "/api/auth/register",      // ✅ Phải public
                    "/api/auth/verify-otp",    // ✅ Phải public
                    "/api/auth/login",         // ✅ Phải public
                    "/api/auth/forgot-password", // ✅ Phải public
                    "/api/auth/reset-password",  // ✅ Phải public
                    "/api/auth/callback",      // ✅ Phải public (Google OAuth)
                    "/api/auth/url"            // ✅ Phải public (Google OAuth)
                ).permitAll()

                // Các endpoint khác cần authentication
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

### 2. Kiểm tra AuthController.java

Đảm bảo controller mapping đúng:

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // ✅ Endpoint này KHÔNG cần @PreAuthorize
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Validate request
            // Create user
            // Send OTP email
            return ResponseEntity.ok(new ApiResponse(200, "OTP sent to email", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse(400, e.getMessage(), null)
            );
        }
    }

    // ✅ Endpoint này KHÔNG cần @PreAuthorize
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        // Verify OTP
        // Return tokens
    }

    // ✅ Endpoint này KHÔNG cần @PreAuthorize
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Authenticate
        // Return tokens
    }
}
```

### 3. Nếu dùng JWT Filter

Đảm bảo JWT Filter bỏ qua public endpoints:

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ⭐ Skip JWT validation for public endpoints
        if (path.startsWith("/api/auth/register") ||
            path.startsWith("/api/auth/verify-otp") ||
            path.startsWith("/api/auth/login") ||
            path.startsWith("/api/auth/forgot-password") ||
            path.startsWith("/api/auth/reset-password") ||
            path.startsWith("/api/auth/callback") ||
            path.startsWith("/api/auth/url")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Normal JWT validation for other endpoints
        String token = extractToken(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // Set authentication
        }

        filterChain.doFilter(request, response);
    }
}
```

## 🧪 Test Backend

### Dùng curl:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "fullName": "Test User",
    "phone": "0912345678",
    "role": "RENTER"
  }'
```

**Expected Response:**

```json
{
  "statusCode": 200,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "message": "OTP sent to email"
  }
}
```

**KHÔNG ĐƯỢC trả về 401 Unauthorized!**

### Dùng Postman:

1. Method: `POST`
2. URL: `http://localhost:8080/api/auth/register`
3. Headers:
   ```
   Content-Type: application/json
   ```
   **KHÔNG CÓ Authorization header**
4. Body (raw JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "Test123456",
     "fullName": "Test User",
     "phone": "0912345678",
     "role": "RENTER"
   }
   ```
5. Send → Phải nhận 200 OK, KHÔNG PHẢI 401

## 🔍 Debug Backend

Nếu vẫn lỗi 401, kiểm tra:

1. **Console logs** khi start Spring Boot:

   ```
   Mapping POST /api/auth/register
   ```

2. **Application logs** khi call API - tìm:

   ```
   SecurityFilterChain executing
   JwtAuthenticationFilter executing
   ```

3. **Breakpoint** trong:
   - `SecurityConfig.filterChain()`
   - `JwtAuthenticationFilter.doFilterInternal()`
   - `AuthController.register()`

## 📝 Checklist

- [ ] SecurityConfig có `.requestMatchers("/api/auth/register").permitAll()`
- [ ] AuthController không có `@PreAuthorize` trên register method
- [ ] JwtAuthenticationFilter skip validation cho /api/auth/register
- [ ] CORS configuration cho phép request từ localhost:5173
- [ ] Test với curl → nhận 200 OK
- [ ] Test với Postman (no auth) → nhận 200 OK
- [ ] Test từ Frontend → nhận 200 OK

## 📞 Contact

Sau khi fix xong backend, ping Frontend team để test lại!

**Frontend Lead:** [Your Name]
**Backend Issue:** `/api/auth/register` returns 401 instead of processing registration
