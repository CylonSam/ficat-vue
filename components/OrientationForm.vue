<template>
  <Card :title="$tr('layout.orientationData')">
    <div class="columns">
      <div class="column is-centered">
        <div
          v-for="(kw, i) in $v.advisors.$each.$iter"
          :key="i"
          class="input-float"
        >
          <div v-if="!isMobile()">
            <input-validation
              :ref="'advisorName-' + i"
              v-model.trim="kw.advisorName.$model"
              :validations="$options.validations.advisors.$each.advisorName"
              :v="kw"
              :tooltip-label="$tr('layout.advisorTooltip')"
              :placeholder="'Exemplo: ' + placeholderNames[i]"
              :label="$tr('layout.advisorName')"
              field-name="advisorName"
              class="orientador-field"
            >
              <template #addon>
                <b-select
                  v-model="kw.advisorType.$model"
                  placeholder="Tipo"
                  rounded
                >
                  <option value="advisor">{{ $tr('layout.advisor') }}</option>
                  <option value="coadvisor">{{
                    $tr('layout.coadvisor')
                  }}</option>
                </b-select>
              </template>
              <template #required>
                {{ $tr('layout.required') }}
              </template>
              <template #minLength="{ min }">
                {{ $tr('layout.minLength', [min]) }}
              </template>
            </input-validation>
          </div>

          <div v-if="isMobile()">
            <input-validation
              ref="advisorName"
              v-model.trim="kw.advisorName.$model"
              :validations="$options.validations.advisors.$each.advisorName"
              :v="kw"
              :tooltip-label="$tr('layout.nameTooltip', ['lowAdvisor'])"
              :placeholder="'Exemplo: ' + placeholderNames[i]"
              :label="$tr('layout.advisorName')"
              field-name="advisorName"
              class="orientador-field"
            >
              <template #required>
                {{ $tr('layout.required') }}
              </template>
              <template #minLength="{ min }">
                {{ $tr('layout.minLength', [min]) }}
              </template>
            </input-validation>
            <input-validation
              ref="advisorType"
              v-model="kw.advisorType.$model"
              :v="kw"
              :tooltip-label="$tr('layout.whosTitle', ['lowCoadvisor'])"
              :validations="$options.validations.advisors.$each.advisorType"
              label="Categoria"
              field-name="advisorType"
              use-component="b-select"
            >
              <template #component>
                <option value="advisor">{{ $tr('layout.advisor') }}</option>
                <option value="coadvisor">{{ $tr('layout.coadvisor') }}</option>
              </template>
            </input-validation>
          </div>

          <div class="columns vcenter orientador-detalhes">
            <div class="column is-half">
              <input-validation
                ref="advisorGender"
                v-model="kw.advisorGender.$model"
                :v="kw"
                :label="$tr('layout.advisorGender')"
                :validations="$options.validations.advisors.$each.advisorGender"
                placeholder="Selecione"
                field-name="advisorGender"
                use-component="b-select"
              >
                <template #component>
                  <option value="male">{{ $tr('layout.genderMale') }}</option>
                  <option value="female">{{
                    $tr('layout.genderFemale')
                  }}</option>
                </template>
                <template #required>
                  {{ $tr('layout.required') }}
                </template>
              </input-validation>
            </div>
            <div class="column is-half">
              <input-validation
                ref="advisorTitle"
                v-model="kw.advisorTitle.$model"
                :validations="$options.validations.advisors.$each.advisorTitle"
                :v="kw"
                :label="$tr('layout.title')"
                :tooltip-label="$tr('layout.advisorTitle')"
                field-name="advisorTitle"
                use-component="b-select"
              >
                <template #component>
                  <option value="graduate">{{ $tr('layout.graduate') }}</option>
                  <option value="expert">{{ $tr('layout.expert') }}</option>
                  <option value="master">{{ $tr('layout.master') }}</option>
                  <option value="doctor">{{ $tr('layout.doctor') }}</option>
                </template>
                <template #required>
                  {{ $tr('layout.required') }}
                </template>
              </input-validation>
            </div>
          </div>
          <div class="btn-block">
            <WithTooltip :text="$tr('layout.addCoadvisor')">
              <b-button
                :disabled="advisors.length > 2"
                @click="addAdvisor"
                aria-label="Adicionar mais um campo de orientador ou coorientador."
                icon-right="plus"
                class="btn"
                type="is-success"
                outlined
              >
              </b-button>
            </WithTooltip>
            <WithTooltip :text="$tr('layout.removeCoadvisor')">
              <b-button
                v-if="i > 0"
                @click="advisors.splice(i, 1)"
                aria-label="Remover um campo de orientador ou coorientador."
                icon-right="minus"
                class="btn"
                type="is-danger"
                outlined
              ></b-button>
            </WithTooltip>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
// import helper from '~/mixins/helper'
import detectMobileUser from '~/mixins/detectMobileUser'
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'
import WithTooltip from '~/components/WithTooltip'

export default {
  name: 'AdvisorForm',
  components: { Card, InputValidation, WithTooltip },
  mixins: [detectMobileUser],
  // mixins: [helper],
  data() {
    const { advisors } = recovery('form')
    return {
      advisors,
      placeholderNames: [
        'Benedito Nunes',
        'Aline Santiago Borges',
        'Ramon da Gama Cordeiro'
      ]
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { advisors: this.advisors })
      }
    }
  },

  beforeCreate() {
    if (!recovery('form').advisors)
      replace('form', {
        advisors: [
          {
            advisorName: '',
            advisorGender: null,
            advisorTitle: 'doctor',
            advisorType: 'advisor'
          }
        ]
      })
  },

  methods: {
    addAdvisor() {
      this.advisors.push({
        advisorName: '',
        advisorGender: null,
        advisorTitle: 'doctor',
        advisorType: 'advisor'
      })
      this.$nextTick(() => {
        this.$refs['advisorName-' + (this.advisors.length - 1)][0].focus()
      })
    },
    focus() {
      this.$refs['advisorName-0'][0].focus()
    },

    filterModels() {
      return Object.keys(this.$v).filter(k => !k.startsWith('$'))
    },
    checkNext() {
      const { validations } = this.$options
      this.$v.$touch()
      for (const field in validations) {
        if (this.$v[field].$invalid && !this.$v[field].$each) {
          this.$refs[field].focus()
          return false
        }
        if (this.$v[field].$each) {
          if (this.$v[field].$each.$invalid) {
            // Só podemos adicionar no maximos 3 orientadores e/ou coorientadores
            const numberOfPossibleInputs = 3
            for (let i = 0; i < numberOfPossibleInputs; i++) {
              if (this.$v[field].$each[i.toString()].$invalid) {
                console.log(this.$v[field].$each[i.toString()])

                if (this.$v[field].$each[i.toString()].advisorName.$invalid) {
                  this.$refs.advisorName[i].focus()
                  break
                } else if (
                  this.$v[field].$each[i.toString()].advisorGender.$invalid
                ) {
                  this.$refs.advisorGender[i].focus()
                  break
                }
              }
            }
            return false
          }
        }
      }
      return true
    }
  },

  validations: {
    advisors: {
      required,
      minLength: minLength(1),
      $each: {
        advisorName: {
          required,
          minLength: minLength(5)
        },
        advisorTitle: {
          required
        },
        advisorGender: {
          required
        },
        advisorType: {
          required
        }
      }
    }
  }
}
</script>

<style scoped>
.input-float {
  display: flex;

  justify-content: space-around;
}

.vcenter {
  align-items: flex-start;
}

.orientador-detalhes {
  padding-left: 3%;
}

.orientador-field {
  margin-left: 3%;
}

.field {
  position: relative;
  top: -1rem;
}
@media screen and (max-width: 1012px) {
  .input-float {
    flex-direction: column;
    margin-left: 0;
  }
  .orientador-field {
    margin-left: 0;
  }
  .orientador-detalhes {
    padding-left: 0;
  }
}
</style>
