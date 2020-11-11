<template>
  <v-data-table
    :headers="headers"
    :items="listKeluar"
    sort-by="id_kel"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>DATA SUKU CADANG KELUAR</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <div>
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Tambah
              </v-btn>
              <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
                Unduh
              </v-btn>
            </div>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.nama_sc"
                      label="Nama Suku Cadang"
                      :items="items"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.jml_sc_kel"
                      label="Jumlah Keluar"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="editedItem.tgl_sc_kel"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.tgl_sc_kel"
                          label="Tanggal Keluar"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.tgl_sc_kel"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(editedItem.tgl_sc_kel)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.plat_kend"
                      label="Nomor Kendaraan"
                      :items="items"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.nama_peminta"
                      label="Nama Peminta"
                      :items="items"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Anda yakin ingin menghapusnya?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
    <template v-slot:[`item.id_kel`]="{ item }">
      <v-chip> {{ item.nomor }}</v-chip>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data: () => ({
    menu: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'No', align: 'start', sortable: false, value: 'id_kel' },
      { text: 'Nama Suku Cadang', value: 'nama_sc' },
      { text: 'Jumlah Keluar', value: 'jml_sc_kel' },
      { text: 'Tanggal Keluar', value: 'tgl_sc_kel' },
      { text: 'Nomor Kendaraan', value: 'plat_kend' },
      { text: 'Nama Peminta', value: 'nama_peminta' },
      { text: 'Aksi', value: 'actions', sortable: false },
    ],
    items: [
      'Suku Cadang 1',
      'Suku Cadang  2',
      'Suku Cadang  3',
      'Suku Cadang  4',
    ],
    datakeluar: [],
    editedIndex: -1,
    editedItem: {
      id_kel: 0,
      nama_sc: '',
      jml_sc_kel: null,
      tgl_sc_kel: '',
      plat_kend: '',
      nama_peminta: '',
    },
    defaultItem: {
      id_kel: 0,
      nama_sc: '',
      jml_sc_kel: null,
      tgl_sc_kel: '',
      plat_kend: '',
      nama_peminta: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Data Keluar' : 'Edit Data'
    },
    listKeluar() {
      let i = 1
      return this.datakeluar.map((v) => {
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
      this.datakeluar = [
        {
          nama_sc: 'Kampas Kopling',
          jml_sc_kel: 100,
          tgl_sc_kel: '2020-11-18',
          plat_kend: 'AB 12345 KK',
          nama_peminta: 'Kendal',
        },
        {
          nama_sc: 'Kampas Kopling',
          jml_sc_kel: 100,
          tgl_sc_kel: '2020-11-18',
          plat_kend: 'AB 12345 KK',
          nama_peminta: 'Kendal',
        },
        {
          nama_sc: 'Kampas Kopling',
          jml_sc_kel: 100,
          tgl_sc_kel: '2020-11-18',
          plat_kend: 'AB 12345 KK',
          nama_peminta: 'Kendal',
        },
        {
          nama_sc: 'Kampas Kopling',
          jml_sc_kel: 100,
          tgl_sc_kel: '2020-11-18',
          plat_kend: 'AB 12345 KK',
          nama_peminta: 'Kendal',
        },
        {
          nama_sc: 'Kampas Kopling',
          jml_sc_kel: 100,
          tgl_sc_kel: '2020-11-18',
          plat_kend: 'AB 12345 KK',
          nama_peminta: 'Kendal',
        },
      ]
    },

    editItem(item) {
      this.editedIndex = this.datakeluar.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.datakeluar.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.datakeluar.splice(this.editedIndex, 1)
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
        Object.assign(this.datakeluar[this.editedIndex], this.editedItem)
      } else {
        this.datakeluar.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
