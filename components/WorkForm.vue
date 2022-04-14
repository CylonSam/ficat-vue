<template>
  <div>
    <knowledge-areas-modal
      :isKaModalActive="isKaModalActive"
      :selectedKna="selectedKna"
      @catClosed="closeKaModal"
    ></knowledge-areas-modal>

    <Card :title="$tr('layout.workData')" class="card-wf">
      <div class="columns">
        <div class="column is-half">
          <div class="input-float-wf">
            <input-validation
              ref="workTitle"
              v-model.trim="$v.workTitle.$model"
              :validations="$options.validations.workTitle"
              :v="$v"
              :label="$tr('layout.workTitle')"
              :tooltip-label="$tr('layout.workTitleTooltip')"
              field-name="workTitle"
              placeholder="Exemplo: Redes sociais em bibliotecas universitárias"
            >
              <template #required>
                {{ $tr('layout.required') }}
              </template>
            </input-validation>
            <input-validation
              ref="workSubtitle"
              v-model.trim="$v.workSubtitle.$model"
              :validations="$options.validations.workSubtitle"
              :v="$v"
              :label="$tr('layout.workSubtitle')"
              :tooltip-label="$tr('layout.workSubtitleTooltip')"
              field-name="workSubtitle"
              type="text"
              placeholder="Exemplo: estudo exploratório"
            >
            </input-validation>
            <div class="columns">
              <div class="column is-4">
                <input-validation
                  ref="presentationYear"
                  v-model="$v.presentationYear.$model"
                  :validations="$options.validations.presentationYear"
                  :v="$v"
                  :label="$tr('layout.year')"
                  :tooltip-label="$tr('layout.yearTooltip')"
                  use-component="b-select"
                  field-name="presentationYear"
                >
                  <template #component>
                    <option v-for="y in 11" :key="y">
                      {{ getYear(y - 1) }}
                    </option>
                  </template>
                </input-validation>
              </div>
              <div class="column is-8">
                <input-validation
                  ref="totalPages"
                  v-model.trim="$v.totalPages.$model"
                  :validations="$options.validations.totalPages"
                  :v="$v"
                  :label="$tr('layout.totalPages')"
                  :tooltip-label="$tr('layout.numberTypeTooltip')"
                  field-name="totalPages"
                  placeholder="Exemplo: xxi, 70"
                >
                  <template #required>
                    {{ $tr('layout.required') }}
                  </template>
                </input-validation>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="input-float">
            <input-validation
              ref="workImagesType"
              v-model="$v.workImagesType.$model"
              :validations="$options.validations.workImagesType"
              :v="$v"
              :label="$tr('layout.pictures')"
              :tooltip-label="$tr('layout.picturesTooltip')"
              use-component="b-select"
              field-name="workImagesType"
            >
              <template #component>
                <option value="nocolor">{{ $tr('layout.nocolor') }}</option>
                <option value="color">{{ $tr('layout.color') }}</option>
                <option value="pb">{{ $tr('layout.bw') }}</option>
              </template>
              <template #required>
                {{ $tr('layout.required') }}
              </template>
            </input-validation>
            <input-validation
              ref="workType"
              v-model="$v.workType.$model"
              :validations="$options.validations.workType"
              :v="$v"
              :label="$tr('layout.workType')"
              :tooltip-label="$tr('layout.workTypeTooltip')"
              field-name="workType"
              use-component="b-select"
            >
              <template #component>
                <option value="thesis">{{ $tr('layout.thesis') }}</option>
                <option value="dissertation">
                  {{ $tr('layout.dissertation') }}
                </option>
                <option value="tccExpert">{{ $tr('layout.tccExpert') }}</option>
                <option value="tccGraduation">
                  {{ $tr('layout.tccGraduation') }}
                </option>
              </template>
              <template #required>
                {{ $tr('layout.required') }}
              </template>
            </input-validation>
            <input-validation
              ref="knArea"
              v-model="$v.knArea.$model"
              :validations="$options.validations.knArea"
              :v="$v"
              :options="{
                loading,
                field: 'description',
                data: knAreas,
                icon: 'magnify'
              }"
              :wrapped-slots="h => renderTemplates(h, 'description')"
              :label="$tr('layout.knArea')"
              :tooltip-label="$tr('layout.knAreaTooltip')"
              @select="option => (selectedKnArea = option)"
              @focus="showKaModal"
              use-component="b-autocomplete"
              field-name="knArea"
              placeholder="Pesquisa por descrição"
            >
              <template #required>
                {{ $tr('layout.required') }}
              </template>
            </input-validation>

            <input-validation
              ref="acdUnity"
              v-model="$v.acdUnity.$model"
              :validations="$options.validations.acdUnity"
              :v="$v"
              :options="{
                loading,
                field: 'name',
                data: academicUnities,
                icon: 'magnify'
              }"
              :wrapped-slots="h => renderTemplates(h, 'name')"
              :label="$tr('layout.acdUnity')"
              :tooltip-label="$tr('layout.acdUnityTooltip')"
              @typing="getAcdUnities"
              @select="onSelectedAcdUnity"
              aria-autocomplete="list"
              use-component="b-autocomplete"
              field-name="acdUnity"
              placeholder="Pesquisa por nome ou sigla"
            >
              <template #required>
                {{ $tr('layout.required') }}
              </template>
            </input-validation>
            <template v-if="selectedAcdUnity">
              <input-validation
                ref="course"
                v-model="$v.course.$model"
                :validations="$options.validations.course"
                :v="$v"
                :label="$tr('layout.course')"
                :tooltip-label="$tr('layout.courseTooltip')"
                field-name="course"
                use-component="b-select"
              >
                <template #component>
                  <option
                    :aria-label="c.name"
                    v-for="c in courses"
                    :key="c.id"
                    :value="'' + c.name"
                  >
                    {{ c.name }}
                  </option>
                </template>
                <template #required>
                  {{ $tr('layout.required') }}
                </template>
              </input-validation>
            </template>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import pDebounce from 'p-debounce'
import { required } from 'vuelidate/lib/validators'
import helper from '~/mixins/helper'
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'
import KnowledgeAreasModal from '~/components/KnowledgeAreasModal'

export default {
  name: 'WorkForm',
  components: { Card, InputValidation, KnowledgeAreasModal },
  mixins: [helper],
  data() {
    const { work } = recovery('form')
    return {
      name: '',
      workTitle: work.workTitle,
      workSubtitle: work.workSubtitle,
      presentationYear: work.presentationYear,
      numberType: work.numberType,
      totalPages: work.totalPages,
      workImagesType: work.workImagesType,
      workType: work.workType,
      course: work.course,
      loading: false,
      knAreas: work.knAreas,
      academicUnities: work.academicUnities,
      courses: work.courses,
      selectedKnArea: work.selectedKnArea,
      selectedAcdUnity: work.selectedAcdUnity,
      acdUnity: work.acdUnity,
      knArea: work.knArea,
      knAreaPreviousSearch: '',
      acdUnityPreviousSearch: '',
      isKaModalActive: false,
      initialRef: 'workTitle'
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { work: this.$data })
      }
    },
    workType() {
      // limpa as variaveis de unidade academica e curso quando o tipo de curso for modificado.
      this.acdUnity = ''
      this.course = ''
    }
  },

  beforeCreate() {
    if (!recovery('form').work)
      replace('form', {
        work: {
          workTitle: '',
          workSubtitle: '',
          presentationYear: '' + new Date(Date.now()).getFullYear(),
          numberType: 'arabic',
          totalPages: '',
          workImagesType: 'nocolor',
          workType: 'thesis',
          course: undefined,
          loading: false,
          knAreas: [],
          academicUnities: [],
          courses: [],
          selectedKnArea: undefined,
          selectedAcdUnity: undefined,
          selectedCourse: undefined,
          acdUnity: '',
          knArea: ''
        }
      })
  },

  methods: {
    focus() {
      this.$refs.workTitle.focus()
    },
    selectedKna(kna) {
      this.selectedKnArea = kna
      this.knArea = kna.description
      this.closeKaModal()
    },
    showKaModal() {
      this.isKaModalActive = true
    },
    closeKaModal() {
      this.isKaModalActive = false
      this.$refs.acdUnity.focus()
    },

    filterModels() {
      return Object.keys(this.$v).filter(k => !k.startsWith('$'))
    },

    getYear(y) {
      return '' + (new Date(Date.now()).getFullYear() - y)
    },

    renderTemplates(h, field) {
      return [
        h(
          'template',
          {
            slot: 'empty'
          },
          this.$tr('layout.noResultFound')
        )
      ]
    },

    getAcdUnities: pDebounce(function(term) {
      if (!term.length) {
        this.academicUnities = []
        return
      }
      // Evitar que consultas iguais sejam repetidas
      if (term !== this.acdUnityPreviousSearch) {
        this.loading = true
        this.acdUnityPreviousSearch = term
        this.$axios
          .get('/api/academicUnities', {
            params: {
              term
            }
          })
          .then(response => {
            this.academicUnities = response.data
          })
          .catch()
          .finally(() => (this.loading = false))
      }
    }, 500),

    onSelectedAcdUnity(option) {
      this.selectedAcdUnity = option
      if (this.selectedAcdUnity) {
        this.getCoursesByAcdAcronym(this.selectedAcdUnity.acronym)
      }
    },

    getCoursesByAcdUnity(acdUnityId) {
      this.$axios
        .get('/api/courses', {
          params: {
            acdUnityId
          }
        })
        .then(response => {
          this.courses = response.data
        })
        .catch()
        .finally(() => (this.loading = false))
    },

    getCoursesByAcdAcronym(unityAcronym) {
      this.$axios
        .get('/api/courses', {
          params: {
            unityAcronym,
            type: this.translateWorkType(this.workType)
          }
        })
        .then(response => {
          this.courses = response.data
        })
        .catch()
        .finally(() => (this.loading = false))
    },

    hasNumber(term) {
      return /\d/.test(term)
    },

    translateWorkType(workType) {
      let translatedWorkType = ''
      switch (workType) {
        case 'thesis':
          translatedWorkType = 'doutorado'
          break
        case 'dissertation':
          translatedWorkType = 'mestrado'
          break
        case 'tccGraduation':
          translatedWorkType = 'graduação'
          break
        case 'tccExpert':
          translatedWorkType = 'especialização'
      }

      return translatedWorkType
    },

    onChangeType(e) {
      replace('form', { work: this.$data })
    }
  },

  validations: {
    workTitle: {
      required
    },
    workSubtitle: {},
    totalPages: {
      required
    },
    presentationYear: {
      required
    },
    workImagesType: {
      required
    },
    workType: {
      required
    },
    knArea: {
      required: (_, vm) => !!vm.selectedKnArea
    },
    acdUnity: {
      required: (_, vm) => !!vm.selectedAcdUnity
    },
    course: {
      required
    }
  }
}
</script>

<style scoped>
.input-float-wf {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
