<template>
  <div class="container mt-custom">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>DATA CUSTOMER</h4>
            <hr />
            <router-link :to="{ name: 'customers.create' }" class="btn btn-md btn-success">TAMBAH CUSTOMER</router-link>

            <table class="table table-striped table-bordered mt-4">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Alamat</th>
                  <th scope="col">Discount Type</th>
                  <th scope="col">Discount</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cust, index) in customers" :key="index">
                  <td>
                    <p>
                      {{ cust.name }} <br />
                      {{ cust.contact }} <br />
                      {{ cust.email }}
                    </p>
                  </td>
                  <td>{{ cust.address }}</td>
                  <td>{{ cust.discount_type }}</td>
                  <td>{{ cust.discount_amount }}</td>
                  <td class="text-center">
                    <router-link :to="{ name: 'customers.edit', params: { id: cust.id } }" class="btn btn-sm btn-primary mr-1">EDIT</router-link> |
                    <a href="javascript:void(0)" @click="deleteCustomer($event, cust.id)" class="btn btn-sm btn-danger mr-1">DELETE</a>
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
    //reactive state
    let customers = ref([]);

    //mounted
    onMounted(() => {
      getDataCustomers();
    });

    function getDataCustomers() {
      axios
        .get("http://localhost:8000/api/customers")
        .then((response) => {
          customers.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
    function deleteCustomer(e, id) {
      e;
      if (confirm("customer akan terhapus, yakin?")) {
        axios
          .post("http://localhost:8000/api/customers/delete/" + id)
          .then((response) => {
            console.log(response);
            getDataCustomers();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    return {
      customers,
      getDataCustomers,
      deleteCustomer,
    };
  },
};
</script>
