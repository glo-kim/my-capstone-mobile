<template>
  <div class="home-view">
    <!-- Header -->
    <div class="px-4 pt-5 pb-3">
      <p class="text-body-small text-on-surface-variant mb-1">{{ greeting }}</p>
      <h1 class="text-h5 font-weight-medium text-on-surface">{{ data.patient.preferredName || data.patient.firstName }}</h1>
    </div>

    <div class="px-4 d-flex flex-column ga-3 pb-4">
      <!-- Case Status Card -->
      <v-card color="primary" theme="dark" class="pa-4">
        <div class="d-flex align-center justify-space-between mb-2">
          <v-chip size="small" color="white" variant="flat" class="text-primary font-weight-medium">
            {{ data.caseOverview.statusLabel }}
          </v-chip>
          <span class="text-body-small text-white" style="opacity: 0.7">
            Case {{ data.caseOverview.caseId }}
          </span>
        </div>
        <p class="text-body-medium mb-3" style="opacity: 0.85">{{ data.caseOverview.summary }}</p>
        <div class="d-flex align-center ga-2">
          <v-icon size="16">mdi-arrow-right-circle-outline</v-icon>
          <span class="text-body-small">Next: {{ data.caseOverview.nextAction }}</span>
        </div>
      </v-card>

      <!-- Next Appointment -->
      <v-card class="pa-4" @click="$router.push('/appointments')">
        <div class="d-flex align-center ga-3">
          <v-avatar color="primary-container" size="44">
            <v-icon color="primary" size="22">mdi-calendar-clock</v-icon>
          </v-avatar>
          <div class="flex-grow-1">
            <p class="text-label-large text-on-surface">{{ nextAppointment?.title }}</p>
            <p class="text-body-small text-on-surface-variant">
              {{ formatDate(nextAppointment?.date) }} · {{ nextAppointment?.startTime }}
            </p>
            <p class="text-body-small text-on-surface-variant">{{ nextAppointment?.provider }}</p>
          </div>
          <v-icon color="on-surface-variant" size="20">mdi-chevron-right</v-icon>
        </div>
      </v-card>

      <!-- Tasks Needing Attention -->
      <v-card class="pa-4">
        <div class="d-flex align-center justify-space-between mb-3">
          <p class="text-title-medium text-on-surface">To Do</p>
          <v-chip size="x-small" color="error" variant="tonal">{{ pendingTasks.length }}</v-chip>
        </div>
        <v-list density="compact" class="pa-0 bg-transparent">
          <v-list-item
            v-for="task in pendingTasks.slice(0, 3)"
            :key="task.id"
            class="px-0"
          >
            <template #prepend>
              <v-icon
                :color="task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'on-surface-variant'"
                size="20"
                class="mr-3"
              >
                {{ task.priority === 'high' ? 'mdi-alert-circle' : 'mdi-checkbox-blank-circle-outline' }}
              </v-icon>
            </template>
            <v-list-item-title class="text-body-medium">{{ task.title }}</v-list-item-title>
            <v-list-item-subtitle v-if="task.dueDate" class="text-body-small">
              Due {{ formatDate(task.dueDate) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-btn
          v-if="pendingTasks.length > 3"
          variant="text"
          color="primary"
          size="small"
          class="mt-2 px-0"
        >
          View all {{ pendingTasks.length }} tasks
        </v-btn>
      </v-card>

      <!-- Care Goals Snapshot -->
      <v-card class="pa-4" @click="$router.push('/care-plan')">
        <div class="d-flex align-center justify-space-between mb-3">
          <p class="text-title-medium text-on-surface">Care Goals</p>
          <v-icon color="on-surface-variant" size="20">mdi-chevron-right</v-icon>
        </div>
        <div class="d-flex flex-column ga-3">
          <div v-for="goal in activeGoals.slice(0, 3)" :key="goal.id">
            <div class="d-flex align-center justify-space-between mb-1">
              <span class="text-body-small text-on-surface">{{ goal.title }}</span>
              <span class="text-label-small text-on-surface-variant">{{ Math.round(goal.progress * 100) }}%</span>
            </div>
            <v-progress-linear
              :model-value="goal.progress * 100"
              :color="goal.progress >= 0.7 ? 'success' : goal.progress >= 0.5 ? 'warning' : 'error'"
              height="6"
            />
          </div>
        </div>
      </v-card>

      <!-- Care Team -->
      <v-card class="pa-4">
        <p class="text-title-medium text-on-surface mb-3">Your Care Team</p>
        <div class="d-flex ga-4 overflow-x-auto">
          <div
            v-for="member in data.careTeam.slice(0, 3)"
            :key="member.id"
            class="text-center"
            style="min-width: 72px"
          >
            <v-avatar :color="member.isPrimary ? 'primary' : 'secondary-container'" size="44" class="mb-1">
              <span class="text-body-small" :class="member.isPrimary ? 'text-white' : 'text-on-secondary-container'">
                {{ getInitials(member.name) }}
              </span>
            </v-avatar>
            <p class="text-body-small text-on-surface" style="line-height: 1.2">{{ member.name.split(' ').pop() }}</p>
            <p class="text-caption text-on-surface-variant" style="font-size: 0.625rem">{{ member.role.split(' ')[0] }}</p>
          </div>
        </div>
      </v-card>

      <!-- Recent Notifications -->
      <v-card class="pa-4">
        <p class="text-title-medium text-on-surface mb-3">Updates</p>
        <v-list density="compact" class="pa-0 bg-transparent">
          <v-list-item
            v-for="notif in recentNotifications"
            :key="notif.id"
            class="px-0"
          >
            <template #prepend>
              <v-icon :color="getNotifColor(notif.type)" size="20" class="mr-3">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import data from '../data/metrics.json'

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const nextAppointment = computed(() => data.appointments.upcoming[0])

const pendingTasks = computed(() =>
  data.tasks.filter(t => t.status === 'pending' || t.status === 'in-progress')
)

const activeGoals = computed(() =>
  data.careGoals.filter(g => g.status === 'in-progress')
)

const recentNotifications = computed(() =>
  [...data.notifications]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4)
)

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).filter(c => c && c === c.toUpperCase()).join('').slice(0, 2)
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

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
    'appointment-reminder': 'info',
    'task': 'warning',
    'document': 'primary',
    'care-plan-update': 'success',
    'message': 'primary',
    'lab-results': 'info',
  }
  return colors[type] || 'on-surface-variant'
}
</script>

<style scoped>
.home-view {
  max-width: 480px;
  margin: 0 auto;
}
</style>
