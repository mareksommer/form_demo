<template>
  <FormContainer
    :form-data="formData"
    :submit-function="submitFunction"
    :validation-schema="signupSchema"
    submit-button-text="Sign Up"
    @updated-form-data="handleFormData"
    @validation-failed="handleValidationErrors"
  >
    <TextInput
      label="Name"
      type="text"
      required
      :value="formData.name"
      :errors="errors.name"
      @value-changed="(value) => updateField('name', value)"
    />
    <TextInput
      label="Email"
      type="email"
      required
      :value="formData.email"
      :errors="errors.email"
      @value-changed="(value) => updateField('email', value)"
    />
    <TextInput
      label="Password"
      type="password"
      required
      :value="formData.password"
      :errors="errors.password"
      @value-changed="(value) => updateField('password', value)"
    />
  </FormContainer>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { ref } from 'vue'
import FormContainer from '../Form/FormContainer.vue'
import TextInput from '../Form/TextInput.vue'

type FormData = z.infer<typeof signupSchema>
type FormErrors = {
  [K in keyof FormData]?: string[]
}
const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})
const formData = ref<FormData>({
  name: '',
  email: '',
  password: '',
})
const errors = ref<FormErrors>({
  name: [],
  email: [],
  password: [],
})

const submitFunction = () => ({
  endpoint: '/auth/signup',
  method: 'POST',
})

const updateField = (field: keyof typeof formData.value, value: string) => {
  formData.value[field] = value
}

const handleFormData = (data: typeof formData.value) => {
  formData.value = data
}

const handleValidationErrors = (validationErrors: FormErrors) => {
  errors.value = validationErrors
  console.log('handleValidationErrors', errors.value)
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}
</style>
