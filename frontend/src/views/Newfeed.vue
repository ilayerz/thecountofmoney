<template>
  <div class="news">
    <div id="linksetting" class="allpage">
      <div class="centerpage centerlinkform">
        <input id="linkinput" type="text" v-model="link">
        <button id="linkbutton" v-on:click="getData()">Get Data</button>
        <span class="errormsg">{{linkerrormsg}}</span>
      </div>
    </div>


    <div class="mainview">
      <div class="preview">
      <h3>.<span v-if="data">Go to </span><button v-if="data" v-on:click="show('')">base</button>
      <button v-on:click="show('mainpath')" v-if="datatosend.path">/{{datatosend.path}}</button>
      <button v-on:click="show('article')" v-if="datatosend.itemspath">/{{datatosend.itemspath}}/(first element)</button>
      .
      </h3>
        <div id="previewcontainer" class="previewcontainer">
          <TreeView class="treeview" :data="previewdata" :options="{maxDepth: maxDepth, rootObjectKey: 'Preview'}"></TreeView>  
        </div>
        <div id="previewimagecontainer" class="previewimagecontainer none">
          <div>
            <img id="previewimage">
          </div>
        </div>
      </div>


    <div v-if="data" class="adddetails">
      <div class="details-inner">
        <div class="ongletcontainer" style="display:flex;flex-direction:row">
        <button id="ongletmain" v-on:click="showonglet('main')" class="ongletbtn ongletactive"><h3>Feed</h3></button>
        <button id="ongletitem" disabled v-on:click="showonglet('item')" class="ongletbtn"><h3>Article</h3></button>
        </div>


      <div class="onglet" v-show="onglet=='main'">
      <div class="setting" v-if="data">
            <label>Feed's title</label>
          <div class="pathset">
            <input type="text" class="pathinput" id="title" placeholder="Example : Coin Desk">
            <button v-on:click="test('title')">Set</button>
        </div>
      </div>
      <div class="setting" v-if="data">
            <label>Main Path (path to feed's data)</label>
          <div class="pathset">
            <input type="text" class="pathinput" id="path" placeholder="Example : rss/channel/0">
            <button v-on:click="test('path')">Set</button>
        </div>
      </div>
      <div class="setting" v-if="datatosend.path">
            <label>Feed's icon path</label>
          <div class="pathset">
            <input type="text" disabled class="prevpath" :value="datatosend.path+'/'">
            <input type="text" class="itempath" id="icon" placeholder="Example : image/0/url/0">
            <button v-on:click="test('icon')">Set</button>
      </div>
      </div>
        <div class="setting" v-if="datatosend.path">
          <label>Path to articles</label>
          <div class="pathset">
            <input type="text" disabled class="prevpath" :value="datatosend.path+'/'">
            <input type="text" class="itempath" id="itemspath" placeholder="Example : item">
            <button v-on:click="test('itemspath')">Set</button>
          </div>
        </div>





        <div class="setting" v-if="datatosend.path">
          <label>Feed visible by users</label> <input type="checkbox" v-model="datatosend.state">
        </div>
      </div>


        <div class="onglet" v-show="onglet=='item'">
        <div class="setting" v-if="datatosend.itemspath">
          <label>Article's title Path</label>
          <div class="pathset">
            <input type="text" disabled class="prevpath" :value="datatosend.path+'/'+datatosend.itemspath+'/'">
            <input class="itempath" type="text" id="itemtitlepath" placeholder="title/0">
            <button v-on:click="test('itemtitlepath')">Set</button>
          </div>

          <label>Article's link Path</label>
          <div class="pathset">
            <input type="text" disabled class="prevpath" :value="datatosend.path+'/'+datatosend.itemspath+'/'">
            <input class="itempath" type="text" id="itemlinkpath" placeholder="link/0">
            <button v-on:click="test('itemlinkpath')">Set</button>
          </div>

          <label>Article's description Path</label>
          <div class="pathset">
            <input type="text" disabled class="prevpath" :value="datatosend.path+'/'+datatosend.itemspath+'/'">
            <input class="itempath" type="text" id="itemdescriptionpath" placeholder="description/0">
            <button v-on:click="test('itemdescriptionpath')">Set</button>
          </div>

          <label>Article's creator Path</label>
          <div class="pathset">
            <input type="text" disabled class="prevpath" :value="datatosend.path+'/'+datatosend.itemspath+'/'">
            <input class="itempath" type="text" id="itemcreatorpath" placeholder="dc:creator/0">
            <button v-on:click="test('itemcreatorpath')">Set</button>
          </div>

          <label>Article's date Path</label>
          <div class="pathset">
            <input type="text" disabled class="prevpath" :value="datatosend.path+'/'+datatosend.itemspath+'/'">
            <input class="itempath" type="text" id="itemdatepath" placeholder="pubDate/0">
            <button v-on:click="test('itemdatepath')">Set</button>
          </div>

          <label>Article's image path</label>
          <div class="pathset">
            <input type="text" disabled class="prevpath" :value="datatosend.path+'/'+datatosend.itemspath+'/'">
            <input class="itempath" type="text" id="itemimagepath" placeholder="">
            <button v-on:click="test('itemimagepath')">Set</button>
          </div>

        </div>
        </div>
      </div>
    <div class="submit">
      <button v-on:click="save()" class="submitbtn">Save</button>
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
import {TreeView} from 'vue-json-tree-view/src';

export default {
  mounted(){ 

  },
  name: 'News',
  components: {
    TreeView
  },
  data() {
    return {
      data: null,
      items: [],
      maxDepth : 2,
      onglet : "main",
      link: "https://www.coindesk.com/feed",
      linkerrormsg: "",
      previewdata: {message: "Enter you feed's link and click 'Get Data'"},
      datatosend: {
        title: null,
        link: null,
        path: null,
        icon: null,
        //items
        itemspath: null,
        itemtitlepath: null,
        itemlinkpath: null,
        itemdescriptionpath: null,
        itemcreatorpath: null,
        //itemimagepath: null,
        itemdatepath: null,
        itemimagepath: null,
        //state
        state: true
      }
    };
  },
  methods: {
    save(){
      if(this.cansend()){
        console.log(this.datatosend);
        let data = {data: this.datatosend};
        axios.post(`${env.apiUrl}/feeds`,data) 
        .then(function (response) {
          console.log(response);
          console.log("Success");
          window.location.href = "/feed/"+response.data;
        }).catch((error)=>{
          alert(error.response.data.msg)
        });
      }else{
        alert("Missing data...\nPlease make sure you setted up all mandatory paths");
      }
    },
    getData(){
      if(this.link === ""){
        alert("please give a valid link");
        this.linkerrormsg = "No link given";
        document.getElementById('linkinput').classList.add('error');
        document.getElementById('linkbutton').classList.add('error');
      }else{
        document.getElementById('linkinput').disabled = true;
        document.getElementById('linkbutton').disabled = true;
        document.getElementById('linkinput').classList.remove('error');
        document.getElementById('linkbutton').classList.remove('error');

        this.linkerrormsg = "";
        const self = this;
        let data = {link: this.link};
        axios.post(`${env.apiUrl}/feeds/getraw`, data)
        .then(function (response) {
          document.getElementById('linkinput').disabled = false;
          document.getElementById('linkbutton').disabled = false;
          self.data = response.data;
          self.previewdata = self.data;
          self.datatosend.link = data.link;
          document.getElementById("linksetting").remove();

        }).catch((error)=>{
          document.getElementById('linkinput').disabled = false;
          document.getElementById('linkbutton').disabled = false;
          document.getElementById('linkinput').classList.add('error');
          document.getElementById('linkbutton').classList.add('error');
          console.log(error);
          this.linkerrormsg = "Not Found.";

        });
      }

    
    },
    showonglet(onglet){
      if (this.onglet != onglet) {
        
        let oldid = "onglet"+this.onglet;
        let id = "onglet"+onglet;
        this.onglet = onglet;
        document.getElementById(oldid).classList.remove('ongletactive');
        document.getElementById(id).classList.add('ongletactive');
      }
    },
    cansend(){
      if (
      this.datatosend.title != null &&
      this.datatosend.link != null &&
      this.datatosend.path != null &&
      this.datatosend.itemtitlepath != null &&
      this.datatosend.itemlinkpath != null        
      ) {
        return true;
      }else{
        return false;
      }

        
    },
    showimage(val){
      if (val) {
        document.getElementById("previewimagecontainer").classList.remove("none");
        document.getElementById("previewcontainer").classList.add("none");
      }else{
        document.getElementById("previewimagecontainer").classList.add("none");
        document.getElementById("previewcontainer").classList.remove("none");
      }
      
    },
    show(link){ //Show in preview
        this.showimage(false)
      if (link === "") {
        this.maxDepth = 2;         
        this.previewdata = this.data;
      }
      if (link === "mainpath") {
        this.maxDepth = 1;         
        this.previewdata = util.getElem(this.data,this.datatosend.path);
      }
      if (link === "article") {
        let res = util.getElem(this.data, this.datatosend.path);
        res = util.getElem(res,this.datatosend.itemspath);
        this.maxDepth = 2;         
        this.previewdata = {article: res[0]};
      }
    },
    async test(inn){ //Tests and sets variable if possible
      if(inn === "path"){ //main path
        let path = document.getElementById(inn).value;
        let res = util.getElem(this.data, path);
        if(typeof res == "object"){
          this.maxDepth = 1;
          this.previewdata = res;
          this.datatosend.path = path;
          this.showimage(false);
          document.getElementById(inn).classList.add("set");
          document.getElementById(inn).nextSibling.classList.add("set");
        }else{
          alert("Mapping Error : Please verify the path value.")
        }
      }else if(inn === "itemspath"){ //articles path
        let mainpath = this.datatosend.path;
        let path = document.getElementById(inn).value;
        let res = util.getElem(this.data, mainpath);
        res = util.getElem(res,path);
        if(typeof res == "object"){
          this.datatosend.itemspath = path;
          this.maxDepth = 2;         
          this.previewdata = {article: res[0]};
          this.showimage(false);
          document.getElementById('ongletitem').disabled = false
          document.getElementById(inn).classList.add("set");
          document.getElementById(inn).nextSibling.classList.add("set");
          document.getElementById(inn).previousSibling.classList.add("set");
        }else{
          alert("Mapping Error : Please verify articles path value.")
        }
      }else if(inn === "title"){
        let title = document.getElementById(inn).value;
        if(title != undefined && title != null && title != ""){
          this.datatosend.title = title;
          document.getElementById(inn).classList.add("set");
          document.getElementById(inn).nextSibling.classList.add("set");
        }else{
          alert("Empty field : Feed Name")
        }
      }else if(inn === "icon"){ //Feed icon
        let mainpath = this.datatosend.path;
        let res = util.getElem(this.data, mainpath);
        let iconpath = document.getElementById(inn).value;
        res = util.getElem(res,iconpath);
        if(typeof res == "string"){ //TODO add format verifier (png jpg etc...)
          this.previewdata = res;
          this.datatosend.icon = res;
          document.getElementById("previewimage").setAttribute("src",res);
          this.showimage(true);
          document.getElementById(inn).classList.add("set");
          document.getElementById(inn).nextSibling.classList.add("set");
          document.getElementById(inn).previousSibling.classList.add("set");
          //console.log(JSON.parse(JSON.stringify(this.datatosend)))
        }else{
          alert("Mapping Error : Please verify "+inn+" path value.");
        }
      }else{ //article data paths
        let mainpath = this.datatosend.path;
        let itemspath = this.datatosend.itemspath;
        let path = document.getElementById(inn).value;
        let res = util.getElem(this.data, mainpath);
        res = util.getElem(res,itemspath);
        res = util.getElem(res[0],path);
        if(typeof res == "string"){
          await this.show("article");
          this.previewdata = {preview : res};
          this.datatosend[inn] = path;
          this.showimage(false);
          document.getElementById(inn).classList.add("set");
          document.getElementById(inn).nextSibling.classList.add("set");
          document.getElementById(inn).previousSibling.classList.add("set");

          //console.log(JSON.parse(JSON.stringify(this.datatosend)))
        }else{
          alert("Mapping Error : Please verify "+inn+" path value.");
        }
      }
    }
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
.adddetails{
  width: 100%;
  text-align: left;
}
.details-inner{
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 30%;
  padding: 10px 0;
  margin: auto;
}
.mainview{
  text-align: left;
  padding: 10px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}
.previewcontainer{
  height: 220px;
}
.ongletcontainer{
  display: flex;
  flex-direction: row;
  margin-bottom: 10px ;
}
.ongletbtn{
  width: 100%;
  outline: none;
  border: grey solid 1px;
  cursor: pointer;
}

.ongletbtn:disabled{
  cursor: not-allowed;
}
.ongletbtn:first-of-type{
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.ongletbtn:last-of-type{
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
.treeview{
  margin: auto;
  width: 50%;
  border: grey solid 1px;
  border-radius: 10px;
  padding: 5px;
  max-height: 200px;
  min-height: 200px;
}
#previewimage{
  width: 100px;
  height: 100px;
  margin: auto 0 !important;
}
.previewimagecontainer{
  display:flex;
  flex-direction:row;
  height: 250px;
}
.previewimagecontainer div{
  margin: auto;
}
.preview h3{
  text-align: center;
}

.adddetails p{
  margin: 5px 0;
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
.tree-view-item-value{
  color: red !important; 
}

.pathset{
  display: flex;
  flex-direction: row;
  padding: 10px 0;
}
.setting{
  min-width:100%;
}

.submit{
  position: absolute;
  bottom: 100px;
  right: 100px;
  text-align: right;
}
.submitbtn{
  width: 200px;
  height: 50px;
  border-radius: 10px;
  outline: none !important;
  cursor: pointer;
  border : none;
  background-color: rgb(62, 255, 95);
}
.submitbtn:hover{
  transform: scale(1.02);
}
.submitbtn:active{
  transform: scale(1);
}

.pathset .pathinput{
  border-radius: 8px;
  height: 30px;
  width: 100%;
  border-radius: 0px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border: none;
  outline: none;
  font-weight: normal;
  display: inline-block;
  background-color: white;
  box-shadow:  0 0 3px black;
  padding-left:10px ;
}
.pathset .pathinput:focus{
    box-shadow:  0 0 5px black;
}
.pathset .prevpath{
  height: 32px;
  margin: 0;
  padding: 0;
  padding-left: 5px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border: none;
  cursor: not-allowed;
  outline: none;
  display: inline-block;
  box-shadow:  0 0 3px black;
}
.pathset .itempath{
  border-radius: 8px;
  height: 30px;
  width: 100%;
  border-radius: 0px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border: none;
  outline: none;
  font-weight: normal;
  display: inline-block;
  background-color: white;
  box-shadow:  0 0 3px black;
  padding-left:10px ;
}

.pathset button{
  height: 32px;
  width: 30%;
  margin: 0;
  padding: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border: none;
  cursor: pointer;
  outline: none;
  display: inline-block;
  box-shadow:  0 0 3px black;
}
.pathset button:hover{
  transform: scale(1.02);
}
.pathset button:active{
  transform: scale(1);
}

.centerlinkform input[type="text"]{
  margin-top: 10px;
  border-radius: 0px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  height:60%;
  width:80%;
  border: none;
  outline: none;
  text-align: center;
  font-weight: normal;
  display: inline-block;
  background-color: white;
  box-shadow:  0 0 3px black;
  
}
.centerlinkform input[type="text"]:focus{
  background-color: rgba(248, 248, 248, 0.5);
    box-shadow:  0 0 5px black;
}
.centerlinkform button:hover{
  transform: scale(1.02);
}
.centerlinkform button:disabled{
  transform: scale(1);
  cursor: wait;
}
.centerlinkform input[type="text"]:disabled{
  transform: scale(1);
  cursor: wait;
}
.centerlinkform button:active{
  transform: scale(1);
}

.centerlinkform button{
  margin-top: 10px;
  padding: 0;
  height:62%;
  width:18%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border: none;
  cursor: pointer;
  outline: none;
  display: inline-block;
  box-shadow:  0 0 3px black;
}

@import url('../assets/styles/allpage.css');

.errormsg{
  color: red;
}

.none{
  display: none !important;
}
.set{
  box-shadow:  0 0 5px green !important;
}
.error{
  box-shadow:  0 0 5px red !important;
}

.ongletactive{
  transform: scale(1.05);
  background-color: rgb(255, 255, 255);
}
.onglet{
  height: 340px;
}

</style>
