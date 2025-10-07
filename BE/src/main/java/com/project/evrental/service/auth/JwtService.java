package com.project.evrental.service.auth;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.JWKSourceBuilder;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTClaimsVerifier;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import com.nimbusds.jwt.proc.JWTProcessor;
import com.project.evrental.config.CognitoConfig;
import com.project.evrental.exception.custom.AuthException;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.text.ParseException;
import java.util.Date;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JwtService {

    CognitoConfig cognitoConfig;

    @NonFinal
    JWKSource<SecurityContext> jwkSource;

    @NonFinal
    JWTProcessor<SecurityContext> jwtProcessor;

    @PostConstruct
    public void init() {
        try {
            String jwkUrl = String.format("https://cognito-idp.%s.amazonaws.com/%s/.well-known/jwks.json",
                    cognitoConfig.getRegion(),
                    cognitoConfig.getUserPoolId());

            this.jwkSource = JWKSourceBuilder.create(new URL(jwkUrl)).build();

            ConfigurableJWTProcessor<SecurityContext> processor = new DefaultJWTProcessor<>();
            JWSKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(JWSAlgorithm.RS256, jwkSource);
            processor.setJWSKeySelector(keySelector);
            processor.setJWTClaimsSetVerifier(new DefaultJWTClaimsVerifier<>(
                    new JWTClaimsSet.Builder()
                            .issuer(String.format("https://cognito-idp.%s.amazonaws.com/%s",
                                    cognitoConfig.getRegion(),
                                    cognitoConfig.getUserPoolId()))
                            .build(),
                    Set.of("sub", "email", "token_use")
            ));

            this.jwtProcessor = processor;
        } catch (Exception e) {
            log.error("Failed to initialize JWT validator", e);
            throw new RuntimeException("JWT validator initialization failed", e);
        }
    }

    public JWTClaimsSet validateIdToken(String idToken) {
        try {
            JWTClaimsSet claims = jwtProcessor.process(idToken, null);

            if(!claims.getAudience().contains(cognitoConfig.getClientId())) {
                throw new AuthException("Invalid token audience");
            }

            String tokenUse = (String) claims.getClaim("token_use");
            if(!"id".equals(tokenUse)) {
                throw new AuthException("Token is not an ID token");
            }

            if (claims.getExpirationTime().before(new Date())) {
                throw new AuthException("Token has expired");
            }

            log.info("Token validated successfully for user: {}", claims.getClaim("email"));

            return claims;
        } catch (Exception e) {
            log.error("Token validation failed", e);
            throw new AuthException("Invalid token: " + e.getMessage());
        }
    }

    public String getEmailFromClaims(JWTClaimsSet claims) {
        try {
            return claims.getStringClaim("email");
        } catch (ParseException e) {
            throw new AuthException("Email claim not found");
        }
    }

    public String getNameFromClaims(JWTClaimsSet claims) {
        try {
            return claims.getStringClaim("name");
        } catch (ParseException e) {
            return null;
        }
    }

    public String getPictureFromClaims(JWTClaimsSet claims) {
        try {
            return claims.getStringClaim("picture");
        } catch (ParseException e) {
            return null;
        }
    }

    public String getSubFromClaims(JWTClaimsSet claims) {
        return claims.getSubject(); // cognito-sub
    }

}
