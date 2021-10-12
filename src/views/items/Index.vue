<template>
  <div class="container mt-custom">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>DATA ITEMS</h4>
            <hr />
            <router-link :to="{ name: 'items.create' }" class="btn btn-md btn-success">TAMBAH ITEM</router-link>

            <table class="table table-striped table-bordered mt-4">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ formatRupiah(item.unit_price) }} /{{ item.unit }}</td>
                  <td>{{ item.stock }}</td>
                  <td class="text-center">
                    <router-link :to="{ name: 'items.edit', params: { id: item.id } }" class="btn btn-sm btn-primary mr-1">EDIT</router-link> |
                    <a href="javascript:void(0)" @click="deleteItem($event, item.id)" class="btn btn-sm btn-danger mr-1">DELETE</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { onMounted, ref } from "vue";

export default {
  setup() {
    let items = ref([]);

    onMounted(() => {
      getDataitems();
    });

    function formatRupiah(angka, prefix = "Rp") {
      var number_string = angka.toString().replace(/[^,\d]/g, ""),
        split = number_string.split(","),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

      if (ribuan) {
        const separator = sisa ? "." : "";
        rupiah += separator + ribuan.join(".");
      }

      rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
      return prefix == undefined ? rupiah : rupiah ? "Rp" + rupiah : "";
    }

    function getDataitems() {
      axios
        .get("http://localhost:8000/api/items")
        .then((response) => {
          //assign state items with response data
          items.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }

    function deleteItem(e, id) {
      e;
      if (confirm("item akan terhapus, yakin?")) {
        axios
          .post("http://localhost:8000/api/items/delete/" + id)
          .then((response) => {
            console.log(response);
            getDataitems();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    return {
      items,
      getDataitems,
      formatRupiah,
      deleteItem,
    };
  },
};
</script>
