export default defineAppConfig({
  ui: {
    colors: {
      primary: 'laiton',
      neutral: 'stone'
    },
    button: {
      slots: {
        base: ['cursor-pointer']
      }
    },
    dropdownMenu: {
      slots: {
        item: 'cursor-pointer'
      }
    }
  }
})
