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
                        v-model="editedItem.nama_sc"
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
                        v-model="editedItem.plat_kend"
                        label="Nomor Kendaraan"
                        :items="items"
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
                        v-model="editedItem.nama_user"
                        label="Nama User"
                        :items="items"
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
    items: ['item1', 'item2', 'item3'],
    permintaan_sc: [],
    editedIndex: -1,
    editedItem: {
      id_per_sc: 0,
      nama_sc: '',
      jml_per_sc: null,
      plat_kend: '',
      tgl_per_sc: '',
      nama_user: '',
      status_per_sc: '',
      ket_per_sc: '',
    },
    defaultItem: {
      id_per_sc: 0,
      nama_sc: '',
      jml_per_sc: null,
      plat_kend: '',
      tgl_per_sc: '',
      nama_user: '',
      status_per_sc: '',
      ket_per_sc: '',
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
  async mounted() {
    const apipermintaansc = await this.$axios.get('/api/permintaan_sc')
    this.permintaan_sc = apipermintaansc.data.values

    const apilistsc = await this.$axios.get('/api/suku_cadang')
    this.suku_cadang = apilistsc.data.values
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.permintaan_sc = [
        {
          jml_per_sc: null,
          plat_kend: '',
          tgl_per_sc: '',
          nama_user: '',
          status_per_sc: '',
        },
      ]
      this.suku_cadang = [{ nama_sc: '' }]
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

    deleteItemConfirm() {
      this.permintaan_sc.splice(this.editedIndex, 1)
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
    closeDetail() {
      this.dialogDetail = false
    },

    tolak() {
      this.detailValue.status_per_sc = 'Ditolak'
      this.close()
    },
    setuju() {
      this.detailValue.status_per_sc = 'Disetujui'
      this.close()
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          Object.assign(this.permintaan_sc[this.editedIndex], this.editedItem)
        } else {
          this.editedItem.status_per_sc = 'Diajukan'
          this.permintaan_sc.push(this.editedItem)
        }
        this.close()
      }
    },
  },
}
</script>
