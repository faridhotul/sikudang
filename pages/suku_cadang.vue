<template>
  <v-data-table
    :headers="headers"
    :items="listSudang"
    sort-by="id_sc"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>DATA SUKU CADANG</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
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
                    <v-text-field
                      v-model="editedItem.nama_sc"
                      label="Suku Cadang"
                      placeholder="Oli"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.satuan_sc"
                      label="Satuan"
                      placeholder="pcs"
                      required
                    ></v-text-field>
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
    <template v-slot:[`item.id_sc`]="{ item }">
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
      { text: 'No', align: 'start', value: 'id_sc' },
      { text: 'Nama Suku Cadang', value: 'nama_sc' },
      { text: 'Satuan', value: 'satuan_sc' },
      { text: 'Aksi', value: 'actions', sortable: false },
    ],
    suku_cadang: [],
    editedIndex: -1,
    editedItem: {
      id_sc: 0,
      nama_sc: '',
      satuan_sc: '',
    },
    defaultItem: {
      id_sc: 0,
      nama_sc: '',
      satuan_sc: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Suku Cadang' : 'Edit Suku Cadang'
    },
    listSudang() {
      let i = 1
      return this.suku_cadang.map((v) => {
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
    this.loadsukucadang()
  },
  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.suku_cadang = [
        {
          nama_sc: '',
          satuan_sc: '',
        },
      ]
    },
    async loadsukucadang() {
      const apisukucadang = await this.$axios.get('/api/suku_cadang')
      this.suku_cadang = apisukucadang.data.values
    },

    editItem(item) {
      this.editedIndex = this.suku_cadang.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.suku_cadang.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const apideletesukucadang = await this.$axios.post(
        '/api/deletesukucadang',
        {
          id_sc: this.editedItem.id_sc,
        }
      )
      window.alert(apideletesukucadang.data.values)
      if (apideletesukucadang.data.status === 200) {
        this.loadsukucadang()
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
        const apiupdatesukucadang = await this.$axios.post(
          '/api/updatesukucadang',
          {
            id_sc: this.editedItem.id_sc,
            nama_sc: this.editedItem.nama_sc,
            satuan_sc: this.editedItem.satuan_sc,
          }
        )
        window.alert(apiupdatesukucadang.data.values)
        if (apiupdatesukucadang.data.status === 200) {
          this.loadsukucadang()
          this.close()
        }
      } else {
        // this.suku_cadang.push(this.editedItem)
        const apicreatesukucadang = await this.$axios.post(
          '/api/createsukucadang',
          {
            nama_sc: this.editedItem.nama_sc,
            satuan_sc: this.editedItem.satuan_sc,
          }
        )
        window.alert(apicreatesukucadang.data.values)
        if (apicreatesukucadang.data.status === 200) {
          this.loadsukucadang()
          this.close()
        }
      }
    },
  },
}
</script>
