<template>
  <div class="container mt-custom">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>TAMBAH ITEM</h4>
            <hr />
            <div v-if="validation.errors" class="mt-2 alert alert-danger">
              <ul class="mt-0 mb-0">
                <li v-for="(error, index) in validation.errors" :key="index">{{ `${error.param} : ${error.msg}` }}</li>
              </ul>
            </div>
            <form @submit.prevent="store">
              <div class="row g-3">
                <div class="col-sm-4">
                  <input type="text" class="form-control" v-model="item.name" placeholder="name" aria-label="name" name="name" />
                </div>
                <div class="col-sm-4">
                  <input type="number" class="form-control" v-model="item.unit_price" placeholder="price" aria-label="unit_price" name="unit_price" />
                </div>
                <div class="col-sm-2">
                  <select class="form-select" aria-label="Default select example" v-model="item.unit" name="unit">
                    <option selected disabled>Open this select menu</option>
                    <option value="kg">Kg</option>
                    <option value="pcs">Pcs</option>
                  </select>
                </div>
                <div class="col-sm">
                  <input type="number" class="form-control" v-model="item.stock" placeholder="stock" aria-label="stock" min="1" />
                </div>
              </div>
              <div class="row g-3 mt-2">
                <div class="col-sm">
                  <div class="custom-file">
                    <label class="custom-file-label" for="customFile">Gambar Item</label>
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
      uploadedItemImages: "",
    };
  },
  components: {},
  methods: {},
  setup() {
    //state posts
    const item = reactive({
      name: "",
      unit: "",
      unit_price: "",
      stock: "",
    });

    //states
    const validation = ref([]);

    //vue router
    const router = useRouter();

    //method store
    function store() {
      let name = item.name;
      let unit = item.unit;
      let unit_price = item.unit_price;
      let stock = item.stock;

      axios
        .post("http://localhost:8000/api/items", {
          name: name,
          unit: unit,
          unit_price: unit_price,
          stock: stock,
          image: this.uploadedItemImages,
        })
        .then(() => {
          //redirect ke post index
          router.push({
            name: "items.index",
          });
        })
        .catch(function(error) {
          if (error.response) {
            validation.value = error.response.data;
          }
        });
    }

    function handleSelectedFile(event) {
      // this.removeImage();
      let formData = new FormData();
      formData.append("image", event.target.files[0]);
      formData.append("remove", this.uploadedItemImages);

      axios
        .post("http://localhost:8000/api/items/image/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.uploadedItemImages = response.data.path;
          console.log(response);
        })
        .catch((errors) => {
          if (errors.response) {
            validation.value = errors.response.data;
          }
        });
    }

    function removeImage() {
      if (this.uploadedItemImages.length) {
        axios
          .post("http://localhost:8000/api/items/image/remove", { path: this.uploadedItemImages })
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
      item,
      validation,
      router,
      store,
      handleSelectedFile,
      removeImage,
    };
  },
};
</script>
