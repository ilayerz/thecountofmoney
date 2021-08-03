<template>
  <div class="app-settings">
    <div class="container">
      <div class="table-container">
        <h3 class="title">Cryptocurrencies</h3>
        <div class="check-table">

          <div class="body">
            <div :key="crypto.cmCode" v-for="crypto in cryptoMap" class="row">
              <input
                type="checkbox"
                :id="crypto.cmCode"
                :checked="crypto.value"
                :disabled="crypto.loading"
                @change="handleCryptoState(crypto)"
              />
              <label :for="crypto.cmCode">{{ crypto.name }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="table-container">
        <h3 class="title">RSS News Links <a class="newfeedbtn" href="/feeds/new">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        </a></h3>
        <div class="check-table">

          <div class="body">
            <div :key="rss.title" v-for="rss in rssList" :id="rss.id" class="row">
              <input
                type="checkbox"
                :id="rss.title"
                :checked="rss.value"
                :disabled="rss.loading"
                v-model="rss.value"
                @change="handleRssState(rss)"
              />
              <label :for="rss.title">{{ rss.title }} <a class="editfeedbtn" :href="`/feeds/edit/${rss.id}`">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
              </a></label>
              <button class="delete" v-on:click.prevent="deleteFeed(rss.id)">X</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import { env } from "../../config/env";
import { cryptocurrency } from "../../firebase";

export default {
  props: ["user"],
  data: () => ({
    userForm: {
      firstName: "",
      lastName: "",
      email: "",
      oldPassword: "",
      newPassword: "",
    },

    cryptoMap: {},

    rssList: [],
  }),
  mounted() {
    this.getRssFeeds();
    cryptocurrency.onSnapshot(async (snapshot) => {
      let dbCryptocurrencies = {};
      let vCryptoMap = await this.fetchAllCryptos();

      snapshot.forEach((doc) => {
        dbCryptocurrencies[doc.data().cmCode] = {
          ...doc.data(),
          value: true,
          loading: false,
        };
      });

      this.cryptoMap = {
        ...vCryptoMap,
        ...dbCryptocurrencies,
        ...this.cryptoMap,
      };
    });
  },
  methods: {
    async fetchAllCryptos() {
      const cryptoToplist = await Axios.get(`${env.apiUrl}/cryptos/toplist24h`);
      let vCryptoMap = {};
      cryptoToplist.data.forEach((crypto) => {
        vCryptoMap[crypto.cmCode] = {
          ...crypto,
          value: false,
          loading: false,
        };
      });
      return vCryptoMap;
    },
    async addCrypto(crypto) {
      await Axios.post(`${env.apiUrl}/cryptos`, {
        cmCode: crypto.cmCode,
        name: crypto.name,
        image: crypto.image,
      });
    },
    async deleteCrypto(crypto) {
      await Axios.delete(`${env.apiUrl}/cryptos/${crypto.cmCode}`);
    },

    async handleCryptoState(crypto) {
      crypto.loading = true;
      try {
        if (crypto.value) {
          await this.deleteCrypto(crypto);
        } else {
          await this.addCrypto(crypto);
        }
        crypto.value = !crypto.value;
      } catch (e) {
        console.error("handleCryptoState error", e);
      } finally {
        crypto.loading = false;
      }
    },

    async getRssFeeds() {
      try {
        const response = await Axios.get(`${env.apiUrl}/feeds/allfeeds`);

        if (response.data.feeds) {
          this.rssList = response.data.feeds.map((feed) => ({
            id: feed.id,
            title: feed.data.title,
            value: feed.data.state,
            loading: false,
          }));
        }
      } catch (e) {
        console.error(e);
      }
    },

    async handleRssState(rss) {
      rss.loading = true;
      try {
        await Axios.post(`${env.apiUrl}/feeds/state/${rss.id}`, {
          state: rss.value,
        });
      } catch (e) {
        rss.value = !rss.value;
        console.error(e, rss);
      } finally {
        rss.loading = false;
      }
    },
    async deleteFeed(id) {
      await Axios.delete(`${env.apiUrl}/feeds/${id}`).then(()=>{
        document.getElementById(id).remove();
      }).catch((error)=>{
         if (error.response.data.msg) {
        alert(`Error ${error.response.data.msg} : ${error.response.status}`);
      }else{
        alert(`Unknown Error`);
      }
        console.log(error)
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-settings {
  width: 100%;
  margin: 0;
  padding: 0;
  .container {
    position: relative;
    display: flex;
    height: calc(100% - 50px - 50px);
    max-height: calc(100% - 50px - 50px);
    // padding: 0 30px;
    .table-container {
      height: 100%;
      width: 100%;
      .title {
        font-weight: 500;
        font-size: 24px;
        height: 30px;
        margin-bottom: 20px;
      }
    }
  }

  .newfeedbtn svg:hover{
    transform: scale(1.2);
  }
  .editfeedbtn svg:hover{
    transform: scale(1.2);
  }


  .col-name{
    margin: auto;
  }
  .check-table {
    height: 100%;
    width: 90%;
    margin: auto;
    display: flex;
    flex-direction: column;
    .body {
      height: calc(100% - 40px);

      header {
        display: flex !important;
        flex-direction: row;
        margin: auto;
        width: 100% !important;
        border-bottom: 1px solid #dcdcdc;
      }
      .row {
        display: grid;
        grid-template-columns: 2fr 7fr 2fr;
        justify-items: center;
        align-items: center;
        height: 40px;
        .delete{
          background-color: transparent;
          border: none;
          color: red;
          cursor: pointer;
          font-weight: bold;
          outline: none;
        }
        .delete:hover{
          transform: scale(1.05);

        }
      }

    }
  }
}
.head{
  display: flex;
}
@media only screen and (max-width: 850px) {
  .app-settings{
    width: 60% !important;
    margin: 0 !important;
    
  }
  .container{
    flex-direction: column;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .table-container{
    margin: 50px 0;
    width: 90% !important;
  }

}
</style>