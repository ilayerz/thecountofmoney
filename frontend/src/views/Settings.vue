<template>
  <form class="Settings tile">
    <header class="header">
      <h2
        class="title left"
        :class="{ active: !adminSettings }"
        @click="toggleSettings()"
      >
        User Settings
      </h2>
      <h2
        v-if="userProfile?.userInfo?.role === 'ROLE_ADMIN'"
        class="title right"
        :class="{ active: adminSettings }"
        @click="toggleSettings()"
      >
        App Settings
      </h2>
    </header>

    <UserSettings
      v-show="!adminSettings"
      :userProfile="userProfile"
      transition="fade"
    ></UserSettings>
    <AppSettings
      v-show="adminSettings && userProfile?.userInfo?.role === 'ROLE_ADMIN'"
      transition="fade"
    ></AppSettings>
  </form>
</template>

<script>
import { mapGetters } from "vuex";

import UserSettings from "../components/Settings/UserSettings";
import AppSettings from "../components/Settings/AppSettings";

export default {
  components: {
    UserSettings,
    AppSettings,
  },
  data: () => ({
    adminSettings: false,
  }),
  methods: {
    toggleSettings() {
      if (this.userProfile?.userInfo?.role !== 'ROLE_ADMIN') return;
      this.adminSettings = !this.adminSettings;
    },
  },
  computed: {
    ...mapGetters("user", ["userProfile"]),
  },
};
</script>

<style lang="scss" scoped>
.Settings {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  margin: 30px;
  width: calc(100% - 60px);
  // height: calc(100% - 60px - 71px);
  // max-height: calc(100% - 60px - 71px);

  .header {
    width: 100%;
    height: 70px;
    margin: 25px 0;

    .title {
      font-weight: 600;
      transition: all 1s ease-in-out 0.2s;
      cursor: pointer;

      &.left,
      &.right {
        position: absolute;
        color: lightslategrey;
        transform: translateX(0);
        &.active {
          color: black;
          transition: all 1s ease-in-out;
          cursor: default;
        }
      }
      &.left {
        left: 5%;
        &.active {
          left: 50%;
          transform: translateX(-50%);
        }
      }
      &.right {
        right: 5%;
        &.active {
          right: 50%;
          transform: translateX(50%);
        }
      }
    }
  }

  .user-settings,
  .app-settings {
    padding: 20px;
    max-height: calc(100% - 70px);
    .header {
      height: 50px;
      align-items: flex-start;
    }
  }
}

/* always present */
.expand-transition {
  transition: all .3s ease;
  opacity: 1;
}
/* .expand-enter defines the starting state for entering */
/* .expand-leave defines the ending state for leaving */
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}

@media all and (max-width: 850px) {
  .Settings {
    margin: 0;
    width: 100% ;
    height:  calc(100% - 71px);
    max-height:  calc(100% - 71px);
  }
  .tile{
  box-shadow: none;
  border-radius: 5px;
  }

}

</style>