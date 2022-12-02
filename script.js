async function getDataFromServer() {
  const url =
    "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=KIPI8OWFYIA80UQX";

  const res = await axios({
    url: url,
    json: true,
  });
  const dataArray = [res.data];
  return dataArray;
}
async function dataToArray() {
  const cryptoArray = [...(await getDataFromServer())];
  console.log(cryptoArray);
  let i = 90;
  let arr = [];
  for (let key in cryptoArray[0]["Time Series (Digital Currency Daily)"]) {
    let myDate = new Date(key);
    console.log(myDate);
    arr.push([
      myDate,
      cryptoArray[0]["Time Series (Digital Currency Daily)"][`${key}`][
        "1a. open (USD)"
      ],
    ]);
    i--;
    console.log(arr);
    return arr;
  }
}
async function drawChart() {
  let arr = [...(await dataToArray())];
  //adding svg to container
  d3.select(".graph")
    .append("svg")
    //.style("background-color", "red")
    .attr("width", 500)
    .attr("height", 450);

  //setting x scale
  const scaleX = d3
    .scaleTime()
    .domain(d3.extent(arr, (d) => d[0]))
    .range([50, 450])
    .nice();
  d3.select("svg")
    .append("g")
    .attr("transform", "translate(0, 425)")
    .call(d3.axisBottom(scaleX));

  //setting y scale
  const scaleY = d3
    .scaleLinear()
    .domain([
      d3.min(arr, (d) => d[1] - d[1] * 0.05),
      d3.max(arr, (d) => d[1]) + 5,
    ])
    .range([425, 50]);
  d3.select("svg")
    .append("g")
    .attr("transform", "translate(50, 0)")
    .call(d3.axisLeft(scaleY));

  //drawing line
  d3.select("svg")
    .append("path")
    .datum(arr)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => scaleX(d[0]))
        .y((d) => scaleY(d[1]))
    );
}

const btn = document.querySelector(".btn");
const graphBox = document.querySelector(".graph-box");
const graphText = document.querySelector(".graph-text");
const button = document.querySelector(".call-api");

const btn1Day = document.querySelector(".btn-1day");
const btn5Day = document.querySelector(".btn-5day");
const btn1Month = document.querySelector(".btn-1month");
const btn6Month = document.querySelector(".btn-6month");
const btn1Year = document.querySelector(".btn-1year");

btn.addEventListener("click", getDataFromServer);
btn1Year.addEventListener("click", drawChart);
