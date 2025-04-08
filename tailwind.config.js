module.exports = {
    content: [
      './src/**/*.{js,jsx}',
      './build/**/*.js'
    ],
    important: '#wp-todo-app', // Scopes styles to your plugin
    theme: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    }
}