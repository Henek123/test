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
  let arr = [];
  for (let key in cryptoArray[0]["Time Series (Digital Currency Daily)"]) {
    if (i < 1) break;
    let myDate = new Date(key);
    arr.push([
      myDate,
      cryptoArray[0]["Time Series (Digital Currency Daily)"][`${key}`][
        "1a. open (USD)"
      ],
    ]);
    i--;
  }
  console.log(arr);
  return arr;
}
async function drawChart() {
  let arr = [...(await dataToArray())];
  console.log(arr);
  document.querySelector(".graph").innerHTML = "";
  //adding svg to container
  d3.select(".graph").append("svg");
  //.style("background-color", "red")

  //setting x scale
  const scaleX = d3
    .scaleTime()
    .domain(d3.extent(arr, (d) => d[0]))
    .range([50, 700])
    .nice();
  d3.select("svg")
    .append("g")
    .attr("transform", "translate(0, 425)")
    .call(d3.axisBottom(scaleX));

  d3.axisBottom();

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
  d3.select("svg")
    .attr("viewBox", "0 0 760 450")
    .attr("preserveAspectRatio", "xMidYMid meet");
}

const btn = document.querySelector(".btn");
const graphBox = document.querySelector(".graph-box");
const graphText = document.querySelector(".graph-text");
const button = document.querySelector(".call-api");

const filterFnc = (e) => {
  if (e.target.matches(".btn-5day")) {
    i = 5;
    drawChart();
  } else if (e.target.matches(".btn-1month")) {
    i = 30;
    drawChart();
  } else if (e.target.matches(".btn-6month")) {
    i = 180;
    drawChart();
  } else if (e.target.matches(".btn-1year")) {
    i = 365;
    drawChart();
  }
};

async function chooseCryptoFnc(e) {
  if (e.target.matches(".bitcoin")) {
  } else if (e.target.matches(".ethereum")) {
  } else if (e.target.matches(".cardano")) {
  } else if (e.target.matches(".dogecoin")) {
  } else if (e.target.matches(".polkadot")) {
  }
}
document
  .querySelector(".graph-box-filter-bar")
  .addEventListener("click", filterFnc);

document.querySelector(".btn-box").addEventListener("click", chooseCryptoFnc);
btn.addEventListener("click", getDataFromServer);
// Naprawić calla do innych btnow
// document.addEventListener("DOMContentLoaded", drawChart);
