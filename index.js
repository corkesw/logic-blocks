const path = "./data.txt"
const { formatData } = require("./util")

const formattedData = formatData(path).then((res) => {
    console.log(res)
})

