<template>
  <div class="news">
    <div class="ongletcontainer">
      <button id="latest" v-on:click="showonglet('latest')"><h1>Latest</h1></button>
      <button id="keywords" v-on:click="showonglet('keywords')"><h1>Keywords</h1></button>
      <button id="search" v-on:click="showonglet('search')"><h1>Search</h1></button>
    </div>
    <div class="searchformdiv topindex" v-show="search">
      <form class="topindex searchform"  v-on:submit.prevent="searchArticles()">
        <input class="topindex" placeholder="Type your keyword here" type="text" id="searchstr">
        <input class="topindex" type="submit" value="search">
      </form>
    </div>
    <div v-if="!error&&items" class="articles-container">
      <div v-for="item in items" :key="item.link" class="article">
        <a :href="'/article/'+item.id">
          <div class="articleheader">
            <img class="articleicon" v-if="item.image" :src="item.image" alt="article's image">
            <img class="articleicon" v-else :src="item.feedicon" alt="Feed's image">
          </div>
        </a>
        <div class="main">
          <a :href="'/article/'+item.id"><h3>{{item.title}}</h3></a>
          <div class="description" v-html="item.description"></div>
        </div>
        <div class="details">
          <div>
            <p>By : {{item.creator}}</p>
            <p>Published : {{item.date}}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
    <div class="allpage">
      <div class="centerpage">
          <div v-if="!items&&!error" class="lds-roller">
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

  <div class="showmorebar" v-if="showing==='latest'" v-on:click="showMore()"><p>Show More</p></div>

  </div>
</template>

<script>
// @ is an alias to /src
const axios = require('axios').default;
const util = require('../store/util').default;
import { env } from "../config/env";


export default {
  async mounted(){ 
    try {
    let userKeywords = JSON.parse(localStorage.getItem('TCOMUserProfile')).userInfo.list_keywords;
    if (userKeywords.length>0) {
      await this.getArticles(userKeywords);
    }      
    } catch (error) {
      document.getElementById('keywords').disabled = true;
      console.log(error)
    }

      await this.getArticles(this.articlesLimit);
      if(this.keyworditems.length>0){
        this.showonglet("keywords");
      }else{
        this.showonglet("latest");
      }

  },
  name: 'Articles',
  components: {
  },
  data() {
    return {
      title: null,
      items: null,
      keyworditems: [],
      latestitems: [],
      error: null,
      showing: null,
      articlesLimit : 6,
      searchitems: [],
      search: false,
    };
  },
  methods: {
    async showMore(){
      this.articlesLimit += 9;
      this.items = null;
      await this.getArticles(this.articlesLimit);
      this.showonglet('latest');
    },
    async showonglet(onglet){
        this.showing = onglet;
        if (onglet == "latest") {
          document.getElementById('keywords').classList.remove("activeonglet");
          document.getElementById('search').classList.remove("activeonglet");
          this.search = false;
          if (this.latestitems.length>0) {
            this.items = this.latestitems;
            this.error = null;
          }else{
            this.error = {msg: "No articles or feeds found"};
          }
        }else if(onglet == "keywords"){
          document.getElementById('latest').classList.remove("activeonglet");
          document.getElementById('search').classList.remove("activeonglet");
          this.search = false;
          console.log(JSON.parse(JSON.stringify(this.keyworditems)))
          if (this.keyworditems.length>0) {
            this.items = this.keyworditems;
            this.error = null;
          }else{
            this.error = {msg: "No articles or keywords found"};
          }
        }else if (onglet == "search") {
          document.getElementById('latest').classList.remove("activeonglet");
          document.getElementById('keywords').classList.remove("activeonglet");//////
          this.search = true;
          this.items = [];
          if (this.searchitems.length>0) {
            this.items = this.searchitems;
            this.error = null;
          }
        }
        document.getElementById(onglet).classList.add("activeonglet");

    },
    async searchArticles(){
          let searchstr = document.getElementById('searchstr').value;
          searchstr.replaceAll(/<script.*?>.*?<\/script>/igm, '');/*Anti XSS*/

          if (searchstr) {
            this.items = null;
            this.error = null;
            await this.getArticles(searchstr);
            
            if (this.searchitems.length>0) {
            this.items = this.searchitems;
            this.error = null;
            }else{
              this.error = {msg: "No articles found"};
            }
          }
    },
    async getArticles(param){
      let self = this;


    return new Promise(function(resolve, reject){

      let link = `${env.apiUrl}/articles`;
      let type = typeof param;
      if (param) {
        if (type === "number") { // Number/limit
          link += `?limit=${param}`;  
        }else
        if(type === "object"){ //Keywords
          link += `?keywords=${param.join()}`;
        }
        if(type === "string"){ //Search
          link += `?keywords=${param}`;
          self.searchitems = [];
        }
      }
        axios.get(link) //TODO : Change to env variable and put in a store.
  .then(async function (response) {
    self.items = [];
      const data = response.data.data;
      //Variables de paths des items
      await data.forEach(async (el) => {
      const id = el.id;
      const title = el.data.title;
      const link = el.data.link;
      const creator = el.data.author;
      const date = util.formatDate(el.data.date)
      const description = el.data.description.replaceAll("<img ","<img style='display:none'").replaceAll(/<script.*?>.*?<\/script>/igm, '');
      let image = el.data.image;
  
      const feedicon = el.data.feedicon;
      let article = {id: id, title: title, link: link, creator: creator, date: date, description: description, image: image, feedicon: feedicon}
        if (type === "number") {
          self.latestitems.push(article);
        }else if(type === "object"){
          self.keyworditems.push(article);
        }else if(type === "string"){
          self.searchitems.push(article)
        }
      });
          resolve();
    }).catch((error)=>{
      if (error.response.data.msg) {
        self.error = {msg : error.response.data.msg, status: error.response.status};
      }else{
        self.error = {msg : "Unknown Error"};
      }
      reject();
    });

    });
    }


  },
}

  
</script>

<style scoped>

@import url('../assets/styles/articles.css');
@import url('../assets/styles/allpage.css');
@import url('../assets/styles/loader.css');

.showmorebar{
  width: 100%;
  height: 30px;
  background-color: rgb(179, 179, 179);
    cursor: pointer;
}

.ongletcontainer{
  width: 40%;
  margin: auto;
  display: flex;
  flex-direction: row;
  text-align: center;
  z-index: 20 !important;
}
.ongletcontainer button{
  margin: auto;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  z-index: 20 !important;
}
.ongletcontainer button:disabled{
  cursor: not-allowed;
}
.activeonglet{
  text-decoration: underline;
}
.topindex{
  z-index: 30 !important;
  position: relative !important;
}

.searchform{
  margin: 10px auto;
  width: 40%;
  display: flex;
  flex-direction: row;
  height: 40px;
  border-radius: 8px;
}
.searchform input[type="text"]{
  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  outline: none;
  border: none;
  text-align: center;
  box-shadow:  0 0 3px black;
}
.searchform input[type="text"]:focus{
  box-shadow:  0 0 5px black;
}
.searchform input[type="submit"]{
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 20%;
  outline: none;
  border: none;
  background-color: rgb(173, 255, 255);
  box-shadow:  0 0 3px black;
}
.searchform input[type="submit"]:hover{
  transform: scale(1.05);
}
.searchform input[type="submit"]:active{
  transform: scale(1);
}


@media screen and (max-width: 800px){
  .searchformdiv{
    width: 100%;
  }
  .searchform{
    width: 80%;
  }
  .ongletcontainer{
    width: 100%;
  }
}

</style>
