module.exports = {
  plugins: {
    loadCsv: {
      file: 'test/testData.csv'
    },
    parseDate: {},
    parseTags: {},
    selectColumns: {
      include: [
        'date',
        'description'
      ]
    }
  }
}
