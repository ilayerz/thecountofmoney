<template>
  <div class="cryptos">
    <div class="flex-column">
      <div class="ongletscontainer">
        <h2 class="header-link"> <a class="all-currencies" :class="{ active: currentPage === 'all' }" href="#" @click="displayAllCurrencies">All Cryptocurrencies</a></h2>
        <h2 class="header-link"><a class="user-currencies" :class="{ active: currentPage === 'user' }" href="#" @click="displayUserCurrencies">My Cryptocurrencies</a></h2>
      </div>
      <div class="filters">
        <input id="cryptoSearch" type="text" placeholder="Search your cryptos here" v-model="filter.search">
        <div class="minmax-filter">
          <input class="minval" type="number" placeholder="min value" v-model="filter.priceInterval.min">
          <input class="maxval" type="number" placeholder="max value" v-model="filter.priceInterval.max">
        </div>
      </div>
    </div>
    <div v-if="!displayedCryptos||error">
      <div class="allpage">
        <div class="centerpage">
          <div v-if="!error" class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        <h1 v-if="error">ERROR {{error.status}} : {{error.msg}}</h1>
        </div>
      </div>

    </div>
    <div v-else class="cryptocontainer">
      <div class="container">
        <ul class="responsive-table">
          <li class="table-header">
            <div class="col col-1"></div>
            <div class="col col-1">Name</div>
            <div class="col col-2">Current price</div>
            <div class="col col-3">Open price</div>
            <div class="col col-4">Highest / 24h</div>
            <div class="col col-5">Lowest / 24h</div>
          </li>
          <li class="table-row currency" v-for="crypto in displayedCryptos" :key="crypto.id">
            <div class="col col-1" data-label=""><img :src="crypto.image"></div>
            <div class="col col-1" data-label="Name">{{ crypto.name }}</div>
            <div class="col col-2" data-label="Current price">{{ crypto.currentPrice.toFixed(2) }} €</div>
            <div class="col col-3" data-label="Open Price">{{ crypto.openingPrice.toFixed(2) }} €</div>
            <div class="col col-4" data-label="Highest / 24h">{{ crypto.highestPrice.toFixed(2) }} €</div>
            <div class="col col-5" data-label="Lowest / 24h">{{ crypto.lowestPrice.toFixed(2) }} €</div>
            <div class="" data-label="Lowest / 24h">
              <router-link class="router-link flex-center-xy" :to="'/cryptos/'+crypto.id">


                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px"
                     viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627;"
                     xml:space="preserve">
<g>
	<g>
		<path d="M392.857,292.354h-18.274c-2.669,0-4.859,0.855-6.563,2.573c-1.718,1.708-2.573,3.897-2.573,6.563v91.361
			c0,12.563-4.47,23.315-13.415,32.262c-8.945,8.945-19.701,13.414-32.264,13.414H82.224c-12.562,0-23.317-4.469-32.264-13.414
			c-8.945-8.946-13.417-19.698-13.417-32.262V155.31c0-12.562,4.471-23.313,13.417-32.259c8.947-8.947,19.702-13.418,32.264-13.418
			h200.994c2.669,0,4.859-0.859,6.57-2.57c1.711-1.713,2.566-3.9,2.566-6.567V82.221c0-2.662-0.855-4.853-2.566-6.563
			c-1.711-1.713-3.901-2.568-6.57-2.568H82.224c-22.648,0-42.016,8.042-58.102,24.125C8.042,113.297,0,132.665,0,155.313v237.542
			c0,22.647,8.042,42.018,24.123,58.095c16.086,16.084,35.454,24.13,58.102,24.13h237.543c22.647,0,42.017-8.046,58.101-24.13
			c16.085-16.077,24.127-35.447,24.127-58.095v-91.358c0-2.669-0.856-4.859-2.574-6.57
			C397.709,293.209,395.519,292.354,392.857,292.354z"/>
    <path d="M506.199,41.971c-3.617-3.617-7.905-5.424-12.85-5.424H347.171c-4.948,0-9.233,1.807-12.847,5.424
			c-3.617,3.615-5.428,7.898-5.428,12.847s1.811,9.233,5.428,12.85l50.247,50.248L198.424,304.067
			c-1.906,1.903-2.856,4.093-2.856,6.563c0,2.479,0.953,4.668,2.856,6.571l32.548,32.544c1.903,1.903,4.093,2.852,6.567,2.852
			s4.665-0.948,6.567-2.852l186.148-186.148l50.251,50.248c3.614,3.617,7.898,5.426,12.847,5.426s9.233-1.809,12.851-5.426
			c3.617-3.616,5.424-7.898,5.424-12.847V54.818C511.626,49.866,509.813,45.586,506.199,41.971z"/>
	</g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
                  <g>
</g>
              </svg>
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { env } from '../config/env';
// @ is an alias to /src
const axios = require('axios').default;

export default {
  async mounted() {
    await this.getCurrencies();
    await this.displayAllCurrencies();
  },
  name: 'Cryptos',
  components: {},
  data() {
    return {
      title: null,
      currentPage: null,
      error: null,

      cryptos: null,
      userCryptos: null,
      displayedCryptos: null,

      filter: {
        search: '',

        priceInterval: {
          min: null,
          max: null
        }
      },
    };
  },
  methods: {
    async getCurrencies() {
      const self = this;
      self.cryptos = null;
      await axios.get(`${env.apiUrl}/cryptos/list`).then(async function (response) {
        let cmIds = [];
        if (!response.data) {
          self.error = {status: "404", msg : "No active currency found"};
        }else{
          response.data.forEach(el => {
            el.data.image = ""+el.data.image;
            el.data.url = `${env.fronturl}/cryptos/${el.id}`;
            cmIds.push(el.data.cmCode)
          });
          await axios.get(`${env.apiUrl}/cryptos?cmids=${cmIds.join()}`).then(function (response) {
            let i = 0;
            cmIds.forEach(function (element) {
              response.data[i].url = `${env.fronturl}/cryptos/${element}`;
              response.data[i].id = element.toUpperCase();
              if (!response.data[i].image.includes("https://www.cryptocompare.com")) {
              console.log('HERE')
              response.data[i].image = "https://www.cryptocompare.com" + response.data[i].image;
            }
              i++;
            });
            self.cryptos = response.data;
          });
        }

      }).catch((error)=>{
        if (error.response.data.msg) {
          self.error = {msg : error.response.data.msg, status: error.response.status};
        }else{
          self.error = {msg : "Unknown Error"};
        }
      })
    },

    displayAllCurrencies() {
      this.currentPage = "all";
      this.displayedCryptos = [...this.cryptos];
    },
    displayUserCurrencies() {
      this.currentPage = "user";
      this.displayedCryptos = [...this.userCryptos];
    },
  },
  watch: {
    cryptos() {
      let userCryptos = JSON.parse(localStorage.getItem('TCOMUserProfile')).userInfo.crypto_currencies;
      this.userCryptos = this.cryptos.filter(crypto => userCryptos.find((element) => crypto.id === element.cmCode));
    },
    filter: {
      handler() {
        const displayedCryptos = this.currentPage === "all" ? this.cryptos : this.userCryptos;

        this.displayedCryptos = displayedCryptos
          .filter(crypto => (
            (this.filter.priceInterval.max ? crypto.currentPrice <= this.filter.priceInterval.max : true)
            &&
            (this.filter.priceInterval.min ? crypto.currentPrice >= this.filter.priceInterval.min : true)
          ))
          .filter(crypto => crypto.name.toLowerCase().includes(this.filter.search.toLowerCase()));
      },
      deep: true
    }
  }
}


</script>

<style lang="scss" scoped>

.responsive-table {
  li {
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }

  .table-header {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-weight: bold;
  }

  .table-row {
    background-color: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.1);
  }

  .col-1 {
    flex-basis: 10%;
  }

  .col-2 {
    flex-basis: 40%;
  }

  .col-3, .col-4, .col-5 {
    flex-basis: 25%;
  }


  @media all and (max-width: 767px) {
    .table-header {
      display: none;
    }

    li {
      display: block;
    }
    .col {

      flex-basis: 100%;

    }
    .col {
      //display: flex;
      padding: 10px 0;

      &:before {
        padding-right: 10px;
        content: attr(data-label);
        flex-basis: 50%;
        text-align: right;
      }
    }
  }
}

@media screen and (max-width: 800px){
  .cryptocontainer {
    // margin-right: 120px !important;
    // margin-left:50% !important;
    // width: 100% !important;
    min-width: 250px !important;
  }

  .currency {
    margin: 10px auto;
    align-items: center;
    height: auto;
    border: grey 1px solid;
    border-radius: 5px;
    color: black;
    display: flex;
    flex-direction: row;
    padding: 5px;
  }

  .currency img {
    width: 50px;
    height: 50px;
  }
  //.articles-container{
  //  width: 100%;
  //}
  //.article{
  //  width: 100%;
  //  min-width: 275px;
  //  margin-left:50% ;
  //}
}

.cryptocontainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  .container {
    padding: 10px;
    width: calc(100% - 20px);
  }
}

.currency {
  margin: 10px auto;
  align-items: center;
  height: auto;
  border: grey 1px solid;
  border-radius: 5px;
  color: black;
  display: flex;
  flex-direction: row;
  padding: 5px;
}

.currency img {
  width: 50px;
  height: 50px;
}

.main {
  text-align: left;
  padding: 10px;
  width: 80%;
}

.details p {
  margin: 5px 0;
}

.article a {
  margin: auto auto;
}

a {
  text-decoration: none; /* no underline */
}

h1 {
  font-size: 30px;
}

.article h3 {
  font-size: 20px;
  margin-bottom: 20px;
}

@import url('../assets/styles/loader.css');
@import url('../assets/styles/allpage.css');

.header-link {
  text-align: initial;
  margin-left: 45px;


  a {
    text-decoration: none;
    color: black;
  }
  a.active{
    font-weight: bold;
    text-decoration: underline;
  }
}

.ongletscontainer{
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto;
  padding: 10px 0;
}

.filters {
  display: flex;
  justify-content: center;
  margin: auto;
  padding: 10px 0;

  .minmax-filter {
    display: flex;
    flex-direction: column;
  }
}
</style>
