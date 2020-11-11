/* eslint-disable vue/no-template-key */
<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            :to="child.to"
            router
            exact
            link
          >
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          action: 'mdi-silverware-fork-knife',
          active: false,
          items: [
            { title: 'Suku Cadang', to: '/sukucadang' },
            { title: 'Suku Cadang Masuk', to: '/datamasuk' },
            { title: 'Suku Cadang Keluar', to: '/datakeluar' },
            { title: 'Kendaraan', to: '/datakendaraan' },
            { title: 'Peminta', to: '/datapeminta' },
          ],
          title: 'MASTER',
        },
        {
          action: 'mdi-silverware-fork-knife',
          active: false,
          items: [
            { title: 'Permintaan', to: '/permintaan' },
            { title: 'Riwayat Permintaan', to: '/riwayat' },
          ],
          title: 'PERMINTAAN',
        },
        {
          action: 'mdi-silverware-fork-knife',
          active: false,
          items: [{ title: 'Laporan Masuk-Keluar', to: '/laporansudang' }],
          title: 'LAPORAN',
        },
        {
          action: 'mdi-silverware-fork-knife',
          active: false,
          items: [{ title: 'Keluar', to: '/laporansudang' }],
          title: 'PENGATURAN',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'SISTEM PERMINTAAN SUKU CADANG',
    }
  },
}
</script>
<style scoped>
.v-application {
  background-color: #e5e5e5;
}
.v-navigation-drawer {
  background-color: #00baa6;
}
.v-app-bar.v-toolbar.v-sheet {
  background-color: #ffffff;
}
.v-list-item__title {
  color: #ffffff;
}
.v-icon {
  color: #ffffff;
}
</style>
