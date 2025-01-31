<template>
  <ul :id="id" class="error-list">
    <li v-for="error in errors" :key="error" class="error-list-item">{{ error }}</li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  errors?: string[]
  id?: string
}

const props = defineProps<Props>()
const id = props.id || 'error-list'
</script>

<style scoped>
.error-list {
  list-style-type: none;
  padding: 0;
}
.error-list-item {
  color: red;
}
</style>
