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
import data from '../data/metrics.json'

const patient = data.patient

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
