<template>
  <div class="news">
    <div class="feeds-container">
      <div v-if="!error&&items">
      <div v-for="item in items" :key="item.title">
        <div v-if="item.data">
            <div class="feedtitle">
              <div class="title" v-on:click="show(item.title)">
                <img class="feedicon" :src="item.icon"><h1>{{item.title}}</h1> <h3 class="h3message">(Click to expand)</h3>
              </div>
              <a class="showfeed" :href="'/feed/'+item.id">Show Feed</a>
            </div>

      <div class="articles-container" v-if="showing == item.title">
        <div v-for="article in item.data" :key="article.link" class="article">

        <a :href="'/article/'+article.id"><div class="articleheader">
          <img class="articleicon" v-if="article.image" :src="article.image" alt="article's image">
          <img class="articleicon" v-else :src="item.icon" alt="Feed's image">
        </div></a>
        <div class="main">
          <a :href="'/article/'+article.id"><h3>{{article.title}}</h3></a>
          <div class="description" v-html="article.description"></div>
        </div>
        <div class="details">
          <div>
            <p>By : {{article.creator}}</p>
            <p>Published : {{article.date}}</p>
          </div>
        </div>
      </div>
      </div>
      </div>


      <div v-else>
          <div class="feedtitle emptyfeed" title="No article found">
            <div class="title">
              <img :src="item.icon"><h1>{{item.title}}</h1> <h3>No article found</h3>
            </div>
            <a class="showfeed" :href="'/feed/'+item.id">Show Feed</a>
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
  axios.get(`${env.apiUrl}/feeds`) //TODO : Change to env variable and put in a store.
  .then(function (response) {
    self.items = [];
      if (!response.data.data) {
        self.error = {status: "", error: "No Active Feed Found"};
      }else{
        const feeds = response.data.data;
        //Variables de paths des items
        feeds.forEach((feed) => {

        const title = feed.title;
        const icon = feed.icon;
        const id = feed.id;


        let data = [];
        if (feed.articles == null) {
          data = null;
        }else{
            feed.articles.forEach((el) => {
            const id = el.id;
            const title = el.data.title;
            const link = el.data.link;
            const creator = el.data.author;
            const image = el.data.image;
            const date = util.formatDate(el.data.date)
            const description = el.data.description.replaceAll("<img ","<img style='display:none'").replaceAll(/<script.*?>.*?<\/script>/igm, '');
            
            data.push({id: id,title: title, link: link, creator: creator, date: date, description: description, image: image});
          });
        }

        self.items.push({title: title, id: id, icon: icon, data: data});
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
  name: 'Feeds',
  components: {
  },
  data() {
    return {
      items: null,
      showing: null,
      error: null,
    };
  },
  methods: {
      show(feed){
        if (feed == this.showing) {
          this.showing = null;
        }else{
          this.showing = feed;
        }
    }
  }

}

  
</script>

<style scoped>
@import url('../assets/styles/articles.css');
@import url('../assets/styles/allpage.css');
@import url('../assets/styles/loader.css');
@media only screen and (max-width: 850px) {
.h3message{
  display: none;
}}
</style>
