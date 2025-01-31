<template>
  <div class="form-field">
    <label class="checkbox-label">
      <input
        type="checkbox"
        :id="id"
        :checked="value"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!isValid"
        :aria-describedby="errors ? errorId : undefined"
        @change="updateValue"
      />
      <span v-if="label">{{ label }}</span>
    </label>
    <ErrorList :errors="errors" :id="errorId" />
  </div>
</template>

<script setup lang="ts">
import useFormFieldId from '../../hooks/useFormFieldId'
import useIsValidField from '../../hooks/useIsValidField'
import ErrorList from '../ErrorList.vue'

interface Props {
  value?: boolean | undefined
  label?: string
  disabled?: boolean
  required?: boolean
  errors?: string[]
  id?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['value-changed'])

const [id, errorId] = useFormFieldId(props.id)
const isValid = useIsValidField(props.errors || [])
const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('value-changed', target.checked)
}
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label input[type='checkbox'] {
  width: 1rem;
  height: 1rem;
}

.checkbox-label input[type='checkbox']:disabled {
  cursor: not-allowed;
}

.checkbox-label input[type='checkbox']:disabled + span {
  color: #666;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  font-size: 0.875rem;
}
</style>
