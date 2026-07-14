<template>
  <v-app>
    <v-app-bar flat class="app-top-bar" density="compact">
      <div class="app-logo-group">
        <v-icon size="20" color="white">mdi-heart-pulse</v-icon>
        <span class="app-logo-text">Evergreen Health</span>
      </div>
      <v-spacer />
      <v-avatar size="32" color="#1A6B52" class="app-avatar" @click="$router.push('/profile')">
        <span class="text-white text-caption font-weight-bold">MC</span>
      </v-avatar>
    </v-app-bar>

    <v-main class="bg-background app-content">
      <router-view />
    </v-main>

    <v-bottom-navigation v-model="activeTab" color="primary" bg-color="surface-light" grow>
      <v-btn value="/" @click="$router.push('/')">
        <v-icon>mdi-home-outline</v-icon>
        <span>Home</span>
      </v-btn>

      <v-btn value="/appointments" @click="$router.push('/appointments')">
        <v-icon>mdi-calendar-outline</v-icon>
        <span>Visits</span>
      </v-btn>

      <v-btn value="/care-plan" @click="$router.push('/care-plan')">
        <v-icon>mdi-heart-pulse</v-icon>
        <span>Care Plan</span>
      </v-btn>

      <v-btn value="/messages" @click="$router.push('/messages')">
        <v-badge
          v-if="unreadCount > 0"
          :content="unreadCount"
          color="error"
          floating
        >
          <v-icon>mdi-message-outline</v-icon>
        </v-badge>
        <v-icon v-else>mdi-message-outline</v-icon>
        <span>Messages</span>
      </v-btn>

    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import data from './data/metrics.json'

const route = useRoute()
const activeTab = ref(route.path)

watch(() => route.path, (path) => {
  activeTab.value = path
})

const unreadCount = computed(() =>
  data.messages.filter(m => m.unread).length
)
</script>

<style scoped>
.app-top-bar {
  background-color: #0D4F3C !important;
}

.app-logo-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 12px;
}

.app-logo-text {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.01em;
}

.app-avatar {
  margin-right: 12px;
  cursor: pointer;
}

.v-bottom-navigation {
  border-top: 1px solid rgb(var(--v-theme-outline-variant));
}

.v-bottom-navigation .v-btn {
  border-radius: 0 !important;
  min-width: 0;
}

.v-bottom-navigation .v-btn span {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.03em;
}
</style>
