<template>
  <div class="appointments-view">
    <div class="px-4 pt-5 pb-2">
      <h1 class="text-h5 font-weight-medium text-on-surface">Appointments</h1>
    </div>

    <div class="px-4">
      <!-- Tab toggle -->
      <v-btn-toggle v-model="tab" mandatory color="primary" density="compact" class="mb-4" rounded="pill">
        <v-btn value="upcoming" size="small">Upcoming</v-btn>
        <v-btn value="past" size="small">Past</v-btn>
      </v-btn-toggle>

      <!-- Upcoming -->
      <div v-if="tab === 'upcoming'" class="d-flex flex-column ga-3 pb-4">
        <v-card
          v-for="apt in data.appointments.upcoming"
          :key="apt.id"
          class="pa-4"
          @click="selectedApt = apt"
        >
          <div class="d-flex align-start ga-3">
            <v-avatar :color="getTypeColor(apt.type) + '-container'" size="40">
              <v-icon :color="getTypeColor(apt.type)" size="20">{{ getTypeIcon(apt.type) }}</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <p class="text-body-large font-weight-medium text-on-surface">{{ apt.title }}</p>
              <p class="text-body-small text-on-surface-variant">{{ apt.provider }}</p>
              <div class="d-flex align-center ga-1 mt-1">
                <v-icon size="14" color="on-surface-variant">mdi-calendar</v-icon>
                <span class="text-body-small text-on-surface-variant">
                  {{ formatDate(apt.date) }} · {{ formatTime(apt.startTime) }}
                </span>
              </div>
              <div class="d-flex align-center ga-1 mt-1">
                <v-icon size="14" color="on-surface-variant">{{ apt.telehealth ? 'mdi-video-outline' : 'mdi-map-marker-outline' }}</v-icon>
                <span class="text-body-small text-on-surface-variant">{{ apt.location }}</span>
              </div>
            </div>
            <v-chip
              v-if="apt.confirmed"
              size="x-small"
              color="success"
              variant="tonal"
            >
              Confirmed
            </v-chip>
            <v-chip
              v-else
              size="x-small"
              color="warning"
              variant="tonal"
            >
              Unconfirmed
            </v-chip>
          </div>
        </v-card>

        <p v-if="data.appointments.upcoming.length === 0" class="text-body-medium text-on-surface-variant text-center py-8">
          No upcoming appointments
        </p>
      </div>

      <!-- Past -->
      <div v-if="tab === 'past'" class="d-flex flex-column ga-3 pb-4">
        <v-card
          v-for="apt in sortedPast"
          :key="apt.id"
          class="pa-4"
          @click="selectedApt = apt"
        >
          <div class="d-flex align-start ga-3">
            <v-avatar color="surface-variant" size="40">
              <v-icon color="on-surface-variant" size="20">{{ getTypeIcon(apt.type) }}</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <p class="text-body-large font-weight-medium text-on-surface">{{ apt.title }}</p>
              <p class="text-body-small text-on-surface-variant">{{ apt.provider }}</p>
              <p class="text-body-small text-on-surface-variant">{{ formatDate(apt.date) }}</p>
              <p v-if="apt.summary" class="text-body-small text-on-surface-variant mt-2" style="opacity: 0.8">
                {{ apt.summary }}
              </p>
            </div>
          </div>
        </v-card>
      </div>
    </div>

    <!-- Appointment Detail Sheet -->
    <v-bottom-sheet v-model="showDetail">
      <v-card v-if="selectedApt" class="pa-5">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h6 font-weight-medium">{{ selectedApt.title }}</h2>
          <v-btn icon="mdi-close" variant="text" size="small" @click="showDetail = false" />
        </div>

        <div class="d-flex flex-column ga-3">
          <div class="d-flex align-center ga-3">
            <v-icon color="on-surface-variant" size="20">mdi-account-outline</v-icon>
            <span class="text-body-medium">{{ selectedApt.provider }}</span>
          </div>
          <div class="d-flex align-center ga-3">
            <v-icon color="on-surface-variant" size="20">mdi-calendar</v-icon>
            <span class="text-body-medium">{{ formatDateLong(selectedApt.date) }}</span>
          </div>
          <div v-if="selectedApt.startTime" class="d-flex align-center ga-3">
            <v-icon color="on-surface-variant" size="20">mdi-clock-outline</v-icon>
            <span class="text-body-medium">{{ formatTime(selectedApt.startTime) }} – {{ formatTime(selectedApt.endTime) }}</span>
          </div>
          <div class="d-flex align-center ga-3">
            <v-icon color="on-surface-variant" size="20">{{ selectedApt.telehealth ? 'mdi-video-outline' : 'mdi-map-marker-outline' }}</v-icon>
            <div>
              <p class="text-body-medium">{{ selectedApt.location }}</p>
              <p v-if="selectedApt.address" class="text-body-small text-on-surface-variant">{{ selectedApt.address }}</p>
            </div>
          </div>
        </div>

        <v-alert
          v-if="selectedApt.instructions"
          color="info"
          variant="tonal"
          class="mt-4"
          density="compact"
        >
          <template #prepend>
            <v-icon size="18">mdi-information-outline</v-icon>
          </template>
          <span class="text-body-small">{{ selectedApt.instructions }}</span>
        </v-alert>

        <p v-if="selectedApt.summary" class="text-body-medium text-on-surface-variant mt-4">
          {{ selectedApt.summary }}
        </p>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import data from '../data/metrics.json'

const tab = ref('upcoming')
const selectedApt = ref<any>(null)
const showDetail = ref(false)

watch(selectedApt, (val) => {
  if (val) showDetail.value = true
})

watch(showDetail, (val) => {
  if (!val) selectedApt.value = null
})

const sortedPast = computed(() =>
  [...data.appointments.past].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTime(time: string): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    'follow-up': 'mdi-stethoscope',
    'care-plan-review': 'mdi-clipboard-check-outline',
    'lab': 'mdi-flask-outline',
    'discharge-planning': 'mdi-hospital-building',
  }
  return icons[type] || 'mdi-calendar'
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'follow-up': 'primary',
    'care-plan-review': 'tertiary',
    'lab': 'info',
    'discharge-planning': 'secondary',
  }
  return colors[type] || 'primary'
}
</script>

<style scoped>
.appointments-view {
  max-width: 480px;
  margin: 0 auto;
}
</style>
