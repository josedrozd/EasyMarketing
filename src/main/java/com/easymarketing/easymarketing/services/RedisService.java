package com.easymarketing.easymarketing.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void setProcessing(Long purchaseId) {
        redisTemplate.opsForHash().put(purchaseId.toString(), "processing", true);
        redisTemplate.opsForHash().put(purchaseId.toString(), "started", true);
        redisTemplate.expire(purchaseId.toString(), Duration.ofDays(30));
    }

    public boolean isProcessing(Long purchaseId) {
        Object val = redisTemplate.opsForHash().get(purchaseId.toString(), "processing");
        return Boolean.parseBoolean(String.valueOf(val));
    }

    public boolean isStarted(Long purchaseId) {
        Object val = redisTemplate.opsForHash().get(purchaseId.toString(), "started");
        return Boolean.parseBoolean(String.valueOf(val));
    }

    public void removeProcessing(Long purchaseId) {
        redisTemplate.opsForHash().put(purchaseId.toString(), "processing", false);
    }

    public void removeKey(Long purchaseId){
        redisTemplate.delete(purchaseId.toString());
    }

}
