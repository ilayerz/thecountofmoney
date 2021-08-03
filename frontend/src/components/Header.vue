<template>
  <header id="nav">
    <router-link class="homebtn" to="/">
    <div class="logo-container">
      <img
        class="header-logo"
        src="../assets/bitcoin-logo.png"
        alt="The Count Of Money"
      />
      <h1 class="header-title">The Count Of Money</h1>
    </div>
    </router-link>
    <div class="router-links flex-center-xy web">
      <router-link class="router-link flex-center-xy" to="/cryptos">
        All Currencies
      </router-link>
      <router-link class="router-link flex-center-xy" to="/articles">
        All Articles
      </router-link>
      <router-link class="router-link flex-center-xy" to="/feeds">
        Feeds
      </router-link>
    </div>
    <div class="profile-nav web" v-if="!isAuth">
      <router-link class="router-link flex-center-xy" to="/login">
        Login
      </router-link>
      <router-link
        class="router-link btn btn-blue signin flex-center-xy"
        to="/login"
      >
        Sign-in
      </router-link>
    </div>
    <div class="profile-nav web" v-else>
      <router-link class="router-link flex-center-xy web" to="/settings">
        Profile
      </router-link>
      <button class="btn btn-blue flex-center-xy web" to="/login" @click="logout()">
        Logout
      </button>
    </div>
    <div class="profile-nav">
      <button id="togglenav" class="showmenu" v-on:click.prevent="togglenavbar()">
      <svg class="svg-icon" viewBox="0 0 20 20">
							<path fill="black" d="M3.314,4.8h13.372c0.41,0,0.743-0.333,0.743-0.743c0-0.41-0.333-0.743-0.743-0.743H3.314
								c-0.41,0-0.743,0.333-0.743,0.743C2.571,4.467,2.904,4.8,3.314,4.8z M16.686,15.2H3.314c-0.41,0-0.743,0.333-0.743,0.743
								s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,15.2,16.686,15.2z M16.686,9.257H3.314
								c-0.41,0-0.743,0.333-0.743,0.743s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,9.257,16.686,9.257z"></path>
			</svg>
      </button>
    </div>

      <div id="mobilenav" class="mobilenav mobile none">
      <router-link class="router-link flex-center-xy" to="/cryptos">
        All Currencies
      </router-link>
      <router-link class="router-link flex-center-xy" to="/articles">
        All Articles
      </router-link>
      <router-link class="router-link flex-center-xy" to="/feeds">
        Feeds
      </router-link>
      
      

      <!--Profile-->
       <div class="navcol" v-if="!isAuth">
      <router-link class="router-link flex-center-xy" to="/login">
        Login
      </router-link>
      <router-link
        class="router-link btn btn-blue signin flex-center-xy"
        to="/login"
      >
        Sign-in
      </router-link>
    </div>
    <div class="navcol" v-else>
      <router-link class="router-link flex-center-xy" to="/settings">
        Profile
      </router-link>
      <button class="btn btn-blue" to="/login" @click="logout()">
        Logout
      </button>
    </div>
      </div>

  </header>
</template>

<script>
import { auth } from "../firebase";
import { mapActions } from "vuex";

export default {
  mounted() {
    auth.onAuthStateChanged(() => {
      console.log("changed");
      this.isAuth = !!auth?.currentUser;

      
window.addEventListener('click', function(e){   
  if ((document.getElementById('mobilenav').contains(e.target))||(document.getElementById('togglenav').contains(e.target))){
    // Clicked in box
  } else{
    if (!document.getElementById('mobilenav').classList.contains("none")) {
      hidenav();
    }
  }
});
    });
  },
  data: () => ({
    isAuth: false,
  }),
  methods: {
    ...mapActions("user", ["logout"]),

    togglenavbar(){
      if(document.getElementById('mobilenav').classList.contains("none")){
        shownav();
      }else{
        hidenav();
      }
    }
  },
};


function shownav() {
  document.getElementById('mobilenav').classList.remove("none");
}
function hidenav() {
  document.getElementById('mobilenav').classList.add("none");
}
</script>

<style lang="scss" scoped>
#nav {
  display: grid;
  grid-template-columns: 2fr 2fr 3fr;
  height: 70px;
  border-bottom: 1px solid #dcdcdc;

  .router-link {
    text-decoration: none;
    color: black;
    font-weight: 500;
    &:hover {
      background: #f1f1f1;
    }
  }


  .logo-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 50px;
    .header-logo {
      height: 45px;
      widows: 45px;
    }
    .header-title {
      font-weight: 600;
      font-size: 24px;
      padding-left: 15px;
    }
  }

  .router-links {
    .router-link {
      height: 100%;
      padding: 0 30px;
    }
  }
  .profile-nav {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 50px;
    .router-link {
      height: 20px;
      padding: 10px 20px;
      margin-right: 20px;
      &.signin {
        margin: 0;
        color: white;
        background: #0069d9;
        border-radius: 5px;
        &:hover {
          background: lighten(#0069d9, 10);
        }
      }
      &:hover {
        border-radius: 5px;
      }
    }
  }
}
@media only screen and (max-width: 1000px) {
  .header-title {
    display: none;
  }
}
@media only screen and (max-width: 850px) {

  .web{
    display: none;
  }
  .mobile{
    display: block !important;
  }
  .showmenu{
    display: block !important;
  }
}
  .homebtn{
    text-decoration: none !important;
    margin: auto;
    margin-left: 0;
    color: black;
  }
  .showmenu{
    width: 60px;
    height: 40px;
    border-radius: 5px;
    outline: none;
    display: none;
    background-color: #eee;
  }
  .showmenu svg{
    height: 100%;
    margin: auto;
  }

  .mobilenav{
    position: absolute;
    right: 0;
    top: 70px;
    z-index: 100 !important;
    background-color: white;
    border: 1px solid grey;
    width: 300px;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 5px;
    border-right: none;
    border-bottom-left-radius: 8px;
  }
  .none{
    display: none !important;
  }
  .navcol{
    display: flex;
    flex-direction: column;
    margin-top: 100px ;
  }
  .mobilenav .router-link{
    margin: 10px 0;
    margin-right: 0px !important;
  }
  .showmenu{
  }

</style>