<template>
  <v-data-table
    :headers="headers"
    :items="listPermintaan"
    sort-by="id_per_sc"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>DATA PERMINTAAN SUKU CADANG</v-toolbar-title>
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
          <v-form ref="form" v-model="valid" lazy-validation>
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
                        :rules="[
                          (v) => !!v || 'Nama Suku Cadang tidak boleh kosong',
                        ]"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.jml_per_sc"
                        label="Jumlah Permintaan"
                        required
                        :rules="[
                          (v) => !!v || 'Jumlah Permintaan tidak boleh kosong',
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.id_kend"
                        label="Nomor Kendaraan"
                        :items="nomor_kend"
                        item-text="plat_kend"
                        item-value="id_kend"
                        required
                        :rules="[
                          (v) => !!v || 'Nomor Kendaraan tidak boleh kosong',
                        ]"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="editedItem.tgl_per_sc"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.tgl_per_sc"
                            label="Tanggal Permintaan"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.tgl_per_sc"
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
                            @click="$refs.menu.save(editedItem.tgl_per_sc)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.id_user"
                        label="Nama User"
                        :items="peminta"
                        item-text="nama_user"
                        item-value="id_user"
                        required
                        :rules="[(v) => !!v || 'Nama User tidak boleh kosong']"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
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
        <v-dialog v-model="dialogDetail" max-width="500px">
          <v-card v-if="detailValue !== null">
            <v-card-title class="headline">Detail Permintaan</v-card-title>
            <v-card-text>
              <ul>
                <li><b>Nama Suku Cadang : </b> {{ detailValue.nama_sc }}</li>
                <li>
                  <b>Jumlah Permintaan : </b> {{ detailValue.jml_per_sc }}
                </li>
                <li><b>Nomor Kendaraan : </b> {{ detailValue.plat_kend }}</li>
                <li>
                  <b>Tanggal Permintaan : </b> {{ detailValue.tgl_per_sc }}
                </li>
                <li><b>Nama User : </b> {{ detailValue.nama_user }}</li>
                <li><b>Status : </b> {{ detailValue.status_per_sc }}</li>
              </ul>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDetail"
                >Tutup</v-btn
              >
              <v-btn
                v-if="detailValue.status_per_sc == 'Diajukan'"
                color="blue darken-1"
                text
                @click="tolak"
                >Tolak</v-btn
              >
              <v-btn
                v-if="detailValue.status_per_sc == 'Diajukan'"
                color="blue darken-1"
                text
                @click="setuju"
                >Setujui</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="DetailItem(item)">
        mdi-information
      </v-icon>
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
    <template v-slot:[`item.id_per_sc`]="{ item }">
      <v-chip> {{ item.nomor }}</v-chip>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data: () => ({
    valid: true,
    menu: false,
    dialog: false,
    dialogDelete: false,
    dialogDetail: false,
    detailValue: null,
    headers: [
      { text: 'No', align: 'start', sortable: false, value: 'id_per_sc' },
      { text: 'Nama Suku Cadang', value: 'nama_sc' },
      { text: 'Jumlah Permintaan', value: 'jml_per_sc' },
      { text: 'Nomor Kendaraan', value: 'plat_kend' },
      { text: 'Tanggal', value: 'tgl_per_sc' },
      { text: 'Nama Peminta', value: 'nama_user' },
      { text: 'Status', value: 'status_per_sc' },
      { text: 'Aksi', value: 'actions', sortable: false },
    ],
    suku_cadang: [],
    nomor_kend: [],
    peminta: [],
    permintaan_sc: [],
    editedIndex: -1,
    editedItem: {
      id_per_sc: 0,
      id_sc: null,
      nama_sc: '',
      jml_per_sc: null,
      id_kend: null,
      plat_kend: '',
      tgl_per_sc: '',
      id_user: null,
      nama_user: '',
      status_per_sc: '',
    },
    defaultItem: {
      id_per_sc: 0,
      id_sc: null,
      nama_sc: '',
      jml_per_sc: null,
      id_kend: null,
      plat_kend: '',
      tgl_per_sc: '',
      id_user: null,
      nama_user: '',
      status_per_sc: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Permintaan' : 'Edit Permintaan'
    },
    listPermintaan() {
      let i = 1
      return this.permintaan_sc.map((v) => {
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
    dialogDetail(val) {
      val || this.closeDetail()
    },
  },

  mounted() {
    this.loadPermintaan()
    this.loadSukuCadang()
    this.loadnomorkend()
    this.loadpeminta()
  },

  created() {
    this.initialize()
  },

  methods: {
    async loadPermintaan() {
      const apipermintaansc = await this.$axios.get('/api/permintaan_sc')
      this.permintaan_sc = apipermintaansc.data.values
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

    initialize() {
      this.permintaan_sc = [
        {
          jml_per_sc: null,
          tgl_per_sc: '',
          status_per_sc: '',
        },
      ]
      this.suku_cadang = [{ nama_sc: '' }]
      this.nomor_kend = [{ plat_kend: '' }]
      this.permintaan = [{ nama_user: '' }]
    },
    DetailItem(item) {
      this.detailValue = item
      this.dialogDetail = true
    },

    editItem(item) {
      this.editedIndex = this.permintaan_sc.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.permintaan_sc.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const apideletepermintaan = await this.$axios.post(
        '/api/deletepermintaan_sc',
        {
          id_per_sc: this.editedItem.id_per_sc,
        }
      )
      window.alert(apideletepermintaan.data.values)
      if (apideletepermintaan.data.status === 200) {
        this.loadPermintaan()
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
    closeDetail() {
      this.dialogDetail = false
    },

    async tolak() {
      const apiupdatetolak = await this.$axios.post(
        '/api/updatestatuspermintaan',
        {
          id_per_sc: this.detailValue.id_per_sc,
          status_per_sc: 'Ditolak',
        }
      )
      window.alert(apiupdatetolak.data.values)
      if (apiupdatetolak.data.status === 200) {
        this.loadPermintaan()
        this.closeDetail()
      }
    },
    async setuju() {
      const apiupdatesetuju = await this.$axios.post(
        '/api/updatestatuspermintaan',
        {
          id_per_sc: this.detailValue.id_per_sc,
          status_per_sc: 'Disetujui',
        }
      )
      window.alert(apiupdatesetuju.data.values)
      if (apiupdatesetuju.data.status === 200) {
        this.loadPermintaan()
        this.closeDetail()
      }
    },

    async save() {
      if (this.editedIndex > -1) {
        const apiupdatepermintaan = await this.$axios.post(
          '/api/updatepermintaan_sc',
          {
            id_per_sc: this.editedItem.id_per_sc,
            id_sc: this.editedItem.id_sc,
            jml_per_sc: this.editedItem.jml_per_sc,
            id_kend: this.editedItem.id_kend,
            id_user: this.editedItem.id_user,
            tgl_per_sc: this.editedItem.tgl_per_sc,
          }
        )
        window.alert(apiupdatepermintaan.data.values)
        if (apiupdatepermintaan.data.status === 200) {
          this.loadPermintaan()
          this.close()
        }
      } else {
        // this.suku_cadang.push(this.editedItem)
        const apicreatepermintaan = await this.$axios.post(
          '/api/createpermintaan_sc',
          {
            id_sc: this.editedItem.id_sc,
            jml_per_sc: this.editedItem.jml_per_sc,
            id_kend: this.editedItem.id_kend,
            id_user: this.editedItem.id_user,
            nama_sc: this.editedItem.nama_sc,
            tgl_per_sc: this.editedItem.tgl_per_sc,
            status_per_sc: (this.editedItem.status_per_sc = 'Diajukan'),
          }
        )
        window.alert(apicreatepermintaan.data.values)
        if (apicreatepermintaan.data.status === 200) {
          this.loadPermintaan()
          this.$refs.form.resetValidation()
          this.close()
        }
      }
    },
  },
}
</script>
