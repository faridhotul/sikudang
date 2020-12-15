<template>
  <v-data-table
    :headers="headers"
    :items="listLaporan"
    sort-by="id_riw"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>LAPORAN SUKU CADANG</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      <v-icon>fas fa-list</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
    <template v-slot:[`item.id_lap`]="{ item }">
      <v-chip> {{ item.nomor }}</v-chip>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'No', align: 'start', value: 'id_lap' },
      { text: 'Nama Suku Cadang', value: 'nama_sc' },
      { text: 'Jumlah Keluar', value: 'jml_sc_kel' },
      { text: 'Jumlah Masuk', value: 'jml_sc_msk' },
      { text: 'Stok Akhir', value: 'stock_akhir' },
    ],
    lap_kel_msk: [],
    editedIndex: -1,
    editedItem: {
      id_lap: 0,
      nama_sc: '',
      jml_sc_kel: null,
      jml_sc_msk: null,
      stock_akhir: null,
    },
    defaultItem: {
      id_lap: 0,
      nama_sc: '',
      jml_sc_kel: null,
      jml_sc_msk: null,
      stock_akhir: null,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    listLaporan() {
      let i = 1
      return this.lap_kel_msk.map((v) => {
        v.nomor = i++
        return v
      })
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  async mounted() {
    const apilapkelmsk = await this.$axios.get('/api/lap_kel_msk')
    this.lap_kel_msk = apilapkelmsk.data.values
  },
  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.lap_kel_msk = [
        {
          nama_sc: '',
          jml_sc_kel: null,
          jml_sc_msk: null,
          stock_akhir: null,
        },
      ]
    },

    editItem(item) {
      this.editedIndex = this.lap_kel_msk.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.lap_kel_msk.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.lap_kel_msk.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
}
</script>
