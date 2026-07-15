<template>
  <v-app>
    <v-app-bar flat class="app-top-bar" density="compact">
      <div class="app-logo-group">
        <v-icon size="20" color="white">mdi-heart-pulse</v-icon>
        <span class="app-logo-text">Evergreen Health</span>
      </div>
      <v-spacer />
      <div class="d-flex align-center" style="gap: 16px">
        <v-menu v-model="notifMenu" :close-on-content-click="false" location="bottom end" offset="8">
          <template #activator="{ props }">
            <v-btn icon variant="text" size="small" v-bind="props">
              <v-badge v-if="unreadNotifCount > 0" :content="unreadNotifCount" color="error" floating offset-x="2" offset-y="2">
                <v-icon size="20" color="white">mdi-bell-outline</v-icon>
              </v-badge>
              <v-icon v-else size="20" color="white">mdi-bell-outline</v-icon>
            </v-btn>
          </template>
          <v-card min-width="320" max-width="360" class="pa-4">
            <p class="text-title-medium text-on-surface mb-3">Updates</p>
            <v-list density="compact" class="pa-0 bg-transparent">
              <v-list-item
                v-for="notif in recentNotifications"
                :key="notif.id"
                class="px-0"
              >
                <template #prepend>
                  <v-icon :color="getNotifColor(notif.type)" size="20">
                    {{ getNotifIcon(notif.type) }}
                  </v-icon>
                </template>
                <v-list-item-title class="text-body-medium" :class="{ 'font-weight-medium': !notif.read }">
                  {{ notif.message }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-small">
                  {{ formatRelativeTime(notif.timestamp) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-avatar size="32" color="#1A6B52" class="app-avatar" @click="$router.push('/profile')">
          <span class="text-white text-caption font-weight-bold">MC</span>
        </v-avatar>
      </div>
    </v-app-bar>

    <v-main class="bg-background app-content">
      <router-view />
    </v-main>

    <v-bottom-navigation v-model="activeTab" bg-color="surface-light" grow>
      <v-btn value="/" :class="{ 'nav-active': activeTab === '/' }" @click="$router.push('/')">
        <v-icon>{{ activeTab === '/' ? 'mdi-home' : 'mdi-home-outline' }}</v-icon>
        <span>Home</span>
      </v-btn>

      <v-btn value="/appointments" :class="{ 'nav-active': activeTab === '/appointments' }" @click="$router.push('/appointments')">
        <v-icon>{{ activeTab === '/appointments' ? 'mdi-calendar' : 'mdi-calendar-outline' }}</v-icon>
        <span>Visits</span>
      </v-btn>

      <v-btn value="/care-plan" :class="{ 'nav-active': activeTab === '/care-plan' }" @click="$router.push('/care-plan')">
        <v-icon>{{ activeTab === '/care-plan' ? 'mdi-heart-pulse' : 'mdi-heart-pulse' }}</v-icon>
        <span>Care Plan</span>
      </v-btn>

      <v-btn value="/messages" :class="{ 'nav-active': activeTab === '/messages' }" @click="$router.push('/messages')">
        <v-badge
          v-if="unreadCount > 0"
          :content="unreadCount"
          color="error"
          floating
          offset-x="2"
          offset-y="2"
          class="md3-badge"
        >
          <v-icon>{{ activeTab === '/messages' ? 'mdi-message' : 'mdi-message-outline' }}</v-icon>
        </v-badge>
        <v-icon v-else>{{ activeTab === '/messages' ? 'mdi-message' : 'mdi-message-outline' }}</v-icon>
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

const notifMenu = ref(false)

const recentNotifications = computed(() =>
  [...data.notifications]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4)
)

const unreadNotifCount = computed(() =>
  data.notifications.filter(n => !n.read).length
)

function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hr ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay} days ago`
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getNotifIcon(type: string): string {
  const icons: Record<string, string> = {
    'appointment-reminder': 'mdi-calendar-alert',
    'task': 'mdi-checkbox-marked-circle-outline',
    'document': 'mdi-file-document-outline',
    'care-plan-update': 'mdi-heart-pulse',
    'message': 'mdi-message-outline',
    'lab-results': 'mdi-flask-outline',
  }
  return icons[type] || 'mdi-bell-outline'
}

function getNotifColor(type: string): string {
  const colors: Record<string, string> = {
    'appointment-reminder': 'warning',
    'task': 'primary',
    'document': 'info',
    'care-plan-update': 'success',
    'message': 'primary',
    'lab-results': 'info',
  }
  return colors[type] || 'on-surface-variant'
}
</script>

<style scoped>
.app-top-bar {
  background-color: #0D4F3C !important;
  padding-top: 8px !important;
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
  height: 72px !important;
}

.v-bottom-navigation .v-btn {
  border-radius: 0 !important;
  min-width: 0;
  padding-top: 8px;
  flex: 1 1 25% !important;
  max-width: 25% !important;
}

.v-bottom-navigation .v-btn :deep(.v-btn__content) {
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.v-bottom-navigation .v-btn .v-icon {
  width: 24px;
  min-width: 24px;
  text-align: center;
}

.v-bottom-navigation .v-btn:before,
.v-bottom-navigation .v-btn .v-btn__overlay {
  display: none !important;
}

.v-bottom-navigation .v-btn--active .v-btn__overlay,
.v-bottom-navigation .v-btn--selected .v-btn__overlay {
  opacity: 0 !important;
}

.v-bottom-navigation :deep(.v-btn__overlay) {
  opacity: 0 !important;
}

.v-bottom-navigation .v-btn span {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.v-bottom-navigation .v-btn span::after {
  content: attr(data-text);
  content: attr(data-text) / '';
  font-weight: 700;
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}

.v-bottom-navigation .v-btn.nav-active {
  box-shadow: inset 0 2px 0 0 #0D4F3C;
  color: #0D4F3C !important;
  background-color: transparent !important;
}

.v-bottom-navigation .v-btn.nav-active :deep(.v-icon) {
  color: #0D4F3C !important;
}

.v-bottom-navigation .v-btn.nav-active span {
  font-weight: 500;
  color: #0D4F3C !important;
  text-shadow: 0 0 0.5px #0D4F3C, 0 0 0.5px #0D4F3C;
}

.md3-badge :deep(.v-badge__badge) {
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  border-radius: 8px;
}
</style>
