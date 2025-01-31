import { computed } from 'vue'

export default function useIsValidField(errors: string[]) {
  return computed(() => {
    if (!errors) return true
    return errors.length === 0
  })
}
