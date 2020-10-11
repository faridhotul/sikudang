<template>
  <v-container>
    <v-row no-gutters justify="center">
      <v-col cols="6" md="4">
        <v-card class="pa-4 section" outlined tile>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            class="text-center"
          >
            <h2 class="title has-text-centered">Login</h2>
            <v-text-field
              v-model="name"
              :rules="nameRules"
              label="Username"
              required
              filled
              rounded
            >
            </v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              label="Password"
              :rules="passRules"
              required
              filled
              rounded
            ></v-text-field>

            <v-checkbox
              v-model="checkbox"
              label="Ingatkan Saya"
              required
            ></v-checkbox>

            <template>
              <div class="text-center">
                <v-btn rounded color="#00BFA5" dark> Masuk </v-btn>
              </div>
            </template>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'llogin',
  data: () => ({
    valid: true,
    name: '',
    nameRules: [(v) => !!v || 'Masukkan Username Anda'],
    password: '',
    passRules: [(v) => !!v || 'Masukkan Password Anda'],
    select: null,
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    checkbox: false,
  }),

  methods: {
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>
<style>
.section {
  margin-top: 50% !important;
}
</style>
