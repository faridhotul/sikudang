<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Selamat datang di SI Permintaan Suku Cadang
        </v-card-title>
        <v-card-text>
          <p>
            Sistem Informasi Permintaan Suku Cadang adalah sebuah Sistem yang
            digunakan untuk melakukan permintaan suku cadang berbasis
            Progressive Web Apps. Sistem ini dilengkapi dengan Push
            Notification, sehingga apabila terdapat permintaan suku cadang yang
            masuk, maka akan muncul sebuah pesan/notifikasi
          </p>
          <p>Terimakasih telah menggunakan Sistem ini</p>
          <div class="text-xs-right">
            <em><small>&mdash; Faridhotul Khasanah</small></em>
          </div>
          <hr class="my-3" />
          <div justify="center" align="center">
            <v-icon> mdi-instagram </v-icon> @faridhotul_k |
            <v-icon> mdi-twitter </v-icon> @faridhotul_k |
            <v-icon> mdi-telegram </v-icon> @faridhotul_k
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    VuetifyLogo,
  },
}
</script>
