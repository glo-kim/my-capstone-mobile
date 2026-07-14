<template>
  <div class="profile-view">
    <div class="px-4 pt-5 pb-3">
      <div class="d-flex align-center ga-4 mb-4">
        <v-avatar color="primary" size="64">
          <span class="text-h5 text-white">{{ getInitials(patient.firstName + ' ' + patient.lastName) }}</span>
        </v-avatar>
        <div>
          <h1 class="text-h5 font-weight-medium text-on-surface">
            {{ patient.firstName }} {{ patient.lastName }}
          </h1>
          <p class="text-body-small text-on-surface-variant">Member ID: {{ patient.memberId }}</p>
        </div>
      </div>
    </div>

    <div class="px-4 d-flex flex-column ga-3 pb-4">
      <!-- Personal Information -->
      <v-card class="pa-4">
        <p class="text-title-medium text-on-surface mb-3">Personal Information</p>
        <div class="d-flex flex-column ga-3">
          <div class="d-flex align-center ga-3">
            <v-icon color="on-surface-variant" size="20">mdi-cake-variant-outline</v-icon>
            <div>
              <p class="text-caption text-on-surface-variant">Date of Birth</p>
              <p class="text-body-medium text-on-surface">{{ formatDOB(patient.dateOfBirth) }} ({{ patient.age }})</p>
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <v-icon color="on-surface-variant" size="20">mdi-phone-outline</v-icon>
            <div>
              <p class="text-caption text-on-surface-variant">Phone</p>
              <p class="text-body-medium text-on-surface">{{ patient.phone }}</p>
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <v-icon color="on-surface-variant" size="20">mdi-email-outline</v-icon>
            <div>
              <p class="text-caption text-on-surface-variant">Email</p>
              <p class="text-body-medium text-on-surface">{{ patient.email }}</p>
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <v-icon color="on-surface-variant" size="20">mdi-map-marker-outline</v-icon>
            <div>
              <p class="text-caption text-on-surface-variant">Address</p>
              <p class="text-body-medium text-on-surface">{{ patient.address }}</p>
            </div>
          </div>
        </div>
      </v-card>

      <!-- Insurance -->
      <v-card class="pa-4">
        <p class="text-title-medium text-on-surface mb-3">Insurance</p>
        <div class="d-flex align-center ga-3">
          <v-icon color="on-surface-variant" size="20">mdi-shield-check-outline</v-icon>
          <div>
            <p class="text-body-medium text-on-surface">{{ patient.insurance }}</p>
            <p class="text-body-small text-on-surface-variant">ID: {{ patient.memberId }}</p>
          </div>
        </div>
      </v-card>

      <!-- Care Team -->
      <v-card class="pa-4">
        <p class="text-title-medium text-on-surface mb-3">Care Team</p>
        <v-list density="compact" class="pa-0 bg-transparent">
          <v-list-item
            v-for="member in data.careTeam"
            :key="member.id"
            class="px-0"
          >
            <template #prepend>
              <v-avatar :color="member.isPrimary ? 'primary' : 'secondary-container'" size="36" class="mr-3">
                <span class="text-body-small" :class="member.isPrimary ? 'text-white' : 'text-on-secondary-container'">
                  {{ getInitials(member.name) }}
                </span>
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-medium">{{ member.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-body-small">{{ member.role }}</v-list-item-subtitle>
            <template #append>
              <v-btn icon="mdi-phone-outline" variant="text" size="x-small" color="primary" />
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <!-- Health Tracking -->
      <v-card class="pa-4">
        <p class="text-title-medium text-on-surface mb-3">Recent Vitals</p>

        <div class="mb-4">
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-body-small text-on-surface-variant">Weight (today)</span>
            <span class="text-body-large font-weight-medium text-on-surface">
              {{ latestWeight }} {{ data.healthTracking.weight.unit }}
            </span>
          </div>
          <div class="d-flex ga-1">
            <div
              v-for="(entry, i) in recentWeights"
              :key="i"
              class="flex-grow-1 rounded"
              :style="{
                height: '24px',
                backgroundColor: entry.value ? 'rgb(var(--v-theme-primary-container))' : 'rgb(var(--v-theme-surface-variant))',
              }"
            />
          </div>
          <div class="d-flex justify-space-between mt-1">
            <span class="text-caption text-on-surface-variant">7 days ago</span>
            <span class="text-caption text-on-surface-variant">Today</span>
          </div>
        </div>

        <div>
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-body-small text-on-surface-variant">Blood Pressure (latest)</span>
            <span class="text-body-large font-weight-medium" :class="bpColor">
              {{ latestBP }}
            </span>
          </div>
        </div>
      </v-card>

      <!-- App Settings -->
      <v-card class="pa-4">
        <p class="text-title-medium text-on-surface mb-3">Settings</p>
        <v-list density="compact" class="pa-0 bg-transparent">
          <v-list-item class="px-0" prepend-icon="mdi-bell-outline">
            <v-list-item-title class="text-body-medium">Notifications</v-list-item-title>
          </v-list-item>
          <v-list-item class="px-0" prepend-icon="mdi-lock-outline">
            <v-list-item-title class="text-body-medium">Privacy & Security</v-list-item-title>
          </v-list-item>
          <v-list-item class="px-0" prepend-icon="mdi-help-circle-outline">
            <v-list-item-title class="text-body-medium">Help & Support</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import data from '../data/metrics.json'

const patient = data.patient

const latestWeight = computed(() => {
  const entry = data.healthTracking.weight.entries.find(e => e.value !== null)
  return entry?.value ?? '—'
})

const recentWeights = computed(() =>
  data.healthTracking.weight.entries.slice(0, 7).reverse()
)

const latestBP = computed(() => {
  const entry = data.healthTracking.bloodPressure.entries[0]
  return entry ? `${entry.systolic}/${entry.diastolic}` : '—'
})

const bpColor = computed(() => {
  const entry = data.healthTracking.bloodPressure.entries[0]
  if (!entry) return 'text-on-surface'
  if (entry.systolic >= 140 || entry.diastolic >= 90) return 'text-error'
  if (entry.systolic >= 130 || entry.diastolic >= 85) return 'text-warning'
  return 'text-success'
})

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).filter(c => c && c === c.toUpperCase()).join('').slice(0, 2)
}

function formatDOB(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.profile-view {
  max-width: 480px;
  margin: 0 auto;
}
</style>
