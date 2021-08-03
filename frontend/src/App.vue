<template>
  <Header></Header>
  <router-view />
</template>

<script>
import { mapState, mapActions } from "vuex";
import Header from "./components/Header";

export default {
  components: {
    Header,
  },
  async mounted() {
    await this.fetchCurrentUser();
    console.log("app mounted", this.user.profile);
  },
  methods: {
    ...mapActions("user", ["fetchCurrentUser"]),
  },
  computed: {
    ...mapState("user", { user: (state) => state }),
  },
};
</script>

<style lang="scss">
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100vh;
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.flex-center-xy {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.tile {
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    .title {
      font-size: 28px;
      font-weight: 400;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.input {
  font-size: 14px;
  padding: 10px 15px;
  border: 1px solid #dcdcdc;
  border-radius: 3px;
}

.btn {
  font-size: 18px;
  font-weight: 500;
  padding: 10px 20px;
  background: white;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  z-index: 10;
  cursor: pointer;
  &.btn-blue {
    color: white;
    background: #0069d9;
    &:hover {
      background: lighten(#0069d9, 10);
    }
  }
}

.A {
  grid-area: A;
}
.B {
  grid-area: B;
}
.C {
  grid-area: C;
}
.D {
  grid-area: D;
}
.E {
  grid-area: E;
}
.F {
  grid-area: F;
}
.G {
  grid-area: G;
}

.check-table {
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  overflow: hidden;
  header, .header {
    display: grid;
    grid-template-columns: 1fr 4fr;
    justify-items: center;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid #dcdcdc;
  }
  .body {
    height: 100%;
    width: 100%;
    overflow-y: scroll;

    .row {
      display: grid;
      grid-template-columns: 2fr 7fr;
      justify-items: center;
      align-items: center;
      height: 40px;
    }
  }
}


</style>
