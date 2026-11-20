export default defineEventHandler((event) => {
  if (event.path.startsWith('/.well-known/')) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found'
    })
  }
})
