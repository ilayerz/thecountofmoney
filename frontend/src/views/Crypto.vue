<template>
  <div class="container-fluid">

    <div >
      <div class="column">
        <div class="" style="padding-bottom: 35px">

          <img width="150" :src="image"/>
          <h1 class="display-4 ">
            <strong>{{ $route.params.cpid }}</strong>
          </h1>
        </div>
        <div>
          <table class="table-center">
            <thead>
            <tr role="row">
              <th></th>
              <th>Value</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td width="30%" class="">Open</td>
              <td>
                {{ open }} €
              </td>
            </tr>
            <tr>
              <td width="30%">High</td>
              <td> {{ high }} €</td>
            </tr>
            <tr>
              <td width="30%">Low</td>
              <td> {{ low }} €</td>
            </tr>
            <tr>
              <td width="30%">Previous Close</td>
              <td> {{ prevClose }} €</td>

            </tr>
            </tbody>
          </table>
        </div>
        <i>Donnée pour le {{ date }}</i>
        <div>
          <table class="table-center">
            <thead>
            <tr role="row">
              <th></th>
              <th>1 Week</th>
              <th>1 Month</th>
              <th>2 Months</th>
            </tr>
            </thead>
            <tbody>

            <tr role="row">
              <td width="30%">Highest</td>
              <td>{{ highestWeek }}</td>
              <td>{{ highestMonth }}</td>
              <td>{{ highestTwoMonth }}</td>
            </tr>
            <tr role="row">
              <td width="30%">Lowest</td>
              <td>{{ lowestWeek }}</td>
              <td>{{ lowestMonth }}</td>
              <td>{{ lowestTwoMonth }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="column" style="padding-top: 5%">
        <div include="form-input-select()">
          <label> Period:
            <select @change="changeFilter($event)" required>
              <option value="minute"
                      hidden
              >minute
              </option>

              <option value="minute">minute</option>
              <option value="hourly">hourly</option>
              <option value="daily">daily</option>
            </select>
          </label>
        </div>
        <div class="center">

          <VueApexCharts ref="realtimeChart" width="850" type="line" :options="options" :series="series"></VueApexCharts>
        </div>


      </div>

    </div>
  </div>


</template>

<script>
const axios = require('axios').default;
import VueApexCharts from "vue3-apexcharts";
// @ is an alias to /src

export default {
  name: 'Crypto',
  components: {
    VueApexCharts
  },
  data: function() {
    return {
      options: {
        chart: {
          id: 'crypto-chart'
        },
        xaxis: {
          categories: this.categories
        }
      },
      series: [{
        name: this.$route.params.cpid + '-value',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }],
      categories: [],
      sincePrevious: 0,
      sinceOpen: 0,
      open: 0,
      high: 0,
      low: 0,
      date: "-",
      prevClose: 0,
      highestWeek: 0,
      highestMonth: 0,
      highestTwoMonth: 0,
      lowestWeek: 0,
      lowestMonth: 0,
      lowestTwoMonth: 0,
      image: null,
      filter: "minute"
    }
  },
  created() {
    this.interval = setInterval(() => this.getCrypto(), 60000);
  },
  methods : {
    changeFilter(e) {
      this.filter = e.target.value;
      this.getCrypto();
    },
    async getCrypto() {
      if(this.$route.name !== "Crypto") {
        clearInterval(this.interval);
        return;
      }
      let crypto = this.$route.params.cpid;
      let error = false;
      let resultImage = await axios.get('http://localhost:3001/cryptos/'+crypto.toUpperCase()+'').catch(() => {
        error = true;
        return;
      })

      if(error) {
        await this.$router.push({
          name: 'Home',
          params: { errors: "crypto", crypto: crypto.toUpperCase()}
        });
        return;
      }


      let result = await axios.get('http://localhost:3001/cryptos/'+crypto+'/history/'+this.filter)
      if(resultImage.status == 200) {
        this.image = "https://www.cryptocompare.com"+resultImage.data.image
      }

      if(result.status == 200) {
        let categories = [];
        let data = [];
        result.data.forEach(function (item) {
          let date = new Date(item.time * 1000);
          let minute = date.getUTCMinutes() < 10? "0"+date.getUTCMinutes(): date.getUTCMinutes()
          categories.push(date.getDate()+ '/' + (date.getUTCMonth() + 1) + ' ' +(date.getUTCHours()+1)+":"+minute)
          data.push(item.close)
        })


        this.sincePrevious =
        this.options =  {
          chart: {
            id: 'vuechart-example'
          },
          xaxis: {
            categories: categories
          }
        };
        this.series = [{
          data: data
        }]

      }

      let result2 = await axios.get('http://localhost:3001/cryptos/'+crypto+'/history/daily');

      if(result2.status == 200) {
        let i = 0;
        let highestWeek = this.highestWeek;
        let highestMonth = this.highestMonth;
        let highestTwoMonth = this.highestTwoMonth;

        let lowestWeek = this.lowestWeek;
        let lowestMonth = this.lowestMonth;
        let lowestTwoMonth = this.lowestTwoMonth;

        result2.data.forEach(function (item) {

          if(i == 0) {
            lowestTwoMonth = item.low
            lowestMonth = item.low
            lowestWeek = item.low
          }

          if(i> (result2.data.length - 7) && item.high > highestWeek)
            highestWeek = item.high
          if(i > result2.data.length - 30 && item.high > highestMonth)
            highestMonth = item.high
          if(i > result2.data.length - 60 && item.high > highestTwoMonth)
            highestTwoMonth = item.high;


          if(i> (result2.data.length - 7) && item.low < lowestWeek)
            lowestWeek = item.low
          if(i > result2.data.length - 30 && item.low < lowestMonth)
            lowestMonth = item.low
          if(i > result2.data.length - 60 && item.low < lowestTwoMonth)
            lowestTwoMonth = item.low;

          i++
        })
        this.highestWeek = highestWeek;
        this.highestMonth = highestMonth;
        this.highestTwoMonth = highestTwoMonth;
        this.lowestWeek = lowestWeek;
        this.lowestMonth = lowestMonth;
        this.lowestTwoMonth = lowestTwoMonth;
        this.open = result2.data[result2.data.length - 1].open
        this.high = result2.data[result2.data.length - 1].high
        this.low = result2.data[result2.data.length - 1].low
        this.prevClose = result2.data[result2.data.length - 1].close
        let lastDate = new Date(result2.data[result2.data.length - 1].time * 1000);
        this.date =  lastDate.getUTCDate()+"/"+(lastDate.getUTCMonth()+1)+"/"+lastDate.getUTCFullYear();
      }
    }
  },
  async beforeMount() {
    await this.getCrypto();
  }

}
</script>

<style lang="scss" scoped>
$blue: #005BA6;
$gray: #D6D6D6;
$placeholder: #18253e;
$border-color: #E6E6E6;

$border-width: 3px;

@mixin form-input-select(){
  color: $blue;
  display: block;
  border-radius: 0;
  box-shadow: none;
  font-size: 16px;
  margin-top: 9px;
  margin-bottom: 15px;
  width: 100%;

  @-moz-document url-prefix() {
    border-right: $border-width solid $border-color;

    &:hover {
      border-right: $border-width solid $blue;
    }
  }

  &:hover {

    select {
      box-shadow: 0 2px 3px rgba($blue, 0.1) inset;
      border-color: $blue;

      &:focus {
        outline-color: transparent;
      }

    }

    &::before {
      border-bottom-color: $blue;
    }
    &::after {
      border-top-color: $blue;
    }

  }


  select {
    border: $border-width solid $border-color;
    border-radius: 0;
    font-weight: 400;
    color: inherit;
    padding: 11px 15px;
    line-height: normal;
    transition: border-color 0.2s ease,
    outline 0.2s ease;


    &:focus {
      box-shadow: 0 3px 4px rgba($blue, 0.3) inset;
      outline: $border-width solid $blue;
      outline-offset: -#{$border-width};
    }

    &[disabled], &:disabled{
      opacity: 0.4;
      cursor: not-allowed;
    }

    &:not(:focus):invalid {
      color: $placeholder;
    }

  }
}

[include*="form-input-select()"] {
  @include form-input-select();
}
  .display-4 {
    font-size: 3.5rem;
    font-weight: 300;
    line-height: 1.2;
  }

  strong {
    font-style: normal;
    font-weight: 400;
    text-transform: uppercase;
  }
  i {
    font-style: italic;
    font-size: smaller;
  }
  .col-2{
    column-count: 2;
    column-gap: 0px;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
  }
  .container-fluid {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 35px;
    display: flex;
  }

  .table-center {
    margin-left: auto;
    margin-right: auto;
  }


  th {
    color:#D5DDE5;;
    background:#18253e;
    border-bottom:4px solid #9ea7af;
    border-right: 1px solid #343a45;
    font-size:20px;
    font-weight: 100;
    padding:24px;
    text-align:left;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    vertical-align:middle;
  }

  th:first-child {
    border-top-left-radius:3px;
  }

  th:last-child {
    border-top-right-radius:3px;
    border-right:none;
  }

  tr {
    border-top: 1px solid #C1C3D1;
    border-bottom: 1px solid #C1C3D1;
    color:#666B85;
    font-size:16px;
    font-weight:normal;
    text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
  }

  tr:hover td {
    background:#4E5066;
    color:#FFFFFF;
    border-top: 1px solid #22262e;
  }

  tr:first-child {
    border-top:none;
  }

  tr:last-child {
    border-bottom:none;
  }

  tr:nth-child(odd) td {
    background:#EBEBEB;
  }

  tr:nth-child(odd):hover td {
    background:#4E5066;
  }

  tr:last-child td:first-child {
    border-bottom-left-radius:3px;
  }

  tr:last-child td:last-child {
    border-bottom-right-radius:3px;
  }

  td {
    background:#FFFFFF;
    padding:20px;
    text-align:left;
    vertical-align:middle;
    font-weight:300;
    font-size:18px;
    text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
    border-right: 1px solid #C1C3D1;
  }

  td:last-child {
    border-right: 0px;
  }

@media screen and (min-width: 800px){
  .column {
    float: left;
    width: 50%;
  }
}

  .center {
    margin: auto;
  }

</style>
