<template>
  <div class="care-plan-view">
    <div class="px-4 pt-5 pb-2">
      <h1 class="text-h5 font-weight-medium text-on-surface">Care Plan</h1>
      <p class="text-body-small text-on-surface-variant mt-1">
        {{ completedGoals }} of {{ data.careGoals.length }} goals completed
      </p>
    </div>

    <div class="px-4">
      <!-- Tab toggle -->
      <v-btn-toggle v-model="tab" mandatory color="primary" density="compact" class="mb-4" rounded="pill">
        <v-btn value="goals" size="small">Goals</v-btn>
        <v-btn value="tasks" size="small">Tasks</v-btn>
        <v-btn value="documents" size="small">Documents</v-btn>
      </v-btn-toggle>

      <!-- Goals -->
      <div v-if="tab === 'goals'" class="d-flex flex-column ga-3 pb-4">
        <v-card
          v-for="goal in data.careGoals"
          :key="goal.id"
          class="pa-4"
          @click="expandedGoal = expandedGoal === goal.id ? null : goal.id"
        >
          <div class="d-flex align-center ga-3 mb-2">
            <v-icon
              :color="goal.status === 'completed' ? 'success' : 'primary'"
              size="22"
            >
              {{ goal.status === 'completed' ? 'mdi-check-circle' : 'mdi-circle-outline' }}
            </v-icon>
            <div class="flex-grow-1">
              <p class="text-body-large font-weight-medium text-on-surface">{{ goal.title }}</p>
              <v-chip
                size="x-small"
                :color="getCategoryColor(goal.category)"
                variant="tonal"
                class="mt-1"
              >
                {{ goal.category }}
              </v-chip>
            </div>
            <span class="text-label-large" :class="getProgressColor(goal.progress)">
              {{ Math.round(goal.progress * 100) }}%
            </span>
          </div>

          <v-progress-linear
            :model-value="goal.progress * 100"
            :color="goal.progress >= 0.7 ? 'success' : goal.progress >= 0.5 ? 'warning' : 'error'"
            height="6"
            class="mb-2"
          />

          <!-- Expanded milestones -->
          <v-expand-transition>
            <div v-if="expandedGoal === goal.id" class="mt-3">
              <p class="text-body-small text-on-surface-variant mb-3">{{ goal.description }}</p>
              <div class="d-flex flex-column ga-2">
                <div
                  v-for="(ms, i) in goal.milestones"
                  :key="i"
                  class="d-flex align-center ga-2"
                >
                  <v-icon
                    :color="ms.completed ? 'success' : 'outline'"
                    size="18"
                  >
                    {{ ms.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                  </v-icon>
                  <span
                    class="text-body-small"
                    :class="ms.completed ? 'text-on-surface' : 'text-on-surface-variant'"
                  >
                    {{ ms.label }}
                  </span>
                  <span v-if="ms.date" class="text-caption text-on-surface-variant ml-auto">
                    {{ formatDate(ms.date) }}
                  </span>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </div>

      <!-- Tasks -->
      <div v-if="tab === 'tasks'" class="d-flex flex-column ga-3 pb-4">
        <!-- Pending / In Progress -->
        <p class="text-label-large text-on-surface-variant mt-1">Active</p>
        <v-card
          v-for="task in activeTasks"
          :key="task.id"
          class="pa-4"
        >
          <div class="d-flex align-start ga-3">
            <v-icon
              :color="task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'on-surface-variant'"
              size="22"
              class="mt-1"
            >
              {{ task.status === 'in-progress' ? 'mdi-progress-clock' : 'mdi-checkbox-blank-circle-outline' }}
            </v-icon>
            <div class="flex-grow-1">
              <p class="text-body-large font-weight-medium text-on-surface">{{ task.title }}</p>
              <p class="text-body-small text-on-surface-variant mt-1">{{ task.description }}</p>
              <div class="d-flex align-center ga-2 mt-2">
                <v-chip size="x-small" :color="getPriorityColor(task.priority)" variant="tonal">
                  {{ task.priority }}
                </v-chip>
                <span v-if="task.dueDate" class="text-caption text-on-surface-variant">
                  Due {{ formatDate(task.dueDate) }}
                </span>
              </div>
            </div>
          </div>
        </v-card>

        <!-- Completed -->
        <p class="text-label-large text-on-surface-variant mt-3">Completed</p>
        <v-card
          v-for="task in completedTasks"
          :key="task.id"
          class="pa-4"
        >
          <div class="d-flex align-start ga-3">
            <v-icon color="success" size="22" class="mt-1">mdi-check-circle</v-icon>
            <div class="flex-grow-1">
              <p class="text-body-medium text-on-surface" style="text-decoration: line-through; opacity: 0.6">
                {{ task.title }}
              </p>
              <p class="text-body-small text-on-surface-variant">
                Completed {{ formatDate(task.completedDate) }}
              </p>
            </div>
          </div>
        </v-card>
      </div>

      <!-- Documents -->
      <div v-if="tab === 'documents'" class="d-flex flex-column ga-3 pb-4">
        <v-card
          v-for="doc in data.documents"
          :key="doc.id"
          class="pa-4"
        >
          <div class="d-flex align-center ga-3">
            <v-avatar :color="getDocColor(doc.type) + '-container'" size="40">
              <v-icon :color="getDocColor(doc.type)" size="20">{{ getDocIcon(doc.type) }}</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="d-flex align-center ga-2">
                <p class="text-body-medium font-weight-medium text-on-surface">{{ doc.title }}</p>
                <v-icon v-if="!doc.read" color="primary" size="8">mdi-circle</v-icon>
              </div>
              <p class="text-body-small text-on-surface-variant">
                {{ doc.provider }} · {{ formatDate(doc.date) }}
              </p>
            </div>
            <v-icon color="on-surface-variant" size="18">mdi-download</v-icon>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../data/metrics.json'

const tab = ref('goals')
const expandedGoal = ref<string | null>(null)

const completedGoals = computed(() =>
  data.careGoals.filter(g => g.status === 'completed').length
)

const activeTasks = computed(() =>
  data.tasks.filter(t => t.status === 'pending' || t.status === 'in-progress')
)

const completedTasks = computed(() =>
  data.tasks.filter(t => t.status === 'completed')
)

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    medication: 'info',
    monitoring: 'primary',
    'follow-up': 'tertiary',
    lifestyle: 'warning',
  }
  return colors[category] || 'primary'
}

function getProgressColor(progress: number): string {
  if (progress >= 0.7) return 'text-success'
  if (progress >= 0.5) return 'text-warning'
  return 'text-error'
}

function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    high: 'error',
    medium: 'warning',
    low: 'on-surface-variant',
  }
  return colors[priority] || 'on-surface-variant'
}

function getDocIcon(type: string): string {
  const icons: Record<string, string> = {
    'visit-summary': 'mdi-file-document-outline',
    'care-plan': 'mdi-clipboard-text-outline',
    educational: 'mdi-book-open-variant',
    'lab-results': 'mdi-flask-outline',
    form: 'mdi-file-sign',
  }
  return icons[type] || 'mdi-file-outline'
}

function getDocColor(type: string): string {
  const colors: Record<string, string> = {
    'visit-summary': 'primary',
    'care-plan': 'tertiary',
    educational: 'info',
    'lab-results': 'secondary',
    form: 'warning',
  }
  return colors[type] || 'primary'
}
</script>

<style scoped>
.care-plan-view {
  max-width: 480px;
  margin: 0 auto;
}
</style>
