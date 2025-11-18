package com.project.evrental.service.auth;

import com.nimbusds.jwt.JWTClaimsSet;
import com.project.evrental.config.CognitoConfig;
import com.project.evrental.domain.AuthResponse;
import com.project.evrental.domain.common.UserRole;
import com.project.evrental.domain.dto.request.*;
import com.project.evrental.domain.dto.response.CognitoTokenResponse;
import com.project.evrental.domain.dto.response.OauthState;
import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.domain.entity.User;
import com.project.evrental.exception.custom.AuthException;
import com.project.evrental.mapper.UserMapper;
import com.project.evrental.service.UserService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CognitoService {

    UserService userService;

    CognitoIdentityProviderClient cognitoIdentityProviderClient;

    CognitoConfig cognitoConfig;

    RestTemplate restTemplate;

    JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        try {
            if(userService.checkUserExistByEmail(request.getEmail())) {
                throw new AuthException("Email already exist!");
            }

            if(!request.getPassword().equalsIgnoreCase(request.getConfirmPassword())) {
                throw new AuthException("Raw and confirm password not match!");
            }

            Map<String, String> requestAttributes = new HashMap<>();
            requestAttributes.put("custom:full_name", request.getFullName());
            requestAttributes.put("custom:phone", request.getPhone());

            List<AttributeType> cognitoAttributes =requestAttributes.entrySet().stream()
                    .map(entry -> AttributeType.builder()
                            .name(entry.getKey())
                            .value(entry.getValue())
                            .build())
                    .toList();

            SignUpRequest signUpRequest = SignUpRequest.builder()
                    .clientId(cognitoConfig.getClientId())
                    .username(request.getEmail())
                    .password(request.getPassword())
                    .userAttributes(cognitoAttributes)
                    .secretHash(calculateSecretHash(request.getEmail()))
                    .build();

            SignUpResponse signUpResponse = cognitoIdentityProviderClient.signUp(signUpRequest);

            log.info("User registered successfully: {}", request.getEmail());
            User newUser = User.builder()
                    .cognitoSub(signUpResponse.userSub())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .role(UserRole.valueOf(request.getRole()))
                    .fullName(request.getFullName())
                    .avatarUrl(randomPlaceholderAvatar())
                    .isLicenseVerified(false)
                    .build();

            UserResponse savedUser = userService.createUser(newUser);

            String groupName = newUser.getRole().toString();
            AdminAddUserToGroupRequest adminAddUserToGroupRequest = AdminAddUserToGroupRequest.builder()
                    .userPoolId(cognitoConfig.getUserPoolId())
                    .groupName(groupName)
                    .username(signUpResponse.userSub())
                    .build();
            cognitoIdentityProviderClient.adminAddUserToGroup(adminAddUserToGroupRequest);
            return AuthResponse.builder().user(savedUser).tokenType("Bearer").build();
        } catch (CognitoIdentityProviderException exception) {
            log.error("Cognito registration error: {}", exception.awsErrorDetails().errorMessage());
            throw new AuthException(exception.getMessage());
        } catch (Exception e) {
            log.error("Registration error", e);
            throw new AuthException("Registration failed: " + e.getMessage());
        }
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            Map<String, String> authParams = new HashMap<>();
            authParams.put("USERNAME", request.getEmail());
            authParams.put("PASSWORD", request.getPassword());
            authParams.put("SECRET_HASH", calculateSecretHash(request.getEmail()));

            InitiateAuthRequest initiateAuthRequest = InitiateAuthRequest.builder()
                    .clientId(cognitoConfig.getClientId())
                    .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
                    .authParameters(authParams).build();

            InitiateAuthResponse initiateAuthResponse = cognitoIdentityProviderClient.initiateAuth(initiateAuthRequest);
            AuthenticationResultType authentication = initiateAuthResponse.authenticationResult();

            var loadedUser = userService.getUserByEmail(request.getEmail());
            log.info("User logged in successfully: {}", request.getEmail());

            return AuthResponse.builder()
                    .user(loadedUser)
                    .accessToken(authentication.accessToken())
                    .expiresIn(authentication.expiresIn())
                    .tokenType("Bearer")
                    .idToken(authentication.idToken())
                    .refreshToken(authentication.refreshToken())
                    .build();
        } catch (NotAuthorizedException e) {
            log.error("Authentication failed for user: {}", request.getEmail());
            throw new AuthException("Invalid email or password");
        } catch (UserNotFoundException e) {
            log.error("User not found: {}", request.getEmail());
            throw new AuthException("User not found");
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognito login error: {}", e.awsErrorDetails().errorMessage());
            throw new AuthException("Login failed: " + e.awsErrorDetails().errorMessage());
        }
    }

    @Transactional
    public AuthResponse loginWithGoogle(String code) {
        try {
            CognitoTokenResponse tokenResponse = exchangeCodeForToken(code);
            JWTClaimsSet claims = jwtService.validateIdToken(tokenResponse.getIdToken());

            String cognitoSub = jwtService.getSubFromClaims(claims);
            String fullName = jwtService.getNameFromClaims(claims);
            String picture = jwtService.getPictureFromClaims(claims);
            String email = jwtService.getEmailFromClaims(claims);

            log.info("Authenticated user: {} ({})", email, cognitoSub);
            User user = userService.getByCognitoSub(cognitoSub);
            if(user == null) {
                user = User.builder()
                        .email(email)
                        .cognitoSub(cognitoSub)
                        .avatarUrl(picture)
                        .fullName(fullName)
                        .role(UserRole.RENTER)
                        .isLicenseVerified(false)
                        .build();
            } else {
                user.setAvatarUrl(picture);
                user.setFullName(fullName);
                user.setEmail(email);
            }
            var loadedUser = userService.createUser(user);

            String groupName = user.getRole().toString();
            AdminAddUserToGroupRequest adminAddUserToGroupRequest = AdminAddUserToGroupRequest.builder()
                    .userPoolId(cognitoConfig.getUserPoolId())
                    .groupName(groupName)
                    .username(user.getCognitoSub())
                    .build();
            cognitoIdentityProviderClient.adminAddUserToGroup(adminAddUserToGroupRequest);
            return AuthResponse.builder()
                    .idToken(tokenResponse.getIdToken())
                    .accessToken(tokenResponse.getAccessToken())
                    .refreshToken(tokenResponse.getRefreshToken())
                    .tokenType(tokenResponse.getTokenType())
                    .expiresIn(tokenResponse.getExpiresIn())
                    .user(loadedUser)
                    .build();
        } catch (UserNotFoundException e) {
            throw new AuthException("User not found");
        } catch (CognitoIdentityProviderException e) {
            throw new AuthException("Login failed: " + e.awsErrorDetails().errorMessage());
        }
    }

    public void forgotPassword(ForgotUserPasswordRequest request) {
        try {
            ForgotPasswordRequest forgotPasswordRequest = ForgotPasswordRequest.builder()
                    .clientId(cognitoConfig.getClientId())
                    .secretHash(calculateSecretHash(request.getEmail()))
                    .username(request.getEmail())
                    .build();

            cognitoIdentityProviderClient.forgotPassword(forgotPasswordRequest);
            log.info("Password reset code sent to: {}", request.getEmail());
        } catch (UserNotFoundException e) {
            log.error("User not found for password reset: {}", request.getEmail());
            throw new AuthException("User not found");
        } catch (CognitoIdentityProviderException e) {
            log.error("Forgot password error: {}", e.awsErrorDetails().errorMessage());
            throw new AuthException("Failed to send reset code: " + e.awsErrorDetails().errorMessage());
        }
    }

    public void resetPassword(ResetUserPasswordRequest request) {
        try {
            ConfirmForgotPasswordRequest confirmForgotPasswordRequest = ConfirmForgotPasswordRequest
                    .builder()
                    .clientId(cognitoConfig.getClientId())
                    .password(request.getNewPassword())
                    .username(request.getEmail())
                    .confirmationCode(request.getCode())
                    .secretHash(calculateSecretHash(request.getEmail()))
                    .build();

            cognitoIdentityProviderClient.confirmForgotPassword(confirmForgotPasswordRequest);
            log.info("Password reset successfully for: {}", request.getEmail());
        } catch (CodeMismatchException e) {
            log.error("Invalid confirmation code for: {}", request.getEmail());
            throw new AuthException("Invalid confirmation code");
        } catch (ExpiredCodeException e) {
            log.error("Confirmation code expired for: {}", request.getEmail());
            throw new AuthException("Confirmation code has expired");
        } catch (CognitoIdentityProviderException e) {
            log.error("Reset password error: {}", e.awsErrorDetails().errorMessage());
            throw new AuthException("Failed to reset password: " + e.awsErrorDetails().errorMessage());
        }
    }

    public void changePassword(ChangeUserPasswordRequest request) {
        try {
            ChangePasswordRequest changePasswordRequest = ChangePasswordRequest.builder()
                    .accessToken(request.getAccessToken())
                    .previousPassword(request.getCurrentPassword())
                    .proposedPassword(request.getNewPassword())
                    .build();

            cognitoIdentityProviderClient.changePassword(changePasswordRequest);
            log.info("Password changed successfully");
        } catch (NotAuthorizedException e) {
            log.error("Invalid current password");
            throw new AuthException("Current password is incorrect");
        } catch (CognitoIdentityProviderException e) {
            log.error("Change password error: {}", e.awsErrorDetails().errorMessage());
            throw new AuthException("Failed to change password: " + e.awsErrorDetails().errorMessage());
        }
    }

    public UserResponse getUserInfo(String accessToken) {
        try {
            GetUserResponse r = cognitoIdentityProviderClient.getUser(
                    GetUserRequest.builder().accessToken(accessToken).build()
            );
            Map<String, String> attrs = r.userAttributes().stream()
                    .collect(Collectors.toMap(
                            AttributeType::name,
                            AttributeType::value,
                            (a, b) -> a
                    ));

            log.debug(attrs.toString());
            String email = attrs.get("email");
            log.debug("EMAIL: " + email);
            if (email == null) {
                throw new AuthException("Missing 'sub' in Cognito user attributes");
            }

            return userService.getUserByEmail(email);
        } catch (CognitoIdentityProviderException e) {
            log.error("Get user info error: {}", e.awsErrorDetails().errorMessage());
            throw new AuthException("Failed to get user info: " + e.awsErrorDetails().errorMessage());
        }
    }


    public AuthResponse refreshToken(String refreshToken) {
        try {
            Map<String, String> authParams = new HashMap<>();
            authParams.put("REFRESH_TOKEN", refreshToken);

            InitiateAuthRequest initiateAuthRequest = InitiateAuthRequest.builder()
                    .authFlow(AuthFlowType.REFRESH_TOKEN_AUTH)
                    .clientId(cognitoConfig.getClientId())
                    .authParameters(authParams)
                    .build();

            InitiateAuthResponse initiateAuthResponse = cognitoIdentityProviderClient.initiateAuth(initiateAuthRequest);
            AuthenticationResultType authentication = initiateAuthResponse.authenticationResult();

            log.info("Token refreshed successfully");
            return AuthResponse.builder()
                    .idToken(authentication.idToken())
                    .accessToken(authentication.accessToken())
                    .refreshToken(authentication.refreshToken())
                    .tokenType("Bearer")
                    .expiresIn(authentication.expiresIn())
                    .build();
        } catch (CognitoIdentityProviderException e) {
            log.error("Refresh token error: {}", e.awsErrorDetails().errorMessage());
            throw new AuthException("Failed to refresh token: " + e.awsErrorDetails().errorMessage());
        }
    }

    public void logout(String accessToken) {
        try {
            GlobalSignOutRequest globalSignOutRequest = GlobalSignOutRequest.builder()
                    .accessToken(accessToken).build();

            log.info("User logged out successfully");
            cognitoIdentityProviderClient.globalSignOut(globalSignOutRequest);
        } catch (CognitoIdentityProviderException e) {
            log.error("Logout error: {}", e.awsErrorDetails().errorMessage());
            throw new AuthException("Failed to logout: " + e.awsErrorDetails().errorMessage());
        }
    }

    public void confirmUser(VerifyAccountRequest request) {
        ConfirmSignUpRequest confirmSignUpRequest = ConfirmSignUpRequest.builder()
                .confirmationCode(request.getOtpCode())
                .username(request.getEmail())
                .clientId(cognitoConfig.getClientId())
                .secretHash(calculateSecretHash(request.getEmail()))
                .build();

        cognitoIdentityProviderClient.confirmSignUp(confirmSignUpRequest);
    }

    public String getAuthorizationUrlForGoogleProvider(OauthState oauthState) {
        String authUrl = String.format(
                "https://%s.auth.%s.amazoncognito.com/oauth2/authorize" +
                        "?response_type=code" +
                        "&client_id=%s" +
                        "&redirect_uri=%s" +
                        "&scope=email%%20openid%%20profile" +
                        "&state=%s" +
                        "&identity_provider=Google",
                cognitoConfig.getDomainPrefix(),
                cognitoConfig.getRegion(),
                cognitoConfig.getClientId(),
                URLEncoder.encode(cognitoConfig.getUrlCallback(), StandardCharsets.UTF_8),
                oauthState.getState()
        );

        return authUrl;
    }

    private CognitoTokenResponse exchangeCodeForToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(cognitoConfig.getClientId(), cognitoConfig.getClientSecret());

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", cognitoConfig.getClientId());
        body.add("code", code);
        body.add("redirect_uri", cognitoConfig.getUrlCallback());

        String tokenEndpoint = String.format("https://%s.auth.%s.amazoncognito.com/oauth2/token",
                cognitoConfig.getDomainPrefix(),
                cognitoConfig.getRegion());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<CognitoTokenResponse> response = restTemplate.exchange(
                    tokenEndpoint,
                    HttpMethod.POST,
                    request,
                    CognitoTokenResponse.class
            );

            if (!response.getStatusCode().is2xxSuccessful() ||
                    response.getBody() == null) {
                throw new AuthException("Token exchange failed");
            }

            return response.getBody();
        } catch (HttpClientErrorException e) {
            log.error("HTTP error during token exchange: {}",
                    e.getResponseBodyAsString());
            throw new AuthException("Token exchange failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during token exchange", e);
            throw new AuthException("Token exchange failed: " + e.getMessage());
        }
    }

    private String calculateSecretHash(String username) {
        try {
            String clientId = cognitoConfig.getClientId();
            String clientSecret = cognitoConfig.getClientSecret();

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    clientSecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            mac.init(secretKey);

            byte[] rawHmac = mac.doFinal((username + clientId).getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating secret hash", e);
        }
    }

    private String randomPlaceholderAvatar() {
        return "https://avatar.iran.liara.run/public/" + ThreadLocalRandom.current().nextInt(1, 101);
    }
}
