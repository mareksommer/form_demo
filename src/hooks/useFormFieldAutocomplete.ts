export default function useFormFieldAutocomplete(autocomplete?: string, type?: string) {
  if (autocomplete) return autocomplete
  if (type === 'email') return 'email'
  if (type === 'password') return 'current-password'
  if (type === 'name') return 'given-name'
  return 'off'
}
