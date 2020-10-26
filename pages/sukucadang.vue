<template>
  <v-data-table
    :headers="headers"
    :items="sudang"
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
                      v-model="editedItem.nama_sc"
                      label="Suku Cadang"
                      placeholder="Oli"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.stok_sc"
                      label="Stok"
                      placeholder="100"
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
    <template v-slot:[`item.id_sc`]="{ item }">
      <v-chip> {{ item.id_sc }} </v-chip>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'No', align: 'start', sortable: false, value: 'id_sc' },
      { text: 'Nama Suku Cadang', value: 'nama_sc' },
      { text: 'Stok', value: 'stok_sc' },
      { text: 'Satuan', value: 'satuan_sc' },
      { text: 'Aksi', value: 'actions', sortable: false },
    ],
    sudang: [],
    editedIndex: -1,
    editedItem: {
      id_sc: 0,
      nama_sc: '',
      stok_sc: 0,
      satuan_sc: '',
    },
    defaultItem: {
      id_sc: 0,
      nama_sc: '',
      stok_sc: 0,
      satuan_sc: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Suku Cadang' : 'Edit Suku Cadang'
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
      this.sudang = [
        {
          id_sc: 1,
          nama_sc: 'Kampas Rem',
          stok_sc: 500,
          satuan_sc: 'pcs',
        },
        {
          id_sc: 2,
          nama_sc: 'Oli Mesin',
          stok_sc: 1000,
          satuan_sc: 'liter',
        },
        {
          id_sc: 3,
          nama_sc: 'Ban Luar',
          stok_sc: 60,
          satuan_sc: 'pcs',
        },
        {
          id_sc: 4,
          nama_sc: 'Ban Dalam',
          stok_sc: 50,
          satuan_sc: 'pcs',
        },
      ]
    },

    editItem(item) {
      this.editedIndex = this.sudang.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.sudang.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.sudang.splice(this.editedIndex, 1)
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
        Object.assign(this.sudang[this.editedIndex], this.editedItem)
      } else {
        this.sudang.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
