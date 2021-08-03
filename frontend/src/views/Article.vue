<template>
  <div class="Article">
    <div v-if="!error&&article" class="allpage">
      <div class="articlemain">    
        <div class="articleheader">
          <h1 class="title">{{article.title}} <a target="_blank" :href="article.link" v-html="gotoicon"></a></h1>
          <p class="articleauthor">By : {{article.creator}} - {{article.date}}</p>
        </div>

    <div class="flexRow">
    <img class="articleimage" :src="article.image">
    <div class="articledetails">
      <div class="articledescription" v-html="article.description"></div>
    </div>
    </div>

</div>

    </div>


    <div v-else class="allpage">
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
</template>

<script>
// @ is an alias to /src
const axios = require('axios').default;
const util = require('../store/util').default;

export default {
  mounted(){ 
    let self = this;
    let id = this.$route.params.id;
  axios.get('http://localhost:3001/articles/'+id) //TODO : Change to env variable and put in a store.
  .then(function (response) {
      self.article = {};
      const id = response.data.id;
      const data = response.data.data;

      self.title = data.title;
      const title = data.title;
      const link = data.link;
      const creator = data.author;
      const date = util.formatDate(data.date); 
      let description = data.description.replaceAll(/<script.*?>.*?<\/script>/igm, '')/*Anti XSS*/.replaceAll('class="twitter-tweet">','class="twitter-tweet">'+self.twittericon)
      const image = data.image;
      const feedicon = data.feed.icon;

      const linkstr = "<a href='"+link+"'>[See More]</a>";
      if(description.includes("[&#8230;]")){
        description = description.replace("[&#8230;]",linkstr)
      }else{
        description = description + " " + linkstr;
      }
      const obj = {id: id, title: title, link: link, creator: creator, date: date, description: description, image: image, feedicon: feedicon};
      self.article = obj;

    }).catch((error)=>{
        if (error.response.data.msg) {
          self.error = {msg : error.response.data.msg, status: error.response.status};
        }else{
          self.error = {msg : "Unknown Error"};
        }
    });
  },
  name: 'Article',
  components: {
  },
  data() {
    return {
      title: null,
      article: null,
      error: null,
      //SVG's
      twittericon: `<svg viewBox="0 0 24 24" class="r-13gxpu9 r-4qtqp9 r-yyyyoo r-6zzn7w r-19fsva8 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-q1j0wu"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>`,
      gotoicon: `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-link" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/><path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/></svg>`,
    };
  },
  methods: {

  },
}

  
</script>

<style scoped>
.articles-container{
  display: flex;
  flex-direction: column;
}
.article{

margin: 10px auto;
width: 75%;
height: auto;
border :grey 1px solid;
border-radius: 25px;
color: black;
display: flex;
flex-direction: row;
}
.articledetails{

  text-align: left;
  width: 90%;
  margin: auto;
}
.main{
  text-align: left;
  padding: 10px;
  width: 80%;
}

.article a{
  margin: auto auto;
}
a {
  text-decoration: none; /* no underline */
}
h1{
  font-size: 30px;
}
.article h3{
  font-size: 20px;
  margin-bottom: 20px;
}
.articledescription{
  margin: auto auto;
  line-height: 175%;
  padding: 15px;

}
.articleauthor{
  text-align: right;
  max-width: 80%;
  margin: 10px;
}
.articlemain{
  width: 90%;
  margin: auto
}

@import url('../assets/styles/allpage.css');
@import url('../assets/styles/loader.css');
.allpage{
  overflow: scroll;
}
.articleheader{
  margin : 10px 0
}
.articleimage{
  margin: auto;
  max-width: 80%;
}
.articledescription >>> img{
  display: none;
}
.articledescription >>> blockquote{
  font-size:25px;
  margin: 10px auto;
}
.articledescription >>> .twitter-tweet{
  border: 1px solid black !important;
}
.articledescription >>> a{
  font-weight:bold;
  text-decoration: underline orange;
  color: black;
}
.articledescription >>> a:hover{
  text-decoration: underline rgb(1, 119, 255);
}
.articledescription >>> p{
  margin: 10px 0;
}
.articledescription >>> h1{
  font-size: 30px;
}
.articledescription >>> h2{
  font-size: 25px;
}
.articledescription >>> h3{
  font-size: 22px;
}

.articledescription >>> .twitter-tweet {
  display: inline-block;
  font-family: "Helvetica Neue", Roboto, "Segoe UI", Calibri, sans-serif;
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
  border-color: #eee #ddd #bbb;
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  margin: 10px 5px;
  padding: 0 16px 16px 16px;
  max-width: 468px;
}

.articledescription >>> .twitter-tweet p {
  font-size: 16px;
  font-weight: normal;
  line-height: 20px;
}

.articledescription >>> .twitter-tweet  a {
  color: rgb(27, 149, 224);
  font-weight: normal;
  text-decoration: none;
  outline: 0 none;
}

.articledescription >>> .twitter-tweet a:hover,
.articledescription >>> .twitter-tweet a:focus {
  text-decoration: underline;
}

.articledescription >>> svg{
  right: 0;
  width: 30px;
  margin-left: 95%;
  fill: rgb(27, 149, 224);
  margin-bottom: -10px;
  padding: 0;
}

.articledescription{
  font-family: Arial, Helvetica, sans-serif !important;
}

</style>
