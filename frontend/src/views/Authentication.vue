<template>
  <div class="authentication flex-center-xy">
    <form class="register-tile tile" @submit.prevent="handleRegister()">
      <header class="header">
        <h2 class="title">Register</h2>
      </header>
      <div class="container">
        <div class="register-form">
          <input
            class="input A"
            v-model="registerForm.firstName"
            type="text"
            placeholder="First Name"
          />
          <input
            class="input B"
            v-model="registerForm.lastName"
            type="text"
            placeholder="Last Name"
          />
          <input
            class="input C"
            v-model="registerForm.email"
            type="email"
            placeholder="E-mail Address"
          />
          <input
            class="input D"
            v-model="registerForm.password"
            type="password"
            placeholder="Password"
          />
          <input
            class="input E"
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
        </div>
      </div>
      <footer class="footer">
        <button type="submit" class="btn btn-blue">Submit</button>
      </footer>
    </form>

    <form class="login-tile tile" @submit.prevent="handleLogin()">
      <header class="header">
        <h2 class="title">Login</h2>
      </header>
      <div class="container">
        <div class="login-form">
          <input
            v-model="loginForm.email"
            class="input A"
            type="email"
            placeholder="Email"
          />
          <input
            v-model="loginForm.password"
            class="input B"
            type="password"
            placeholder="Password"
          />
          <div>
            <ul id="socials">
              <li class="social-button"><a href="#" v-on:click=loginFacebook();><i class="fa fa-facebook"></i></a></li>
              <li class="social-button"><a href="#" v-on:click=loginTwitter();><i class="fa fa-twitter"></i></a></li>
              <li class="social-button"><a href="#" v-on:click=loginGoogle();><i class="fa fa-google"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
      <footer class="footer">
        <button type="submit" class="btn btn-blue">Submit</button>
      </footer>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    registerForm: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    loginForm: {
      email: "",
      password: "",
    },
  }),
  methods: {
    ...mapActions("user", ["login", "register", "loginWithFacebook", "loginWithTwitter", "loginWithGoogle"]),
    async handleRegister() {
      if (this.registerForm.password === this.registerForm.confirmPassword) {
        await this.register(this.registerForm);
        alert("User has succesfully been created ! ✅");
      } else {
        alert("The Password didn't matched, try again ! 🙂");
      }
    },
    async handleLogin() {
      await this.login(this.loginForm);
    },
    async loginFacebook() {
      this.loginWithFacebook();
      await console.log("Facebook");
    },
    async loginTwitter() {
      this.loginWithTwitter();
      await console.log("Twitter");
    },
    async loginGoogle() {
      this.loginWithGoogle();
      await console.log("Google");
    }
  },
};
</script>

<style lang="scss" scoped>
.authentication {
  .tile {
    padding: 30px;
  }

  justify-content: space-evenly;
  height: calc(100vh - 71px);
  background: #f9f9f9;

  .register-tile,
  .login-tile {
    width: 40%;
    height: 80%;

    .container {
      margin-bottom: 20px;
    }
    .register-form,
    .login-form {
      display: grid;
      gap: 20px;
    }
    .register-form {
      grid-template-areas:
        "A B"
        "C C"
        "D D"
        "E E";
    }
    .login-form {
      grid-template-areas:
        "A"
        "B";
    }
  }


  /* Style all font awesome icons */
  .fa {
    padding: 20px;
    font-size: 30px;
    width: 30px;
    text-align: center;
    text-decoration: none;
    border-radius: 50%;
    margin-left: 40px;
    margin-top: 20px;
  }

  /* Add a hover effect if you want */
  .fa:hover {
    opacity: 0.7;
  }

  .social-button {
    display: inline;
    list-style: none; /* pour enlever les puces sur IE7 */
    margin: 10px;
  }

  #socials {
    display: inline;
    text-align: center;
    padding: 2px;
    margin: 0;
    width: 19%;
  }

  /* Set a specific color for each brand */

  /* Facebook */
  .fa-facebook {
    background: #3B5998;
    color: white;
  }

  /* Twitter */
  .fa-twitter {
    background: #55ACEE;
    color: white;
  }

  /* Twitter */
  .fa-google {
    background: #dd4b39;
    color: white;
  }
}
</style>
