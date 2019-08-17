export default {
  data() {
      return {
          m_dateOptions: {
              disabledDate: (date) => {
                  if (date.valueOf() < new Date().valueOf() - 1 * 24 * 3600 * 1000) {
                      return true;
                  }
              }
          }
      }
  },
  methods: {
      
  }
}
