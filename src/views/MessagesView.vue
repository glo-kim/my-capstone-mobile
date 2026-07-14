<template>
  <div class="messages-view">
    <div class="px-4 pt-5 pb-2">
      <h1 class="text-h5 font-weight-medium text-on-surface">Messages</h1>
    </div>

    <!-- Thread list -->
    <div v-if="!activeThread" class="px-4 d-flex flex-column ga-2 pb-4">
      <v-card
        v-for="thread in data.messages"
        :key="thread.id"
        class="pa-4"
        @click="activeThread = thread"
      >
        <div class="d-flex align-start ga-3">
          <v-avatar color="primary" size="40">
            <span class="text-body-small text-white">{{ getInitials(thread.contactName) }}</span>
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <div class="d-flex align-center justify-space-between">
              <p class="text-body-medium font-weight-medium text-on-surface">{{ thread.contactName }}</p>
              <span class="text-caption text-on-surface-variant">{{ formatTime(thread.lastMessageTime) }}</span>
            </div>
            <p class="text-body-small text-on-surface-variant">{{ thread.contactRole }}</p>
            <p class="text-body-small text-on-surface-variant mt-1 text-truncate">
              {{ thread.lastMessagePreview }}
            </p>
          </div>
          <v-icon v-if="thread.unread" color="primary" size="10" class="mt-2">mdi-circle</v-icon>
        </div>
      </v-card>
    </div>

    <!-- Active thread -->
    <div v-else class="d-flex flex-column" style="height: calc(100vh - 136px)">
      <!-- Thread header -->
      <div class="d-flex align-center ga-3 px-4 py-3 bg-surface-light" style="border-bottom: 1px solid rgb(var(--v-theme-outline-variant))">
        <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="activeThread = null" />
        <v-avatar color="primary" size="36">
          <span class="text-body-small text-white">{{ getInitials(activeThread.contactName) }}</span>
        </v-avatar>
        <div>
          <p class="text-body-medium font-weight-medium text-on-surface">{{ activeThread.contactName }}</p>
          <p class="text-caption text-on-surface-variant">{{ activeThread.contactRole }}</p>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-grow-1 overflow-y-auto px-4 py-3 d-flex flex-column ga-3">
        <div
          v-for="msg in activeThread.thread"
          :key="msg.id"
          :class="['d-flex', msg.sender === 'patient' ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'message-bubble pa-3',
              msg.sender === 'patient' ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface'
            ]"
            style="max-width: 80%; border-radius: 16px"
          >
            <p class="text-body-medium">{{ msg.text }}</p>
            <p
              class="text-caption mt-1"
              :style="{ opacity: 0.6 }"
            >
              {{ formatMessageTime(msg.timestamp) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="px-4 py-3 bg-surface-light" style="border-top: 1px solid rgb(var(--v-theme-outline-variant))">
        <div class="d-flex align-center ga-2">
          <v-text-field
            v-model="messageInput"
            placeholder="Type a message..."
            variant="outlined"
            density="compact"
            hide-details
            class="flex-grow-1"
          />
          <v-btn
            icon="mdi-send"
            color="primary"
            variant="flat"
            size="small"
            :disabled="!messageInput.trim()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import data from '../data/metrics.json'

const activeThread = ref<any>(null)
const messageInput = ref('')

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).filter(c => c && c === c.toUpperCase()).join('').slice(0, 2)
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'short' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatMessageTime(timestamp: string): string {
  const d = new Date(timestamp)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
</script>

<style scoped>
.messages-view {
  max-width: 480px;
  margin: 0 auto;
}

.message-bubble {
  word-break: break-word;
}
</style>
