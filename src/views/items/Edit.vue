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
            <form @submit.prevent="update">
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
                    <img style="width:200px" v-if="item.image" :src="item.image" class="rounded mx-auto d-block" :alt="item.name" />
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
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
export default {
  data() {
    return {
      text: "This is a message",
    };
  },
  components: {},
  methods: {},
  setup() {
    const item = reactive({
      name: "",
      unit: "",
      unit_price: "",
      stock: "",
      image: "",
    });

    const uploadedItemImage = reactive({ src: "" });
    const assets = reactive({ url: "" });

    const validation = ref([]);
    const router = useRouter();
    const route = useRoute();

    onMounted(function() {
      axios
        .get(`http://localhost:8000/api/items/${route.params.id}`)
        .then((response) => {
          item.name = response.data.data.name;
          item.unit = response.data.data.unit;
          item.unit_price = response.data.data.unit_price;
          item.stock = response.data.data.stock;
          item.image = response.data.data.storage_path + "/" + response.data.data.images;
          assets.url = response.data.data.storage_path;

          uploadedItemImage.src = response.data.data.images;
        })
        .catch((error) => {
          console.log(error);
        });
    });

    function update() {
      let name = item.name;
      let unit = item.unit;
      let unit_price = item.unit_price;
      let stock = item.stock;

      axios
        .post("http://localhost:8000/api/items/update/" + route.params.id, {
          name: name,
          unit: unit,
          unit_price: unit_price,
          stock: stock,
        })
        .then(() => {
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
      formData.append("remove", uploadedItemImage.src);

      axios
        .post("http://localhost:8000/api/items/image/upload/" + route.params.id, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          uploadedItemImage.src = response.data.path;
          item.image = assets.url + "/" + response.data.path;
        })
        .catch((errors) => {
          if (errors.response) {
            validation.value = errors.response.data;
          }
        });
    }

    //return
    return {
      item,
      validation,
      router,
      update,
      handleSelectedFile,
      uploadedItemImage,
    };
  },
};
</script>
