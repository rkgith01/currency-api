const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const PORT = process.env.PORT || 8000;


let heading = "Currencies API"
let data = "This is an API page to get data for currency and cryptocurrencies";
let endpointInfo = ` <ul>
<li>
  <a href="/currency" target="_blank"> <strong>/currency</strong>: </a>Fetches
  currency data from Google.
</li>
<li>
  <a href="/crypto" target="_blank"><strong>/crypto</strong>:</a> Fetches
  cryptocurrency data from Google.
</li>
<li>
  <a href="/crypto25" target="_blank"><strong>/crypto25</strong>:</a> Fetches
  cryptocurrency data (limited to 25) from Yahoo.
</li>
<li>
  <a href="/crypto10" target="_blank"><strong>/crypto10</strong>:</a> Fetches
  cryptocurrency data (limited to 10) from CoinMarketCap.
</li>
</ul>`
let imgLogo = "/logo1.png"
let imgLogo1 = "/mainlogo.png"


const currencyItems = [
  {
    name: "Google currencies ",
    address: "https://www.google.com/finance/markets/currencies",
  },
  {
    name: "Google crypto ",
    address: "https://www.google.com/finance/markets/cryptocurrencies",
  },
  {
    name: "Yahoo crypto ",
    address: "https://finance.yahoo.com/crypto?offset=0&count=100",
  },
  {
    name: "Coin market crypto ",
    address: "https://coinmarketcap.com",
  },
];



app.use(express.static("public"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Functions to fetch currency & crypto data
const googleCurrencyData = async () => {
  try {
    const response = await axios.get(currencyItems[0].address);
    const html = response.data;
    const $ = cheerio.load(html);

    const currencyList = [];

    //google currency data working
    $("li > a").each((i, element) => {
      const title = $(element).find(".ZvmM7").text().trim();
      const price = $(element).find(".YMlKec").text().trim();
      const change = $(element).find(".P2Luy").text().trim();

      currencyList.push({
        title: title,
        price: price,
        change: change,
      });
    });

    return currencyList;
  } catch (error) {
    throw new Error("Error fetching currency data");
  }
};

const googleCryptoData = async () => {
  try {
    const response = await axios.get(currencyItems[1].address);
    const html = response.data;
    const $ = cheerio.load(html);

    const currencyList = [];

    // google crypto data working
    $("div.SxcTic").each((i, element) => {
      const cryptoCode = $(element).find(".COaKTb").text().trim();
      const name = $(element).find(".ZvmM7").text().trim();
      const price = $(element).find(".YMlKec").text().trim();
      const priceChange = $(element).find(".P2Luy").text().trim();

      currencyList.push({
        cryptoCode: cryptoCode,
        Name: name,
        price: price,
        priceChange: priceChange,
      });
    });

    return currencyList;
  } catch (error) {
    throw new Error("Error fetching currency data");
  }
};

const yahooCryptoData = async () => {
  try {
    const response = await axios.get(currencyItems[2].address);
    const html = response.data;
    const $ = cheerio.load(html);

    const currencyList = [];

    // yahoo data working upto 25 entries
    $("tbody > tr").each((i, element) => {
      const $td = $(element).find("td");
      const symbol = $td.eq(0).find("a").text();
      const name = $td.eq(1).text();
      const price = $(element)
        .find('td[aria-label="Price (Intraday)"] fin-streamer')
        .attr("value");
      // const price = $(element).find('td[aria-label="Price (Intraday)"] > fin-streamer > span > text').text();
      const change = $td.eq(3).find("span").text();
      const changePercent = $td.eq(4).find("span").text();
      const marketCap = $td.eq(5).find("span").text();
      const volume24h = $td.eq(6).text();
      const volumeTotal = $td.eq(7).text();
      const circulatingSupply = $td.eq(9).text();

      currencyList.push({
        symbol: symbol,
        name: name,
        price: price,
        change: change,
        changePercent: changePercent,
        marketCap: marketCap,
        volume24h: volume24h,
        volumeTotal: volumeTotal,
        circulatingSupply: circulatingSupply,
      });
    });

    return currencyList;
  } catch (error) {
    throw new Error("Error fetching currency data");
  }
};
const coinCryptoData = async () => {
  try {
    const response = await axios.get(currencyItems[3].address);
    const html = response.data;
    const $ = cheerio.load(html);

    const currencyList = [];

    // crypto coin
    $("tbody > tr").each((i, element) => {
      const rank = $(element).find("td:nth-child(2) > p").text();
      const name = $(element).find("td:nth-child(3) .coin-item-symbol").text();
      const logo = $(element).find("td:nth-child(3) .coin-logo").attr("src");
      const price = $(element).find("td:nth-child(4) span").text();
      const marketCap = $(element)
        .find("td:nth-child(8) .sc-7bc56c81-0")
        .text();
      const volume = $(element).find("td:nth-child(9) p").text();
      const circulatingSupply = $(element)
        .find("td:nth-child(10) .sc-4984dd93-0")
        .text();

      currencyList.push({
        rank: rank,
        name: name,
        logo: logo,
        price: price,
        marketCap: marketCap,
        volume: volume,
        circulatingSupply: circulatingSupply,
      });
    });
    // Extracting data from the table crtpto coin
    // $("tbody > tr").each((i, row) => {
    //   // Extracting data from each row
    //   const name = $(row).find("td").eq(2).find("p").text().trim();
    //   const symbol = $(row)
    //     .find("td")
    //     .eq(2)
    //     .find(".coin-item-symbol")
    //     .text()
    //     .trim();
    //   const price = $(row).find("td").eq(3).find("span").text().trim();
    //   const change24h = $(row).find("td").eq(4).text().trim();
    //   const change7d = $(row).find("td").eq(5).text().trim();
    //   const marketCap = $(row)
    //     .find("td")
    //     .eq(7)
    //     .find("span")
    //     .first()
    //     .text()
    //     .trim();
    //   const volume24h = $(row).find("td").eq(8).find("p").text().trim();
    //   const circulatingSupply = $(row).find("td").eq(9).find("p").text().trim();

    //   currencyList.push({
    //     name,
    //     symbol,
    //     price,
    //     change24h,
    //     change7d,
    //     marketCap,
    //     volume24h,
    //     circulatingSupply,
    //   });
    // });

    return currencyList ? currencyList.slice(0, 10) : [];
  } catch (error) {
    throw new Error("Error fetching currency data");
  }
};

// home route
app.get("/", (req, res) => {
  try {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.png" />
        <title>Currencies API</title>
        <!-- Bootstrap CSS -->
        <link
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <!-- Custom CSS -->
        <link href="" rel="stylesheet" />

        <style>
          /* Additional CSS for full page height */
          html, body {
            height: 100%;
          }
          body {
            background-color: #343a40;
            color: #fff;
          }
          .main-logo {
            width: 200px;
            height: 200px;
          }
          .footer-logo{
            width: 100px;
            height: 100px;
          }
          .content-section {
            margin-top: 50px;
          }
          .endpoint-info {
            margin-top: 20px;
          }
          .buy-upgrade-link {
            color: #ffc107;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-12 text-center">
              <a href="/">
                <img
                src=${imgLogo}
                class="main-logo bg-secondary border rounded-circle"
                alt="main logo"
                />
              </a>
            <h1 class="mt-4">${heading}</h1>
              <p class="lead">${data}</p>
              <p class="mb-4">
                Usage Info: This API provides data on currencies and
                cryptocurrencies from various sources. You can access currency data
                and crypto data through different endpoints.
              </p>
            </div>
          </div>
            <div class="row justify-content-center">
              <p>Endpoints:</p>
               ${endpointInfo}
              
            </div>
            <p>Try going to any of the paths mentioned above to retrieve data.</p>
            <div class="row content-section">
              <div class="col-md-12">
                <h2 class="text-center">Endpoints Pricing</h2>
                <ul class="list-unstyled">
                  <li>
                    <a href="/currency" target="_blank"><strong>/currency</strong></a>: Fetches currency data from Google.
                    <ul class="endpoint-info">
                      <li>Rate Limit: 1000 requests per month</li>
                      <li>Pricing Plan: Free</li>
                      <li><a href="#" class="buy-upgrade-link">Buy or Upgrade to Paid Plan</a></li>
                    </ul>
                  </li>
                  <li>
                    <a href="/crypto" target="_blank"><strong>/crypto</strong></a>: Fetches cryptocurrency data from Google.
                    <ul class="endpoint-info">
                      <li>Rate Limit: 1000 requests per month</li>
                      <li>Pricing Plan: Free</li>
                      <li><a href="#" class="buy-upgrade-link">Buy or Upgrade to Paid Plan</a></li>
                    </ul>
                  </li>
                  <li>
                    <a href="/crypto25" target="_blank"><strong>/crypto25</strong></a>: Fetches cryptocurrency data (limited to 25) from Yahoo.
                    <ul class="endpoint-info">
                      <li>Rate Limit: 500 requests per month</li>
                      <li>Pricing Plan: Basic (Free Tier: 50 requests per month, Premium Tier: Unlimited)</li>
                      <li><a href="#" class="buy-upgrade-link">Buy or Upgrade to Premium Plan</a></li>
                    </ul>
                  </li>
                  <li>
                    <a href="/crypto10" target="_blank"><strong>/crypto10</strong></a>: Fetches cryptocurrency data (limited to 10) from CoinMarketCap.
                    <ul class="endpoint-info">
                      <li>Rate Limit: 100 requests per month</li>
                      <li>Pricing Plan: Basic (Free Tier: 100 requests per month, Premium Tier: Unlimited)</li>
                      <li><a href="#" class="buy-upgrade-link">Buy or Upgrade to Premium Plan</a></li>
                    </ul>
                  </li>
                </ul>
                <p class="mt-4">Note: Please adhere to the rate limits to ensure smooth operation of the API.</p>
                <p>Try going to any of the paths mentioned above to retrieve data.</p>
              </div>
            </div>

            <div class="footer mt-4 text-center text-primary">
            <img src=${imgLogo1} class="footer-logo rounded-circle" alt="main logo"/>
            <p>This API is developed by Raj Kapadia &copy; 2024</p>
          </div>
          </div>
        <!-- Bootstrap JS -->
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      </body>
    </html>
    
    `;
    res.send(html);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/currency", async (req, res) => {
  try {
    const currencyData = await googleCurrencyData();
    // console.log(currencyData.length);
    res.json(currencyData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
// google crypto
app.get("/crypto", async (req, res) => {
  try {
    const currencyData = await googleCryptoData();
    // console.log(currencyData.length);
    res.json(currencyData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
// yahoo 25 crypto
app.get("/crypto25", async (req, res) => {
  try {
    const currencyData = await yahooCryptoData();
    // console.log(currencyData.length);
    res.json(currencyData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
// coinmarket 10 crypto
app.get("/crypto10", async (req, res) => {
  try {
    const currencyData = await coinCryptoData();
    // console.log(currencyData.length);
    res.json(currencyData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
