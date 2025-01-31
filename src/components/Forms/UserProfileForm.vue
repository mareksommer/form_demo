<template>
  <FormContainer
    :form-data="formData"
    :submit-function="submitFunction"
    :fetch-function="fetchFunction"
    :validation-schema="userProfileSchema"
    submit-button-text="Update Profile"
    @updated-form-data="handleFormData"
    @validation-failed="handleValidationErrors"
  >
    <TextInput
      type="text"
      :value="formData.name"
      label="Name"
      required
      :errors="errors.name"
      @value-changed="(value) => updateField('name', value)"
    />

    <TextInput
      type="email"
      :value="formData.email"
      label="Email"
      required
      :errors="errors.email"
      @value-changed="(value) => updateField('email', value)"
    />

    <FileInput
      label="Profile Avatar"
      accept="image/*"
      :errors="errors.avatar"
      @value-changed="(value) => updateField('avatar', value)"
    />

    <TextInput
      type="tel"
      :value="formData.phone"
      label="Phone Number"
      :errors="errors.phone"
      @value-changed="(value) => updateField('phone', value)"
    />

    <CheckBox
      :checked="formData.newsletterConsent"
      :value="formData.newsletterConsent"
      label="I want to receive email newsletters"
      @value-changed="(value) => updateField('newsletterConsent', value)"
    />
  </FormContainer>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { ref } from 'vue'
import FormContainer from '../Form/FormContainer.vue'
import TextInput from '../Form/TextInput.vue'
import FileInput from '../Form/FileInput.vue'
import CheckBox from '../Form/CheckBox.vue'

type FormData = z.infer<typeof userProfileSchema>
type FormErrors = {
  [K in keyof FormData]?: string[]
}
const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  avatar: z
    .object({
      base64: z.string(),
      filename: z.string(),
    })
    .optional(),
  phone: z.string().optional(),
  newsletterConsent: z.boolean().optional(),
})

const formData = ref<FormData>({
  name: '',
  email: '',
  avatar: undefined,
  phone: '',
  newsletterConsent: false,
})

const errors = ref<FormErrors>({})

const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
  console.log('updateField', field, value)
  formData.value[field] = value
  console.log('formData', formData.value)
}

const fetchFunction = () => ({
  endpoint: '/user/',
  method: 'GET',
})

const submitFunction = () => ({
  endpoint: '/user/',
  method: 'POST',
})

const handleFormData = (data: typeof formData.value) => {
  formData.value = data
}

const handleValidationErrors = (validationErrors: FormErrors) => {
  errors.value = validationErrors
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.submit-button {
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
