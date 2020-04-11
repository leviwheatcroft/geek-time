module.exports = {
  plugins: {
    loadCsv: {
      file: 'test/testData.csv'
    },
    selectColumns: {
      include: [
        'date',
        'description'
      ]
    }
  }
}