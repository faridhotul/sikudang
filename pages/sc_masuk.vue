<template>
  <v-data-table
    :headers="headers"
    :items="listMasuk"
    sort-by="id_msk"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>DATA SUKU CADANG MASUK</v-toolbar-title>
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
                        v-model="editedItem.jml_sc_msk"
                        label="Jumlah Masuk"
                        :rules="[(v) => !!v || 'Jumlah tidak boleh kosong']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="editedItem.tgl_sc_msk"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.tgl_sc_msk"
                            label="Tanggal Masuk"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            :rules="[
                              (v) => !!v || 'Tanggal tidak boleh kosong',
                            ]"
                            required
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.tgl_sc_msk"
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
                            @click="$refs.menu.save(editedItem.tgl_sc_msk)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
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
    <template v-slot:[`item.id_msk`]="{ item }">
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
    headers: [
      { text: 'No', align: 'start', value: 'id_msk' },
      { text: 'Nama Suku Cadang', value: 'nama_sc' },
      { text: 'Jumlah Masuk', value: 'jml_sc_msk' },
      { text: 'Tanggal Masuk', value: 'tgl_sc_msk' },
      { text: 'Aksi', value: 'actions', sortable: false },
    ],
    suku_cadang: [],
    sc_masuk: [],
    editedIndex: -1,
    editedItem: {
      id_msk: 0,
      id_sc: null,
      nama_sc: '',
      jml_sc_msk: null,
      tgl_sc_msk: '',
    },
    defaultItem: {
      id_msk: 0,
      id_sc: null,
      nama_sc: '',
      jml_sc_msk: null,
      tgl_sc_msk: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Suku Cadang' : 'Edit Suku Cadang'
    },
    listMasuk() {
      let i = 1
      return this.sc_masuk.map((v) => {
        v.tgl_sc_msk = this.$dateFns.format(
          new Date(v.tgl_sc_msk || null),
          'yyyy-MM-dd'
        )
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
  mounted() {
    this.loadscmasuk()
    this.loadSukuCadang()
  },

  created() {
    this.initialize()
  },

  methods: {
    async loadscmasuk() {
      const apiscmasuk = await this.$axios.get('/api/sc_masuk')
      this.sc_masuk = apiscmasuk.data.values
    },
    async loadSukuCadang() {
      const apilistsc = await this.$axios.get('/api/suku_cadang')
      this.suku_cadang = apilistsc.data.values
    },
    initialize() {
      this.sc_masuk = [
        {
          jml_sc_msk: '',
          tgl_sc_msk: '',
        },
      ]
      this.suku_cadang = [{ nama_sc: '' }]
    },

    editItem(item) {
      this.editedIndex = this.sc_masuk.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.sc_masuk.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const apideletescmsk = await this.$axios.post('/api/deletesc_masuk', {
        id_msk: this.editedItem.id_msk,
      })
      window.alert(apideletescmsk.data.values)
      if (apideletescmsk.data.status === 200) {
        this.loadscmasuk()
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
        const apiupdatescmsk = await this.$axios.post('/api/updatesc_masuk', {
          id_msk: this.editedItem.id_msk,
          jml_sc_msk: this.editedItem.jml_sc_msk,
          tgl_sc_msk: this.editedItem.tgl_sc_msk,
          id_sc: this.editedItem.id_sc,
        })
        window.alert(apiupdatescmsk.data.values)
        if (apiupdatescmsk.data.status === 200) {
          this.loadscmasuk()
          this.close()
        }
      } else {
        // this.suku_cadang.push(this.editedItem)
        const apicreatescmsk = await this.$axios.post('/api/createsc_masuk', {
          jml_sc_msk: this.editedItem.jml_sc_msk,
          tgl_sc_msk: this.editedItem.tgl_sc_msk,
          id_sc: this.editedItem.id_sc,
        })
        window.alert(apicreatescmsk.data.values)
        if (apicreatescmsk.data.status === 200) {
          this.loadscmasuk()
          this.$refs.form.resetValidation()
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
