<template>
  <form ref="form" @submit.prevent="submit" :novalidate="novalidate" enctype="multipart/form-data">
    <ErrorList :errors="errors" />
    <slot />
    <button type="submit">{{ submitButtonText }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiService, type FetchResponse } from '../../utils/fetch'
import type { ZodSchema, ZodIssue } from 'zod'
import ErrorList from '../ErrorList.vue'

type Props<T = unknown> = {
  formData: T
  fetchFunction?: () => {
    endpoint: string
    method?: string
    headers?: HeadersInit
  } | null
  submitFunction: () => {
    endpoint: string
    method?: string
    headers?: HeadersInit
  }
  validationSchema?: ZodSchema
  submitButtonText?: string
}

const emit = defineEmits([
  'form-submitted',
  'updated-form-data',
  'form-fetched',
  'validation-failed',
  'form-submitted-error',
])
const props = defineProps<Props>()

const form = ref<HTMLFormElement | null>(null)
const errors = ref<string[]>([])
const submit = async () => {
  if (!validateForm()) return
  const { endpoint, method, headers } = props.submitFunction()
  console.log('submitting form', props.formData)
  const response = await apiService.post(endpoint, props.formData, {
    method: method || 'POST',
    headers: headers || {},
  })

  if (response.error) return handleSubmitError(response)

  emitFormSubmitted(response)
}

const handleSubmitError = (response: FetchResponse<unknown>) => {
  errors.value.push(response.error?.message || 'An error occurred')
  emit('form-submitted-error', errors.value)
}

const emitFormSubmitted = (response: FetchResponse<unknown>) => {
  emit('form-submitted', response)
  emit('updated-form-data', response.data)
}

const validateForm = () => {
  if (!props.validationSchema) return true

  const validationResult = props.validationSchema.safeParse(props.formData)

  if (!validationResult.success)
    emit('validation-failed', getErrorsFromValidationResult(validationResult.error.issues))

  return validationResult.success
}

const getErrorsFromValidationResult = (errors: ZodIssue[]) => {
  if (!errors) return []
  return errors.reduce((acc: Record<string, string[]>, error: ZodIssue) => {
    acc[error.path.join('.')] = [...(acc[error.path.join('.')] || []), error.message]
    return acc
  }, {})
}

const fetchData = async () => {
  if (!props.fetchFunction) return

  const fetchOptions = props.fetchFunction()
  if (!fetchOptions) return
  const { endpoint, method, headers } = fetchOptions
  const response = await apiService.get(endpoint, {
    method: method || 'GET',
    headers: headers || {},
  })

  if (response.error) return console.error('Error submitting form:', response.error)

  emit('form-fetched', response)
  emit('updated-form-data', response.data)
}

const novalidate = ref(false)

onMounted(() => {
  fetchData()
  novalidate.value = true
})

const submitButtonText = computed(() => props.submitButtonText || 'Submit')
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  margin-top: 1rem;
  background-color: #fff;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>
