<template>
  <div class="container mt-custom">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>TAMBAH CUSTOMER</h4>
            <hr />
            <div v-if="validation.errors" class="mt-2 alert alert-danger">
              <ul class="mt-0 mb-0">
                <li v-for="(error, index) in validation.errors" :key="index">{{ `${error.param} : ${error.msg}` }}</li>
              </ul>
            </div>
            <form @submit.prevent="store">
              <div class="row g-3">
                <div class="col-sm-4">
                  <input type="text" class="form-control" v-model="customer.name" placeholder="name" aria-label="name" name="name" />
                </div>
                <div class="col-sm-4">
                  <input type="text" class="form-control" v-model="customer.contact" placeholder="contact" aria-label="contact" name="contact" />
                </div>
                <div class="col-sm-4">
                  <input type="email" class="form-control" v-model="customer.email" placeholder="email" aria-label="email" name="email" />
                </div>
                <div class="col-sm-2">
                  <!-- <label for="discount_type">Dsicount Type</label> -->
                  <select class="form-select" id="discount_type" aria-label="Default select example" v-model="customer.discount_type" name="discount_type">
                    <option selected value="">Discount Type</option>
                    <option value="precentage">precentage</option>
                    <option value="fix">fix</option>
                  </select>
                </div>
                <div class="col-sm">
                  <input type="number" class="form-control" v-model="customer.discount_amount" placeholder="discount amount" aria-label="discount_amount" />
                </div>
              </div>
              <div class="row g-3 mt-2">
                <div class="col-sm">
                  <label for="address">Alamat</label>
                  <textarea name="address" id="address" cols="30" rows="10" class="form-control" v-model="customer.address"></textarea>
                </div>
                <div class="col-sm">
                  <div class="custom-file">
                    <label class="custom-file-label" for="customFile">KTP</label>
                    <input type="file" @change="handleSelectedFile" multiple class="custom-file-input form-control" id="customFile" accept="image/jpeg, image/png" />
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary mt-3">SIMPAN</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
  data() {
    return {
      uploadedKtp: "",
    };
  },
  components: {},
  methods: {},
  setup() {
    //state posts
    const customer = reactive({
      name: "",
      email: "",
      contact: "",
      address: "",
      discount_amount: "",
      discount_type: "",
      ktp: "",
    });

    //states
    const validation = ref([]);

    //vue router
    const router = useRouter();

    //method store
    function store() {
      let name = customer.name;
      let email = customer.email;
      let contact = customer.contact;
      let address = customer.address;
      let discount_amount = customer.discount_amount;
      let discount_type = customer.discount_type;
      let ktp = this.uploadedKtp;

      axios
        .post("http://localhost:8000/api/customers", {
          name,
          email,
          contact,
          address,
          discount_amount,
          discount_type,
          ktp,
        })
        .then(() => {
          router.push({
            name: "customers.index",
          });
        })
        .catch(function(error) {
          if (error.response) {
            validation.value = error.response.data;
          }
        });
    }

    function handleSelectedFile(event) {
      let formData = new FormData();
      formData.append("image", event.target.files[0]);
      formData.append("remove", this.uploadedKtp);

      axios
        .post("http://localhost:8000/api/customers/ktp/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.uploadedKtp = response.data.path;
          console.log(response);
        })
        .catch((errors) => {
          if (errors.response) {
            validation.value = errors.response.data;
          }
        });
    }

    function removeImage() {
      if (this.uploadedKtp.length) {
        axios
          .post("http://localhost:8000/api/customers/ktp/remove", { path: this.uploadedKtp })
          .then((response) => {
            console.log("remove image", response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    //return
    return {
      customer,
      validation,
      router,
      store,
      handleSelectedFile,
      removeImage,
    };
  },
};
</script>
