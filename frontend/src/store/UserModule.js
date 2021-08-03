import firebase from 'firebase/app';
import { auth, userSettings } from '../firebase';
import router from '../router';

export const UserModule = {
  state: {
    profile: {}
  },
  getters: {
    userProfile(state) {
      return state.profile
    }
  },
  mutations: {
    setProfile(state, profile) {
      state.profile = profile;
    }
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      if (auth.currentUser) {
        const userInfo = (await userSettings.doc(auth.currentUser.uid).get()).data()
        const currentUser = {
          userId: auth.currentUser.uid,
          userInfo
        };
        commit('setProfile', currentUser);
        localStorage.setItem('TCOMUserProfile', JSON.stringify(currentUser));
        return currentUser;
      }
    },

    async register(context, payload) {
      try {
        const { user } = await firebase
          .auth()
          .createUserWithEmailAndPassword(payload.email, payload.password);
        return userSettings.doc(user.uid).set({
          crypto_currencies: [],
          list_keywords: [],
          default_currency: "EUR",
          role: "ROLE_USER",
          user: user.uid,
          nickname: payload.email ?? "",
          email: payload.email ?? "",
          first_name: payload.firstName ?? "",
          last_name: payload.lastName ?? "",
        });
      } catch (e) {
        console.error("signin error", e);
      }
    },
    async login({ commit }, payload) {
      try {
        const { user } = await firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password);
        const userInfo = (await userSettings.doc(user.uid).get()).data();

        const currentUser = {
          userId: user.uid,
          userInfo: { ...userInfo }
        };

        commit('setProfile', currentUser);
        console.log("TMP", currentUser);
        localStorage.setItem('TCOMUserProfile', JSON.stringify(currentUser));
        router.push({
          name: 'Home'
        });
      } catch (e) {
        console.error("login error", e);
      }
    },
    async loginWithFacebook() {
      try {
        const provider = new firebase.auth.FacebookAuthProvider();

        provider.setCustomParameters({
          'display': 'popup'
        });

        firebase.auth().signInWithPopup(provider).then(function(result) {
          var token = result.credential.accessToken;
          console.log("1: TOKEN", token);
          var user = result.user;
          console.log("2: USER", user);
        }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          console.log("3: ERROR", errorCode, errorMessage, email, credential);
        });
      } catch (e) {
        console.error("login error", e);
      }
    },
    async loginWithTwitter() {
      try {
        const provider = new firebase.auth.TwitterAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {
          var token = result.credential.accessToken;
          var secret = result.credential.secret;
          var user = result.user;
          console.log("Logged in", "token", token, "secret", secret, "user",user)
        }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          console.log("Error", "error code", errorCode, "error message", errorMessage, "email", email, "credential", credential)
        });
      } catch (e) {
        console.error("login error", e);
      }
    },
    async loginWithGoogle() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
          var token = result.credential.accessToken;
          var user = result.user;
          console.log("Login", token, "user", user);

        }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          console.log("Error", errorCode, "error message", errorMessage, "email", email, "credential", credential)
        });
      } catch (e) {
        console.error("login error", e);
      }
    },
    async logout({ commit }) {
      try {
        await auth.signOut();
        commit('setProfile', {});
        localStorage.removeItem('TCOMUserProfile');
        router.push({
          name: 'Authentication'
        })
      } catch (e) {
        console.log("logout error", e);
      }
    }

  },
  modules: {}
}
