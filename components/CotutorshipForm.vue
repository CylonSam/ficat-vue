<template>
  <Card :title="$tr('layout.interinstitutional')">
    <div class="columns">
      <div class="column is-centered">
        <div class="campo-orientador input-float">
          <input-validation
            ref="cotutorshipAdvisorName"
            v-model="$v.cotutorshipAdvisorName.$model"
            :validations="$options.validations.cotutorshipAdvisorName"
            :v="$v"
            :label="$tr('layout.whosName', ['advisor'])"
            :tooltip-label="$tr('layout.cotutorshipAdvisorTooltip')"
            :placeholder="placeholder.advisorName"
            class="advisor-name"
            field-name="cotutorshipAdvisorName"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>

          <div class="columns vcenter">
            <div class="column is-half">
              <input-validation
                ref="cotutorshipAdvisorGender"
                v-model="$v.cotutorshipAdvisorGender.$model"
                :v="$v"
                :tooltip-label="$tr('layout.genderTooltip', ['lowAdvisor'])"
                :validations="$options.validations.cotutorshipAdvisorGender"
                placeholder="Selecione"
                label="Gênero"
                field-name="cotutorshipAdvisorGender"
                use-component="b-select"
              >
                <template #component>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </template>
                <template #required>
                  {{ $tr('layout.required') }}
                </template>
              </input-validation>
            </div>
            <div class="column is-half">
              <input-validation
                ref="advisorTitle"
                v-model="$v.advisorTitle.$model"
                :validations="$options.validations.advisorTitle"
                :v="$v"
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
        </div>

        <div class="info-instituicao input-float">
          <div class="institution-field">
            <input-validation
              ref="cotutorshipInstitution"
              v-model="$v.cotutorshipInstitution.$model"
              :validations="$options.validations.cotutorshipInstitution"
              :v="$v"
              :tooltip-label="$tr('layout.institutionTooltip', ['lowAdvisor'])"
              :placeholder="placeholder.institutionName"
              label="Instituição de Ensino"
              field-name="cotutorshipInstitution"
            >
              <template #required>
                {{ $tr('layout.required') }}
              </template>
              <template #minLength="{ min }">
                {{ $tr('layout.minLength', [min]) }}
              </template>
            </input-validation>
          </div>

          <div class="campo-programa">
            <input-validation
              ref="cotutorshipProgram"
              v-model="$v.cotutorshipProgram.$model"
              :validations="$options.validations.cotutorshipProgram"
              :v="$v"
              :tooltip-label="$tr('layout.facultyTooltip')"
              :placeholder="placeholder.programName"
              label="Faculdade"
              field-name="cotutorshipProgram"
            >
              <template #required>
                {{ $tr('layout.required') }}
              </template>
              <template #minLength="{ min }">
                {{ $tr('layout.minLength', [min]) }}
              </template>
            </input-validation>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'

export default {
  name: 'CotutorshipForm',
  components: { Card, InputValidation },
  data() {
    const { cotutorship } = recovery('form')
    return {
      cotutorshipAdvisorName: cotutorship.advisorName,
      cotutorshipAdvisorGender: cotutorship.advisorGender,
      advisorTitle: cotutorship.advisorTitle,
      cotutorshipInstitution: cotutorship.institutionName,
      cotutorshipProgram: cotutorship.program,
      initialRef: 'cotutorshipAdvisorName',
      placeholder: {
        advisorName: 'Ex.: Edisângela Paixão Bastos',
        institutionName: 'Ex.: Universidade de Lisboa',
        programName: 'Ex.: Faculdade de Direito'
      }
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { cotutorship: this.$data })
      }
    }
  },

  beforeCreate() {
    if (!recovery('form').cotutorship)
      replace('form', {
        cotutorship: {
          advisorName: '',
          advisorGender: null,
          advisorTitle: 'doctor',

          institutionName: '',
          program: ''
        }
      })
  },

  methods: {
    focus() {
      this.$refs.cotutorshipAdvisorName.focus()
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
            return false
          }
        }
      }
      return true
    },
    reset() {
      replace('form', {
        cotutorship: {
          advisorName: '',
          advisorGender: null,
          advisorTitle: 'doctor',

          institutionName: '',
          program: ''
        }
      })
    }
  },

  validations: {
    cotutorshipAdvisorName: {
      required,
      minLength: minLength(3)
    },
    advisorTitle: {
      required
    },
    cotutorshipInstitution: {
      required,
      minLength: minLength(10)
    },
    cotutorshipProgram: {
      required
    },
    cotutorshipAdvisorGender: {
      required
    }
  }
}
</script>

<style scoped>
.input-float {
  display: flex;
  margin-left: 15%;
  justify-content: flex-start;
}

.advisor-name {
  margin-right: 5%;
}

.vcenter {
  align-items: center;
}

.field {
  position: relative;
  top: -1rem;
}

.institution-field {
  margin-right: 5%;
}

@media screen and (max-width: 900px) {
  .input-float {
    flex-direction: column;
    margin-left: 0;
  }

  .advisor-name {
    margin-right: 0;
  }

  .institution-field {
    width: 100%;
    margin-right: 0;
  }
}
</style>
