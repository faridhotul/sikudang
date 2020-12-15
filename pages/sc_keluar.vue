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
                      v-model="editedItem.id_sc"
                      label="Nama Suku Cadang"
                      :items="suku_cadang"
                      item-text="nama_sc"
                      item-value="id_sc"
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
                          Batal
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
                      v-model="editedItem.id_kend"
                      label="Nomor Kendaraan"
                      :items="nomor_kend"
                      item-text="plat_kend"
                      item-value="id_kend"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.id_user"
                      label="Nama User"
                      :items="peminta"
                      item-text="nama_user"
                      item-value="id_user"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Batal </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Simpan </v-btn>
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
                >Batal</v-btn
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
      { text: 'No', align: 'start', value: 'id_kel' },
      { text: 'Nama Suku Cadang', value: 'nama_sc' },
      { text: 'Jumlah Keluar', value: 'jml_sc_kel' },
      { text: 'Tanggal Keluar', value: 'tgl_sc_kel' },
      { text: 'Nomor Kendaraan', value: 'plat_kend' },
      { text: 'Nama Peminta', value: 'nama_user' },
      { text: 'Aksi', value: 'actions', sortable: false },
    ],
    suku_cadang: [],
    nomor_kend: [],
    peminta: [],
    sc_keluar: [],
    editedIndex: -1,
    editedItem: {
      id_kel: 0,
      id_sc: null,
      nama_sc: '',
      jml_sc_kel: null,
      tgl_sc_kel: '',
      id_kend: null,
      plat_kend: '',
      id_user: null,
      nama_user: '',
    },
    defaultItem: {
      id_kel: 0,
      id_sc: null,
      nama_sc: '',
      jml_sc_kel: null,
      tgl_sc_kel: '',
      id_kend: null,
      plat_kend: '',
      id_user: null,
      nama_user: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Data Keluar' : 'Edit Data'
    },
    listKeluar() {
      let i = 1
      return this.sc_keluar.map((v) => {
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
  mounted() {
    this.loadsckeluar()
    this.loadSukuCadang()
    this.loadnomorkend()
    this.loadpeminta()
  },

  methods: {
    initialize() {
      this.sc_keluar = [
        {
          nama_sc: '',
          jml_sc_kel: null,
          tgl_sc_kel: '',
        },
      ]
      this.suku_cadang = [{ nama_sc: '' }]
      this.nomor_kend = [{ plat_kend: '' }]
      this.permintaan = [{ nama_user: '' }]
    },
    async loadsckeluar() {
      const apisckeluar = await this.$axios.get('/api/sc_keluar')
      this.sc_keluar = apisckeluar.data.values
    },
    async loadSukuCadang() {
      const apilistsc = await this.$axios.get('/api/suku_cadang')
      this.suku_cadang = apilistsc.data.values
    },
    async loadnomorkend() {
      const apilistnokend = await this.$axios.get('/api/kendaraan')
      this.nomor_kend = apilistnokend.data.values
    },
    async loadpeminta() {
      const apilistpeminta = await this.$axios.get('/api/users')
      this.peminta = apilistpeminta.data.values
    },

    editItem(item) {
      this.editedIndex = this.sc_keluar.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.sc_keluar.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const apideletesckeluar = await this.$axios.post('/api/deletesc_keluar', {
        id_kel: this.editedItem.id_kel,
      })
      window.alert(apideletesckeluar.data.values)
      if (apideletesckeluar.data.status === 200) {
        this.loadsckeluar()
        this.closeDelete()
      }
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

    async save() {
      if (this.editedIndex > -1) {
        const apiupdatesckeluar = await this.$axios.post(
          '/api/updatesc_keluar',
          {
            id_kel: this.editedItem.id_kel,
            id_sc: this.editedItem.id_sc,
            jml_sc_kel: this.editedItem.jml_sc_kel,
            tgl_sc_kel: this.editedItem.tgl_sc_kel,
            id_kend: this.editedItem.id_kend,
            id_user: this.editedItem.id_user,
          }
        )
        window.alert(apiupdatesckeluar.data.values)
        if (apiupdatesckeluar.data.status === 200) {
          this.loadsckeluar()
          this.close()
        }
      } else {
        // this.suku_cadang.push(this.editedItem)
        const apicreatesckeluar = await this.$axios.post(
          '/api/createsc_keluar',
          {
            id_sc: this.editedItem.id_sc,
            jml_sc_kel: this.editedItem.jml_sc_kel,
            tgl_sc_kel: this.editedItem.tgl_sc_kel,
            id_kend: this.editedItem.id_kend,
            id_user: this.editedItem.id_user,
          }
        )
        window.alert(apicreatesckeluar.data.values)
        if (apicreatesckeluar.data.status === 200) {
          this.loadsckeluar()
          this.close()
        }
      }
    },
  },
}
</script>
<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
