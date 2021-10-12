<template>
  <div class="container mt-custom">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>DATA CUSTOMER</h4>
            <hr />
            <router-link :to="{ name: 'customers.create' }" class="btn btn-md btn-success">TAMBAH ITEM</router-link>

            <table class="table table-striped table-bordered mt-4">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in customers" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.unit_price }} /{{ item.unit }}</td>
                  <td>{{ item.stock }}</td>
                  <td class="text-center"></td>
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
    //reactive state
    let customers = ref([]);

    //mounted
    onMounted(() => {
      //panggil function "getDataCustomers"
      getDataCustomers();
    });

    //function "getDataCustomers"
    function getDataCustomers() {
      //get API from Express Backend
      axios
        .get("http://localhost:8000/api/customers")
        .then((response) => {
          //assign state customers with response data
          customers.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }

    //return
    return {
      customers,
      getDataCustomers,
    };
  },
};
</script>
