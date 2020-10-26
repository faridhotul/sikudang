<template>
  <v-card ref="form">
    <v-card-text>
      <v-toolbar-title>TAMBAH DATA PEMINTA</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-text-field
        ref="peminta"
        v-model="name"
        :rules="[() => !!name || 'Data Peminta Kendaraan tidak boleh kosong']"
        :error-messages="errorMessages"
        label="Data Peminta"
        placeholder="Misha Karim"
        required
        filled
        rounded
        class="v-text-field fieldset v-text-field v-input__control v-text-field v-input__slot"
      ></v-text-field>
    </v-card-text>
    <v-divider class="mt-12"></v-divider>
    <v-card-actions>
      <v-btn color="primary" text @click="submit"> Submit </v-btn>
      <v-btn text> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    errorMessages: '',
    name: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    country: null,
    formHasErrors: false,
  }),

  computed: {
    form() {
      return {
        name: this.name,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
      }
    },
  },

  watch: {
    name() {
      this.errorMessages = ''
    },
  },

  methods: {
    addressCheck() {
      this.errorMessages = this.address && !this.name ? 'Wajib diisi' : ''

      return true
    },
    resetForm() {
      this.errorMessages = []
      this.formHasErrors = false

      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset()
      })
    },
    submit() {
      this.formHasErrors = false

      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) this.formHasErrors = true

        this.$refs[f].validate(true)
      })
    },
  },
}
</script>
<style scoped>
.v-input__slot {
  width: 20% !important;
}
.v-text-field fieldset,
.v-text-field .v-input__control,
.v-text-field {
  border-radius: 20px;
}
.v-application .mt-12 {
  margin-top: 0px !important;
}
</style>
