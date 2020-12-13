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
        <template v-for="item in items">
          <v-list-group
            v-if="$auth.user && item.access.includes($auth.user.tipe_user)"
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
        </template>
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
      <v-btn v-if="!notif" @click="notifSetup">Turn On Notification</v-btn>
      <v-btn v-else text disabled>Notif Hidup</v-btn>
      <v-btn text disabled>
        {{ $auth.user ? $auth.user.nama_user : 'Belum Login!' }}
      </v-btn>
      <v-btn @click.stop="logout"> Logout </v-btn>
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
          <v-list-item-action light>
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
      notif: false,
      socket: null,
      socketConnect: false,
      items: [
        {
          access: ['Admin'],
          action: 'mdi-view-dashboard',
          active: false,
          items: [
            { title: 'Suku Cadang', to: '/suku_cadang' },
            { title: 'Suku Cadang Masuk', to: '/sc_masuk' },
            { title: 'Suku Cadang Keluar', to: '/sc_keluar' },
            { title: 'Kendaraan', to: '/kendaraan' },
          ],
          title: 'MASTER',
        },
        {
          access: ['Admin', 'Peminta'],
          action: 'mdi-clipboard-check-outline',
          active: false,
          items: [
            { title: 'Permintaan', to: '/permintaan_sc' },
            // { title: 'Riwayat Permintaan', to: '/riwayat_permintaan' },
          ],
          title: 'PERMINTAAN',
        },
        {
          access: ['Admin'],
          action: 'mdi-card-text-outline',
          active: false,
          items: [{ title: 'Laporan Masuk-Keluar', to: '/lap_kel_msk' }],
          title: 'LAPORAN',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'SISTEM PERMINTAAN SUKU CADANG',
    }
  },
  mounted() {
    this.notifSetup()
  },
  methods: {
    logout() {
      this.$auth
        .logout()
        .then(() => {
          alert('Logout success')
          this.$router.push('/login')
        })
        .catch(() => {
          alert('Logout failed, please try again.')
        })
    },
    async notifSetup() {
      const granted = await this.notifRequestAndShowPermission()
      if (granted) {
        this.notifConnectSocket()
      }
    },
    async notifRequestAndShowPermission() {
      this.notif = false
      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification')
      } else if (Notification.permission === 'granted') {
        this.notif = true
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          this.notif = true
        }
      }
      return this.notif
    },
    notifConnectSocket() {
      // console.log('cek sudah sampai belum')
      this.socket = this.$nuxtSocket({
        path: '/ws',
      })
      this.socket.on('connect_error', () => {
        this.socketConnect = false
      })
      this.socket.on('connect', () => {
        this.socketConnect = true
        this.socket.on('disconnect', () => {
          this.socketConnect = false
        })
        this.socket.on('notif', (payload) => {
          if (this.$auth.user.tipe_user === payload.tipe_user) {
            this.notifShow({
              title: 'Halo ' + this.$auth.user.nama_user,
              body: payload.body || 'Kosong',
              href: '/permintaan_sc',
            })
          }
        })
      })
    },
    notifShow({ title, body, href }) {
      const icon = '/icon.png'
      const notification = new Notification(title, { body, icon })
      notification.onclick = () => {
        if (href) {
          window.open(href)
        } else {
          notification.close()
          window.parent.focus()
        }
      }
    },
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
