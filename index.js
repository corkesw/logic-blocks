const path = "./data.txt"
const { formatData, createTable } = require("./util")

const formattedData = formatData(path).then((res) => {
    createTable(res)
})

