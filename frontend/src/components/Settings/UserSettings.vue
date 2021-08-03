<template>
  <form class="user-settings" @submit.prevent="updateUserProfile()">
    <div
      class="main-container"
    >
      <div class="container">
        <input
          type="text"
          class="input A"
          v-model="userForm.firstName"
          placeholder="First Name"
        />
        <input
          type="text"
          class="input B"
          v-model="userForm.lastName"
          placeholder="Last Name"
        />
        <input
          type="text"
          class="input C"
          v-model="userForm.email"
          placeholder="E-mail"
        />

        <h3 class="title D">Change Password</h3>

        <input
          type="password"
          class="input E"
          v-model="userForm.oldPassword"
          placeholder="Old Password"
        />
        <input
          type="password"
          class="input F"
          v-model="userForm.newPassword"
          placeholder="New Password"
          :disabled="!userForm.oldPassword"
        />

        <button class="btn btn-blue G">Submit</button>
      </div>

      <div class="table-container">
        <div class="check-table">
          <header class="head">
            <h4 class="col-name title">Cryptocurrencies</h4>
          </header>

          <div class="body">
            <div
              :key="'user-' + crypto.cmCode"
              v-for="crypto in userForm.cryptoPreferences"
              class="row"
            >
              <input
                type="checkbox"
                :id="'user-' + crypto.cmCode"
                :checked="crypto.value"
                :disabled="crypto.loading"
                @change="handleCryptoState(crypto)"
              />
              <label :for="'user-' + crypto.cmCode">{{ crypto.name }}</label>
            </div>
          </div>
        </div>

        <div class="check-table">
          <header class="head">
            <h4 class="col-name title">Keywords</h4>
          </header>
          <form class="header" @submit.prevent="addKeyword()">
            <button>Add</button>
            <input placeholder="New keyword" type="text" v-model="keywordInput" />
          </form>

          <div class="body">
            <div
              :key="keyword.name"
              v-for="(keyword, i) in userForm.articlesKeyWords"
              class="row"
            >
              <input
                type="checkbox"
                :id="keyword.name"
                :checked="keyword.value"
                :disabled="keyword.loading"
                @change="deleteKeyword(keyword, i)"
              />
              <label :for="keyword.name">{{ keyword.name }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>

  </form>
</template>

<script>
import Axios from "axios";
import { env } from "../../config/env";
import { mapActions } from "vuex";
import { cryptocurrency, userSettings } from "../../firebase";

export default {
  mounted() {
    this.initUserInfo();
  },
  data: () => ({
    keywordInput: "",
    userProfile: null,
    userForm: {
      firstName: "",
      lastName: "",
      email: "",
      oldPassword: "",
      newPassword: "",

      cryptoPreferences: {},
      articlesKeyWords: [],
    },
  }),
  methods: {
    async initUserInfo() {
      this.userProfile = await this.fetchCurrentUser();

      // * SYNC available crypto and user preferences on crypto-currencies changes
      cryptocurrency.onSnapshot(async (snapshot) => {
        let dbCryptocurrencies = {};
        snapshot.forEach((doc) => {
          dbCryptocurrencies[doc.data().cmCode] = {
            ...doc.data(),
            value: false,
            loading: false,
          };
        });

        let userCryptocurrencies = {};
        this.userProfile.userInfo.crypto_currencies.forEach((crypto) => {
          userCryptocurrencies[crypto.cmCode] = {
            ...crypto,
            value: true,
            loading: false,
          };
        });

        this.userForm.cryptoPreferences = {
          ...dbCryptocurrencies,
          ...userCryptocurrencies,
        };
      });

      // * SYNC available crypto and user preferences on user-settings changes
      userSettings.doc(this.userProfile.userId).onSnapshot((doc) => {
        this.fetchCurrentUser();
        let userCryptocurrencies = {};
        doc.data().crypto_currencies.forEach((crypto) => {
          userCryptocurrencies[crypto.cmCode] = {
            ...crypto,
            value: true,
            loading: false,
          };
        });

        this.userForm.cryptoPreferences = {
          ...this.userForm.cryptoPreferences,
          ...userCryptocurrencies,
        };

        console.log("current", doc.data());
        this.userForm.articlesKeyWords = doc
          .data()
          .list_keywords.map((keyword) => ({
            name: keyword,
            value: true,
          }));

        this.userForm.firstName = doc.data().first_name;
        this.userForm.lastName = doc.data().last_name;
        this.userForm.email = doc.data().email;
      });
    },
    async updateUserProfile() {
      const res = await Axios.patch(
        `${env.apiUrl}/users/${this.userProfile.userId}`,
        this.userForm
      );
      console.log('res', res);
    },

    async addCrypto(crypto) {
      const res = await Axios.post(
        `${env.apiUrl}/users/${this.userProfile.userId}/addCrypto`,
        { crypto }
      );
      console.log("add", res);
      return res;
    },
    async deleteCrypto(crypto) {
      return await Axios.delete(
        `${env.apiUrl}/users/${this.userProfile.userId}/deleteCrypto/${crypto.cmCode}`
      );
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
        console.error(e);
      } finally {
        crypto.loading = false;
      }
    },

    async addKeyword() {
      if (this.keywordInput.length <= 0) return false;
      await Axios.post(
        `${env.apiUrl}/users/${this.userProfile.userId}/addKeyword`,
        {
          keywords: this.keywordInput.trim().split(/\s+/),
        }
      );
      this.keywordInput = "";
    },

    async deleteKeyword(keyword, i) {
      keyword.loading = true;
      await Axios.post(
        `${env.apiUrl}/users/${this.userProfile.userId}/deleteKeyword`,
        {
          keyword: keyword.name,
        }
      );
      this.userForm.articlesKeyWords.splice(i, 1);
    },

    ...mapActions("user", ["fetchCurrentUser"]),
  },
};
</script>

<style lang="scss" scoped>
.user-settings {
  height: 100%;
  width: 100%;
  .main-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    // height: calc(100% - 50px);
    // max-height: calc(100% - 50px);

    .container,
    .table-container {
      // height: 100%;
      width: 100%;
      margin: 0 30px 15px 30px;
    }
    &.admin {
      .container,
      .table-container {
        width: 100%;
        height: 50%;
        margin: 0 10px 15px 10px;
      }
    }
    .table-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      max-height: 500px;
      .check-table {
        .header {
          height: 40px;
          overflow: hidden;
          * {
            height: 100%;
          }
          input,
          button {
            width: 100%;
          }
        }
        width: 100%;
      }
    }
  }
  .container {
    display: grid;
    align-items: center;
    gap: 10px;
    grid-auto-rows: minmax(auto, 40px);
    grid-template-areas:
      "A B"
      "C C"
      "D D"
      "E E"
      "F F"
      "G G";
    margin: 20px 0;

    .title {
      font-weight: 600;
      font-size: 20px;
    }
  }

  .footer {
    // position: absolute;
    width: 100%;
    bottom: 0;
    padding: 10px;
  }
}
.head{
    display: flex !important;
    flex-direction: row;
    margin: auto;
}
.head h4{
  margin: auto;
  font-weight: bold;
}
@media only screen and (max-width: 1000px) {
  .table-container{
    margin-top: 50px !important;
  }
  .container{
    padding: 5px;
  }
}

</style>