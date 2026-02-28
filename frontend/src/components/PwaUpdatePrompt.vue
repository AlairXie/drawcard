<template>
  <div v-if="needRefresh" class="pwa-toast">
    <span>发现新版本</span>
    <button class="pwa-toast-btn" @click="updateServiceWorker()">立即更新</button>
    <button class="pwa-toast-close" @click="close">&times;</button>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const intervalMS = 60 * 60 * 1000; // check every hour

const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisteredSW(swUrl, r) {
    if (!r) return;
    setInterval(async () => {
      if (r.installing || !navigator) return;
      if ('connection' in navigator && !navigator.onLine) return;
      const resp = await fetch(swUrl, {
        cache: 'no-store',
        headers: { 'cache-control': 'no-cache' },
      });
      if (resp.status === 200) await r.update();
    }, intervalMS);
  },
});

function close() {
  needRefresh.value = false;
}
</script>

<style scoped>
.pwa-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1c2a44;
  border: 1px solid #4750c5;
  border-radius: 14px;
  padding: 12px 18px;
  color: #dbe6ff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slide-up 0.3s ease-out;
}

.pwa-toast-btn {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.pwa-toast-close {
  background: transparent;
  border: none;
  color: #8fa4cb;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
