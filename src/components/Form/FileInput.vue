<template>
  <div class="form-field">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      type="file"
      :accept="accept"
      :disabled="disabled"
      :required="required"
      :multiple="multiple"
      :aria-invalid="!isValid"
      :aria-describedby="errors ? errorId : undefined"
      @change="updateValue"
    />
    <ErrorList :errors="errors" :id="errorId" />
  </div>
</template>

<script setup lang="ts">
import useFormFieldId from '../../hooks/useFormFieldId'
import useIsValidField from '../../hooks/useIsValidField'
import ErrorList from '../ErrorList.vue'

interface Props {
  label?: string
  accept?: string
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  errors?: string[]
  id?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['value-changed'])

const [id, errorId] = useFormFieldId(props.id)
const isValid = useIsValidField(props.errors || [])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  const file = files?.[0]

  // get base64
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    emit('value-changed', { base64: reader.result, filename: file?.name })
  }
}
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
}

input[type='file'] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input[type='file']:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
