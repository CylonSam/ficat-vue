<template>
  <b-modal
    @close="closeModal"
    v-model="isKaModalActive"
    :aria-modal="true"
    aria-role="dialog"
    aria-label="Selecione a área de conhecimento"
    has-modal-card
  >
    <div class="modal-card" style="height: 90vh">
      <header class="modal-card-head">
        <h1 class="modal-card-title app-modal-title">
          SELECIONE A <span class="title-bold">ÁREA DE CONHECIMENTO</span>
        </h1>
        <button
          @click="$emit('catClosed')"
          aria-label="Sair"
          type="button"
          class="delete"
        ></button>
      </header>
      <section :aria-busy="busy" class="modal-card-body">
        <div ref="modalContent" v-if="mode === 'menu'" class="">
          <!-- searchbox -->
          <b-field class="searchbox" grouped>
            <b-input
              @keydown.native.enter="search"
              v-model="term"
              placeholder="Digite o titulo da área de conhecimento a ser pesquisada ou selecione manualmente a seguir"
              type="search"
              expanded
            ></b-input>
            <p class="control">
              <b-button @click="search" class="is-ficat">Pesquisar</b-button>
            </p>
          </b-field>

          <!-- categories -->
          <h2 class="category-title">LISTA DE CATEGORIAS</h2>
          <hr class="category-divider" />
          <div
            aria-role="list"
            aria-label="Lista de categorias"
            class="category-list"
          >
            <a
              @keypress.enter="getCategoryList(category)"
              @click="getCategoryList(category)"
              v-for="category of categories"
              :key="categories.indexOf(category)"
              tabindex="0"
              class="list-item"
            >
              <b-icon icon="plus" size="is-small"></b-icon>
              {{ category.description }}
            </a>
          </div>
        </div>
        <div ref="modalContent" v-if="mode === 'list'" class="">
          <div class="list-header">
            <a
              @keypress.enter="goToMenu"
              @click="goToMenu"
              aria-label="Voltar para a lista de categorias"
              role="button"
              tabindex="0"
              ><b-icon icon="arrow-left" size="is-small"></b-icon> VOLTAR</a
            >
            <hr class="list-header-divider" />
            <p class="list-category">
              CATEGORIA:
              <span style="font-weight: 500">{{ getSelectedCategory }}</span>
            </p>
          </div>
          <div
            ref="knaList"
            :aria-label="
              'Lista de assuntos da categoria ' + getSelectedCategory
            "
          >
            <a
              @keypress="selectedKna(item)"
              @click="selectedKna(item)"
              v-for="item in categoryData"
              :key="item.id"
              tabindex="0"
              class="list-item"
              link
            >
              <b-icon icon="minus" size="is-small"></b-icon>
              {{ item.description }}
            </a>
          </div>
          <b-pagination
            @change="handlePageChange"
            :total="total"
            :per-page="10"
            v-model="currentPage"
          >
          </b-pagination>
        </div>
        <div ref="modalContent" v-if="mode === 'search'" class="">
          <div class="list-header">
            <a
              @keypress.enter="goToMenu"
              @click="goToMenu"
              role="button"
              tabindex="0"
              ><b-icon icon="arrow-left" size="is-small"></b-icon> VOLTAR</a
            >
            <hr class="list-header-divider" />
          </div>
          <div ref="searchList" aria-label="Lista de resultados da pesquisa">
            <a
              @click="selectedKna(item)"
              v-for="item in searchData"
              :key="item.id"
              tabindex="0"
              class="list-item"
              link
            >
              <b-icon icon="minus" size="is-small"></b-icon>
              {{ item.description }}
            </a>
          </div>
          <b-pagination
            @change="handlePageChange"
            :total="total"
            :per-page="10"
            v-model="currentPage"
          >
          </b-pagination>
        </div>
      </section>
    </div>
  </b-modal>
</template>
<script>
import { knaCatArray } from '../server/util/knaCategories'

export default {
  props: {
    isKaModalActive: Boolean,
    selectedKna: {
      type: Function,
      default() {
        return { errMessage: 'Not working' }
      }
    }
  },
  data() {
    return {
      term: '',
      loadingComponent: null,
      searchData: [],
      previousSearch: '',
      categoryData: [],
      categories: [],
      selectedCategory: {},
      isLoading: false,
      mode: 'menu',
      currentPage: 1,
      total: 0,
      busy: true
    }
  },
  computed: {
    getSelectedCategory() {
      return this.selectedCategory.description
    }
  },
  created() {
    this.categories = knaCatArray()

    // ordena as categorias em ordem alfabetica
    this.categories.sort(function(a, b) {
      const x = a.description.toLowerCase()
      const y = b.description.toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0
    })
  },
  methods: {
    search() {
      this.mode = 'search'

      this.getSearchDataCount(this.term)
      this.open()
      this.getSearchData(this.term)
    },
    getSearchDataCount(term) {
      this.$axios
        .get('/api/knowledgeAreas', {
          params: {
            description: term
          }
        })
        .then(response => {
          this.total = response.data.length
        })
        .catch(err => console.log(err))
    },
    getSearchData(term) {
      if (!term.length) {
        this.searchData = []
        return
      }

      this.$axios
        .get('/api/knowledgeAreas', {
          params: {
            description: term,
            page: this.currentPage,
            size: 10
          }
        })
        .then(response => {
          this.searchData = response.data
        })
        .catch(err => console.log(err))
    },
    handlePageChange() {
      if (this.mode === 'search') {
        this.getSearchData(this.term)
      } else {
        this.getKnowledgeAreasData(this.selectedCategory.code)
      }
    },
    goToMenu() {
      this.mode = 'menu'
      this.categoryData = []
      this.searchData = []
      this.currentPage = 1
    },
    getCategoryList(category) {
      this.selectedCategory = category
      this.mode = 'list'

      this.getCategoryDataCount(category.code)
      this.open()
      this.getKnowledgeAreasData(category.code)
    },
    open() {
      const loadingComponent = this.$buefy.loading.open({
        container: this.$refs.modalContent.$el
      })
      setTimeout(() => loadingComponent.close(), 0.8 * 1000)
    },
    closeModal() {
      this.$emit('catClosed')
    },
    getCategoryDataCount(category) {
      this.$axios
        .get('/api/knowledgeAreas', {
          params: {
            categoryCode: category
          }
        })
        .then(response => {
          this.total = response.data.length
        })
    },
    getKnowledgeAreasData(category) {
      this.$axios
        .get('/api/knowledgeAreas', {
          params: {
            categoryCode: category,
            page: this.currentPage,
            size: 10
          }
        })
        .then(response => {
          this.categoryData = response.data
          this.busy = false
        })
        .catch(error => {
          this.categoryData = error.data
        })
    }
  }
}
</script>
<style scoped>
.modal-card-title {
  margin: 5px 0;
  font-size: 1.4rem;
  font-weight: 300;
}

.title-bold {
  font-weight: 600;
}

.searchbox {
  margin-top: 0;
}

.app-button {
  background-color: #595867;
  color: white;
}

.app-button:hover {
  text-decoration: none;
  color: white;
}

.card-content {
  width: 100%;
}

.category-title {
  font-size: 1rem;
  font-weight: 500;
  margin-top: 1.8rem;
}

.list-item {
  display: block;
  margin: 0.6rem 0;
}
.category:hover {
  text-decoration: underline;
}

.category-divider {
  margin: 0.6rem 0 1.2rem;
}

.list-header-divider {
  margin: 0.6rem 0 0.8rem;
}

.list-category {
  margin-bottom: 1rem;
}
</style>
