export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    },
    button: {
      slots: {
        base: ['cursor-pointer'],
      }
    },
    dropdownMenu: {
      slots: {
        item: 'cursor-pointer',
      },
    },
  }
})
