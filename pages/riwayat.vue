<template>
  <v-data-table
    :headers="headers"
    :items="listRiwayat"
    sort-by="id_riw"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>RIWAYAT PERMINTAAN SUKU CADANG</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <div>
              <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
                Unduh
              </v-btn>
            </div>
          </template>
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
    <template v-slot:[`item.id_riw`]="{ item }">
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
      { text: 'No', align: 'start', sortable: false, value: 'id_riw' },
      { text: 'Nama Suku Cadang', value: 'nama_sc' },
      { text: 'Jumlah Permintaan', value: 'jml_per_sc' },
      { text: 'Nomor Kendaraan', value: 'plat_kend' },
      { text: 'Tanggal Permintaan', value: 'tgl_per_sc' },
      { text: 'Nama Peminta', value: 'nama_peminta' },
      { text: 'Status', value: 'status_per_sc' },
      { text: 'Aksi', value: 'actions', sortable: false },
    ],
    riwayat: [],
    editedIndex: -1,
    editedItem: {
      id_riw: 0,
      nama_sc: '',
      plat_kend: '',
      tgl_per_sc: Date,
      nama_peminta: '',
      status_per_sc: '',
    },
    defaultItem: {
      id_riw: 0,
      nama_sc: '',
      plat_kend: '',
      tgl_per_sc: Date,
      nama_peminta: '',
      status_per_sc: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    listRiwayat() {
      let i = 1
      return this.riwayat.map((v) => {
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

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.riwayat = [
        {
          nama_sc: 'Kampas Kopling',
          plat_kend: 'AB 12345 HH',
          tgl_per_sc: '',
          nama_peminta: 'Albany',
          status_per_sc: 'Diterima',
        },
        {
          nama_sc: 'Kampas Kopling',
          plat_kend: 'AB 12345 HH',
          tgl_per_sc: '',
          nama_peminta: 'Albany',
          status_per_sc: 'Diterima',
        },
        {
          nama_sc: 'Kampas Kopling',
          plat_kend: 'AB 12345 HH',
          tgl_per_sc: '',
          nama_peminta: 'Albany',
          status_per_sc: 'Diterima',
        },
        {
          nama_sc: 'Kampas Kopling',
          plat_kend: 'AB 12345 HH',
          tgl_per_sc: '',
          nama_peminta: 'Albany',
          status_per_sc: 'Diterima',
        },
        {
          nama_sc: 'Kampas Kopling',
          plat_kend: 'AB 12345 HH',
          tgl_per_sc: '',
          nama_peminta: 'Albany',
          status_per_sc: 'Diterima',
        },
        {
          nama_sc: 'Kampas Kopling',
          plat_kend: 'AB 12345 HH',
          tgl_per_sc: '',
          nama_peminta: 'Albany',
          status_per_sc: 'Diterima',
        },
      ]
    },

    editItem(item) {
      this.editedIndex = this.riwayat.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.riwayat.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.riwayat.splice(this.editedIndex, 1)
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.riwayat[this.editedIndex], this.editedItem)
      } else {
        this.riwayat.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
