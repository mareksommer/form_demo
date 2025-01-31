<template>
  <div class="form-field">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocompleteVal"
      :aria-invalid="!isValid"
      :aria-describedby="errors ? errorId : undefined"
      @input="updateValue"
    />
    <ErrorList :errors="errors" :id="errorId" />
  </div>
</template>

<script setup lang="ts">
import useFormFieldId from '../../hooks/useFormFieldId'
import useFormFieldAutocomplete from '../../hooks/useFormFieldAutocomplete'
import useIsValidField from '../../hooks/useIsValidField'
import ErrorList from '../ErrorList.vue'

interface Props {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  value?: string | number | null | undefined
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  errors?: string[]
  id?: string
  autocomplete?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['value-changed'])

const type = props.type || 'text'
const [id, errorId] = useFormFieldId(props.id)
const autocompleteVal = useFormFieldAutocomplete(props.autocomplete, type)

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('value-changed', target.value)
}

const isValid = useIsValidField(props.errors || [])
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

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  font-size: 0.875rem;
}
</style>
