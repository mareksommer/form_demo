export default function useFormFieldId(id?: string) {
  const formFieldId = id ? id : `form-field-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${formFieldId}-errors`
  return [formFieldId, errorId]
}
