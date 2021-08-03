<template>
  <div class="news">
    <div v-if="!error&&items">
    <h1 v-if="items">Latest articles ({{title}})</h1>
    <div class="articles-container">
      <div v-for="item in items" :key="item.link" class="article">


        <a :href="'/article/'+item.id"><div class="articleheader">
          <img class="articleicon" v-if="item.image" :src="item.image" alt="article's image">
          <img class="articleicon" v-else :src="item.feedicon" alt="Feed's image">
        </div></a>
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
    </div><!--TODO ERROR vide / Error feed desactivé-->
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
  </div>
</template>

<script>
// @ is an alias to /src
const axios = require('axios').default;
const util = require('../store/util').default;
import { env } from "../config/env";


export default {
  mounted(){ 
    let self = this;
    let id = this.$route.params.id;
  axios.get(`${env.apiUrl}/feeds/${id}`) //TODO : Change to env variable and put in a store.
  .then(function (response) {
    self.items = [];
      const data = response.data.data;
      self.title = data.title;
      //Variables de paths des items
      if (data.articles == null) {
        self.items = null;
        self.error = {msg : "No article found for this feed", status: "404"};
      }else{
        data.articles.forEach((el) => {

        const id = el.id;
        const title = el.data.title;
        const link = el.data.link;
        const creator = el.data.author;
        const date = util.formatDate(el.data.date)
        const description = el.data.description.replaceAll("<img ","<img style='display:none'").replaceAll(/<script.*?>.*?<\/script>/igm, '');
        const image = el.data.image;
        const feedicon = el.data.feedicon;

        self.items.push({id: id, title: title, link: link, creator: creator, date: date, description: description, image: image, feedicon: feedicon})
        });
      }

    }).catch((error)=>{
      if (error.response.data.msg) {
        self.error = {msg : error.response.data.msg, status: error.response.status};
      }else{
        self.error = {msg : "Unknown Error"};
      }
    });
  },
  name: 'Feed',
  components: {
  },
  data() {
    return {
      title: null,
      items: null,
      error: null,

    };
  },
  methods: {

  },
}

  
</script>

<style scoped>
@import url('../assets/styles/allpage.css');
@import url('../assets/styles/articles.css');
@import url('../assets/styles/loader.css');
</style>
