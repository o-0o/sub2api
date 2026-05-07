<template>
  <AppLayout>
    <div class="mx-auto max-w-4xl space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('imageGen.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-dark-400">
          {{ t('imageGen.subtitle') }}
        </p>
        <!-- Balance Display -->
        <div v-if="userBalance !== null" class="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-sm">
          <span class="text-gray-500 dark:text-dark-400">{{ t('imageGen.yourBalance') }}:</span>
          <span class="font-semibold" :class="userBalance >= estimatedCost ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            ¥{{ userBalance.toFixed(2) }}
          </span>
          <span class="text-gray-400">|</span>
          <span class="text-gray-500 dark:text-dark-400">{{ t('imageGen.estimatedCost') }}:</span>
          <span class="font-medium text-primary-600 dark:text-primary-400">¥{{ estimatedCost.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Template Selection -->
      <div class="card p-4">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-700 dark:text-dark-200">
            {{ t('imageGen.templates') }}
          </h3>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              :class="[
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                selectedCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-700 dark:text-dark-300 dark:hover:bg-dark-600'
              ]"
            >
              {{ getCategoryName(cat) }}
            </button>
          </div>
        </div>

        <!-- Template Grid -->
        <div class="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
          <div
            v-for="template in filteredTemplates"
            :key="template.id"
            @click="selectTemplate(template)"
            :class="[
              'group cursor-pointer rounded-lg border-2 p-1 transition-all',
              selectedTemplate?.id === template.id
                ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                : 'border-transparent bg-gray-50 hover:border-primary-200 hover:bg-gray-100 dark:bg-dark-700 dark:hover:border-primary-700 dark:hover:bg-dark-600'
            ]"
          >
            <div class="aspect-square overflow-hidden rounded-md bg-gray-200 dark:bg-dark-800">
              <img
                :src="template.previewUrl"
                :alt="locale === 'zh' ? template.nameZh : template.name"
                class="h-full w-full object-cover transition-transform group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div class="mt-1 text-center">
              <span class="text-xs text-gray-600 dark:text-dark-300 line-clamp-1">
                {{ locale === 'zh' ? template.nameZh : template.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Generation Form -->
      <div class="card p-6 space-y-4">
        <!-- Selected Template Preview -->
        <div v-if="selectedTemplate" class="mb-3 rounded-lg border border-primary-200 overflow-hidden dark:border-primary-800">
          <div class="w-full h-64 bg-gray-100 dark:bg-dark-700 flex items-center justify-center">
            <img
              :src="selectedTemplate.previewUrl"
              :alt="locale === 'zh' ? selectedTemplate.nameZh : selectedTemplate.name"
              class="max-w-full max-h-full object-contain"
            />
          </div>
          <div class="bg-primary-50 px-3 py-2 dark:bg-primary-900/20">
            <div class="text-sm font-medium text-primary-700 dark:text-primary-300">
              {{ locale === 'zh' ? selectedTemplate.nameZh : selectedTemplate.name }}
            </div>
            <div class="text-xs text-primary-600 dark:text-primary-400 mt-0.5 truncate">
              {{ locale === 'zh' ? selectedTemplate.promptZh : selectedTemplate.prompt }}
            </div>
          </div>
        </div>

        <!-- API Key Selector -->
        <div>
          <label class="input-label">{{ t('imageGen.apiKey') }}</label>
          <select v-model="selectedApiKeyId" class="input">
            <option value="">{{ t('imageGen.selectApiKey') }}</option>
            <option v-for="key in apiKeys" :key="key.id" :value="String(key.id)">
              {{ key.name }} ({{ key.group?.name || t('imageGen.noGroup') }})
            </option>
          </select>
          <p v-if="apiKeys.length === 0" class="mt-1 text-xs text-gray-500">
            {{ t('imageGen.noApiKeyHint') }}
            <router-link to="/keys" class="text-primary-500 hover:underline">{{ t('imageGen.createApiKey') }}</router-link>
          </p>
        </div>

        <!-- Reference Image -->
        <div>
          <label class="input-label">{{ t('imageGen.referenceImage') }}</label>
          <div
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
              referenceImage ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 hover:border-primary-400 dark:border-dark-600 dark:hover:border-primary-500'
            ]"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />
            <div v-if="referenceImagePreview">
              <img :src="referenceImagePreview" class="max-h-32 mx-auto rounded-lg object-contain" />
              <p class="mt-2 text-xs text-gray-500">{{ referenceImage?.name }}</p>
            </div>
            <div v-else>
              <Icon name="photo" size="lg" class="mx-auto text-gray-400" />
              <p class="mt-1 text-sm text-gray-500">{{ t('imageGen.uploadHint') }}</p>
            </div>
          </div>
          <p v-if="fileTooLarge" class="mt-1 text-xs text-red-500">{{ t('imageGen.fileTooLarge') }}</p>
          <button v-if="referenceImage" @click="clearReferenceImage" class="mt-1 text-xs text-gray-400 hover:text-gray-600">
            {{ t('imageGen.removeImage') }}
          </button>
        </div>

        <!-- Model & Size Row -->
        <div class="flex flex-wrap gap-4">
          <div class="min-w-[120px] flex-1">
            <label class="input-label">{{ t('imageGen.model') }}</label>
            <select v-model="form.model" class="input">
              <option value="gpt-image-2">GPT Image 2</option>
              <option value="dall-e-3">DALL-E 3</option>
            </select>
          </div>
          <div class="min-w-[120px] flex-1">
            <label class="input-label">{{ t('imageGen.size') }}</label>
            <select v-model="form.size" class="input">
              <option value="1024x1024">1024×1024</option>
              <option value="1024x1792">1024×1792</option>
              <option value="1792x1024">1792×1024</option>
              <option value="1024x1536">1024×1536</option>
              <option value="1536x1024">1536×1024</option>
              <option value="2048x2048">2048×2048</option>
            </select>
          </div>
          <div class="min-w-[80px] flex-1">
            <label class="input-label">{{ t('imageGen.n') }}</label>
            <select v-model="form.n" class="input">
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="4">4</option>
            </select>
          </div>
          <div class="min-w-[80px] flex-1">
            <label class="input-label">{{ t('imageGen.quality') }}</label>
            <select v-model="form.quality" class="input">
              <option value="standard">Standard</option>
              <option value="hd">HD</option>
            </select>
          </div>
        </div>

        <!-- Prompt -->
        <div>
          <div class="flex items-center justify-between">
            <label class="input-label">{{ t('imageGen.promptLabel') }}</label>
            <button
              v-if="selectedTemplate"
              @click="resetToTemplate"
              class="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400"
            >
              {{ t('imageGen.resetToTemplate') }}
            </button>
          </div>
          <textarea
            v-model="form.prompt"
            rows="4"
            class="input resize-none"
            :placeholder="t('imageGen.promptPlaceholder')"
          ></textarea>
        </div>

        <!-- Generate Button -->
        <button
          @click="generate"
          :disabled="loading || !form.prompt.trim() || !selectedApiKeyId || (userBalance !== null && userBalance < estimatedCost)"
          class="btn btn-primary w-full"
        >
          <Icon v-if="loading" name="refresh" size="sm" class="mr-2 animate-spin" />
          <span v-else class="mr-2 text-lg font-medium">+</span>
          {{ loading ? t('imageGen.generating') : (userBalance !== null && userBalance < estimatedCost ? t('imageGen.insufficientBalance') : t('imageGen.generate')) }}
        </button>
      </div>

      <!-- Results -->
      <div v-if="images.length > 0" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-medium text-gray-600 dark:text-dark-300">
            {{ t('imageGen.generatedImages', { n: images.length }) }}
          </h2>
          <button @click="clearResults" class="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
            {{ t('imageGen.clear') }}
          </button>
        </div>
        <div class="grid gap-4" :class="images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'">
          <div
            v-for="(img, i) in images"
            :key="i"
            class="group relative overflow-hidden rounded-xl bg-gray-100 dark:bg-dark-800"
          >
            <img
              v-if="img.url"
              :src="img.url"
              :alt="t('imageGen.generatedImage', { n: i + 1 })"
              class="w-full object-cover"
            />
            <img
              v-else-if="img.b64_json"
              :src="`data:image/png;base64,${img.b64_json}`"
              :alt="t('imageGen.generatedImage', { n: i + 1 })"
              class="w-full object-cover"
            />
            <!-- Hover overlay with download -->
            <div class="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <div class="flex w-full gap-2 p-3">
                <a
                  v-if="img.url"
                  :href="img.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 rounded-lg bg-white/90 px-3 py-1.5 text-center text-xs font-medium text-gray-800 backdrop-blur-sm hover:bg-white"
                >
                  {{ t('imageGen.open') }}
                </a>
                <button
                  v-if="img.b64_json"
                  @click="downloadImage(img.b64_json, i)"
                  class="flex-1 rounded-lg bg-white/90 px-3 py-1.5 text-center text-xs font-medium text-gray-800 backdrop-blur-sm hover:bg-white"
                >
                  {{ t('imageGen.download') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
        {{ errorMsg }}
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores'
import AppLayout from '@/components/layout/AppLayout.vue'
import Icon from '@/components/icons/Icon.vue'
import { generateImage, IMAGE_TEMPLATES, type ImageTemplate } from '@/api/images'
import { list as listApiKeys } from '@/api/keys'
import type { ApiKey } from '@/types'

const { t, locale } = useI18n()
const appStore = useAppStore()

const loading = ref(false)
const errorMsg = ref('')
const images = ref<Array<{ url?: string; b64_json?: string }>>([])
const selectedTemplate = ref<ImageTemplate | null>(null)
const selectedCategory = ref('all')

// API Key selection
const apiKeys = ref<ApiKey[]>([])
const selectedApiKeyId = ref('')
const userBalance = ref<number | null>(null)

// Get user balance from auth store
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

// Initialize balance from auth store
userBalance.value = authStore.user?.balance ?? null

// Reference image
const fileInputRef = ref<HTMLInputElement | null>(null)
const referenceImage = ref<File | null>(null)
const referenceImagePreview = ref('')
const fileTooLarge = ref(false)

const form = reactive({
  model: 'gpt-image-2',
  prompt: '',
  size: '1024x1024',
  n: 1,
  quality: 'standard',
})

// Estimated cost: fixed 0.5 yuan per generation
const estimatedCost = computed(() => {
  const count = form.n || 1
  return 0.5 * count
})

// Get selected API key object
const selectedApiKey = computed(() => {
  if (!selectedApiKeyId.value) return null
  return apiKeys.value.find(k => k.id === Number(selectedApiKeyId.value)) || null
})

const categories = computed(() => {
  const cats = new Set(IMAGE_TEMPLATES.map(t => t.category))
  return ['all', ...Array.from(cats)]
})

const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') {
    return IMAGE_TEMPLATES
  }
  return IMAGE_TEMPLATES.filter(t => t.category === selectedCategory.value)
})

const categoryNames: Record<string, string> = {
  all: '全部',
  infographic: '信息图',
  poster: '海报',
  ui: 'UI界面',
  illustration: '插画',
  photo: '摄影',
  product: '产品',
  character: '角色',
  game: '游戏',
  sticker: '贴纸',
  scene: '场景',
  special: '特殊',
}

function getCategoryName(cat: string) {
  return categoryNames[cat] || cat
}

function selectTemplate(template: ImageTemplate) {
  selectedTemplate.value = template
  if (locale.value === 'zh' && template.promptZh) {
    form.prompt = template.promptZh
  } else {
    form.prompt = template.prompt
  }
  if (template.size) {
    form.size = template.size
  }
  if (template.quality) {
    form.quality = template.quality
  }
}

function resetToTemplate() {
  if (selectedTemplate.value) {
    selectTemplate(selectedTemplate.value)
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event: DragEvent) {
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

function processFile(file: File) {
  fileTooLarge.value = false
  if (file.size > 10 * 1024 * 1024) {
    fileTooLarge.value = true
    return
  }
  referenceImage.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    referenceImagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function clearReferenceImage() {
  referenceImage.value = null
  referenceImagePreview.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

onMounted(async () => {
  try {
    const response = await listApiKeys(1, 100, { status: 'active' })
    apiKeys.value = response.items || []
    // Auto-select first key if only one
    if (apiKeys.value.length === 1) {
      selectedApiKeyId.value = String(apiKeys.value[0].id)
    }
  } catch (e) {
    console.error('Failed to fetch API keys:', e)
  }
})

async function generate() {
  if (!form.prompt.trim()) return
  if (!selectedApiKeyId.value) {
    errorMsg.value = t('imageGen.selectApiKeyFirst')
    return
  }
  loading.value = true
  errorMsg.value = ''
  images.value = []

  try {
    const res = await generateImage({
      model: form.model,
      prompt: form.prompt,
      size: form.size as any,
      n: form.n,
      quality: form.quality as any,
      image: referenceImage.value || undefined,
      apiKey: selectedApiKey.value?.key,
    })
    images.value = res.data || []
  } catch (err: unknown) {
    const e = err as { message?: string; response?: { data?: { message?: string; detail?: string; code?: string } } }
    const errorDetail = e.response?.data?.detail || e.response?.data?.message || e.message || 'Generation failed'
    const errorCode = e.response?.data?.code
    if (errorCode === 'INVALID_API_KEY') {
      errorMsg.value = t('imageGen.invalidApiKey')
    } else {
      errorMsg.value = errorDetail
    }
    appStore.showError(errorMsg.value)
  } finally {
    loading.value = false
  }
}

function clearResults() {
  images.value = []
  errorMsg.value = ''
}

function downloadImage(b64: string, index: number) {
  const link = document.createElement('a')
  link.href = `data:image/png;base64,${b64}`
  link.download = `generated-${Date.now()}-${index + 1}.png`
  link.click()
}
</script>