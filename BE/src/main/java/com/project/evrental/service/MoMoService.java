package com.project.evrental.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.evrental.config.MoMoConfig;
import com.project.evrental.domain.dto.request.MoMoCallbackRequest;
import com.project.evrental.domain.dto.response.MoMoPaymentResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MoMoService {

    MoMoConfig moMoConfig;
    ObjectMapper objectMapper;

    public MoMoPaymentResponse createPayment(UUID bookingId, BigDecimal amount, String orderInfo, boolean isDeposit) {
        try {
            String orderId = UUID.randomUUID().toString();
            String requestId = UUID.randomUUID().toString();
            long amountLong = amount.longValue();

            String extraDataStr = String.valueOf(isDeposit);
            String rawSignature = "accessKey=" + moMoConfig.getAccessKey() +
                    "&amount=" + amountLong +
                    "&extraData=" + extraDataStr +
                    "&ipnUrl=" + moMoConfig.getNotifyUrl() +
                    "&orderId=" + orderId +
                    "&orderInfo=" + orderInfo +
                    "&partnerCode=" + moMoConfig.getPartnerCode() +
                    "&redirectUrl=" + moMoConfig.getRedirectUrl() +
                    "&requestId=" + requestId +
                    "&requestType=captureWallet";

            String signature = generateHmacSHA256(rawSignature, moMoConfig.getSecretKey());

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", moMoConfig.getPartnerCode());
            requestBody.put("partnerName", "EV Rental");
            requestBody.put("storeId", "EVRental");
            requestBody.put("requestId", requestId);
            requestBody.put("amount", amountLong);
            requestBody.put("orderId", orderId);
            requestBody.put("orderInfo", orderInfo);
            requestBody.put("redirectUrl", moMoConfig.getRedirectUrl());
            requestBody.put("ipnUrl", moMoConfig.getNotifyUrl());
            requestBody.put("lang", "vi");
            requestBody.put("extraData", extraDataStr);
            requestBody.put("requestType", "captureWallet");
            requestBody.put("signature", signature);

            String requestBodyJson = objectMapper.writeValueAsString(requestBody);
            log.info("MoMo payment request created for booking: {}, orderId: {}", bookingId, orderId);

            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(moMoConfig.getEndpoint()))
                    .header("Content-Type", "application/json")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(requestBodyJson))
                    .build();

            java.net.http.HttpResponse<String> response = client.send(request,
                    java.net.http.HttpResponse.BodyHandlers.ofString());

            MoMoPaymentResponse moMoResponse = objectMapper.readValue(response.body(), MoMoPaymentResponse.class);
            log.info("MoMo payment response received - resultCode: {}, orderId: {}", 
                    moMoResponse.getResultCode(), moMoResponse.getOrderId());

            return moMoResponse;
        } catch (Exception e) {
            log.error("Error creating MoMo payment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create MoMo payment", e);
        }
    }

    public boolean verifySignature(MoMoCallbackRequest callback) {
        try {
            String extraDataStr = (callback.getExtraData() != null && !callback.getExtraData().isEmpty()) 
                    ? callback.getExtraData() : "";
            String rawSignature = "accessKey=" + moMoConfig.getAccessKey() +
                    "&amount=" + callback.getAmount() +
                    "&extraData=" + extraDataStr +
                    "&message=" + callback.getMessage() +
                    "&orderId=" + callback.getOrderId() +
                    "&orderInfo=" + callback.getOrderInfo() +
                    "&orderType=" + callback.getOrderType() +
                    "&partnerCode=" + callback.getPartnerCode() +
                    "&payType=" + callback.getPayType() +
                    "&requestId=" + callback.getRequestId() +
                    "&responseTime=" + callback.getResponseTime() +
                    "&resultCode=" + callback.getResultCode() +
                    "&transId=" + callback.getTransId();

            String signature = generateHmacSHA256(rawSignature, moMoConfig.getSecretKey());
            boolean isValid = signature.equals(callback.getSignature());
            
            log.info("MoMo callback signature verification - orderId: {}, valid: {}", 
                    callback.getOrderId(), isValid);
            
            return isValid;
        } catch (Exception e) {
            log.error("Error verifying MoMo signature: {}", e.getMessage(), e);
            return false;
        }
    }

    private String generateHmacSHA256(String data, String secretKey) {
        try {
            Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmacSHA256.init(secretKeySpec);
            byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.error("Error generating HMAC SHA256: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate signature", e);
        }
    }
}
