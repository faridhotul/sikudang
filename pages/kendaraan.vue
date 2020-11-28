<template>
  <v-data-table
    :headers="headers"
    :items="listKendaraan"
    sort-by="id_kend"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>DATA PLAT KENDARAAN</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
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
                    <v-text-field
                      v-model="editedItem.plat_kend"
                      label="No Kendaraan"
                    ></v-text-field>
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
    <template v-slot:[`item.id_kend`]="{ item }">
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
      { text: 'No', align: 'start', sortable: true, value: 'id_kend' },
      { text: 'Nomor Kendaraan', value: 'plat_kend' },
      { text: 'Aksi', value: 'actions', sortable: false },
    ],
    kendaraan: [],
    editedIndex: -1,
    editedItem: {
      id_kend: 0,
      plat_kend: '',
    },
    defaultItem: {
      id_kend: 0,
      plat_kend: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Tambah Plat Kendaraan'
        : 'Edit Plat Kendaraan'
    },
    listKendaraan() {
      let i = 1
      return this.kendaraan.map((v) => {
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
    this.loadKendaraan()
  },

  methods: {
    async loadKendaraan() {
      const apikendaraan = await this.$axios.get('/api/kendaraan')
      this.kendaraan = apikendaraan.data.values
    },
    initialize() {
      this.kendaraan = [
        {
          plat_kend: '',
        },
      ]
    },

    editItem(item) {
      this.editedIndex = this.kendaraan.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.kendaraan.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const apikendaraan = await this.$axios.post('/api/deletekendaraan', {
        id_kend: this.editedItem.id_kend,
      })
      window.alert(apikendaraan.data.values)
      if (apikendaraan.data.status === 200) {
        this.loadKendaraan()
        this.closeDelete()
      }
      // this.kendaraan.splice(this.editedIndex, 1)
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
        // Object.assign(this.kendaraan[this.editedIndex], this.editedItem)
        const apikendaraan = await this.$axios.post('/api/updatekendaraan', {
          id_kend: this.editedItem.id_kend,
          plat_kend: this.editedItem.plat_kend,
        })
        window.alert(apikendaraan.data.values)
        if (apikendaraan.data.status === 200) {
          this.loadKendaraan()
          this.close()
        }
      } else {
        // this.kendaraan.push(this.editedItem)
        const apikendaraan = await this.$axios.post('/api/createkendaraan', {
          plat_kend: this.editedItem.plat_kend,
        })
        window.alert(apikendaraan.data.values)
        if (apikendaraan.data.status === 200) {
          this.loadKendaraan()
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
