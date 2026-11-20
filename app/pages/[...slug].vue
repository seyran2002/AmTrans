<script setup lang="ts">
import { createError, showError } from '#imports'

showError(createError({
  statusCode: 404,
  statusMessage: 'Page Not Found'
}))
</script>

<template>
  <div />
</template>
