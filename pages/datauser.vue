<template>
  <v-data-table
    :headers="headers"
    :items="listUser"
    sort-by="id_user"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>DATA USER SUKU CADANG</v-toolbar-title>
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
                    <v-text-field
                      v-model="editedItem.nama_user"
                      label="Nama User"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.tipe_user"
                      label="Nama User"
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
    <template v-slot:[`item.id_user`]="{ item }">
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
      { text: 'No', align: 'start', sortable: false, value: 'id_user' },
      { text: 'Nama User', value: 'nama_user' },
      { text: 'Tipe User', value: 'tipe_user' },
      { text: 'Username', value: 'username' },
      { text: 'Aksi', value: 'actions', sortable: false },
    ],
    datauser: [],
    editedIndex: -1,
    editedItem: {
      id_user: 0,
      nama_user: '',
      tipe_user: '',
      username: '',
    },
    defaultItem: {
      id_user: 0,
      nama_user: '',
      tipe_user: '',
      username: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Data User' : 'Edit Data User'
    },
    listUser() {
      let i = 1
      return this.datauser.map((v) => {
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
      this.datauser = [
        {
          nama_user: 'Chelsea',
          tipe_user: 'Peminta',
          username: 'chealse',
        },
        {
          nama_user: 'Chelsea',
          tipe_user: 'Peminta',
          username: 'chealse',
        },
        {
          nama_user: 'Chelsea',
          tipe_user: 'Peminta',
          username: 'chealse',
        },
        {
          nama_user: 'Chelsea',
          tipe_user: 'Peminta',
          username: 'chealse',
        },
        {
          nama_user: 'Chelsea',
          tipe_user: 'Peminta',
          username: 'chealse',
        },
      ]
    },

    editItem(item) {
      this.editedIndex = this.datauser.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.datauser.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.datauser.splice(this.editedIndex, 1)
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
        Object.assign(this.datauser[this.editedIndex], this.editedItem)
      } else {
        this.datauser.push(this.editedItem)
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
