<template>
  <Card :title="$tr('layout.prepareCard')">
    <div class="columns is-centered">
      <div class="column is-center is-6">
        <form @submit.prevent="onSubmit">
          <b-field :label="$tr('layout.font')" label-position="on-border">
            <WithTooltip :text="$tr('layout.fontFamilyTooltip')">
              <b-select
                ref="font"
                v-model="catalogFont"
                :aria-label="$tr('layout.fontFamilyTooltip')"
                placeholder="Font"
                aria-placeholder="Font"
                rounded
                expanded
              >
                <option value="times">Times New Roman</option>
                <option value="arial">Arial</option>
              </b-select>
            </WithTooltip>
          </b-field>
          <b-field v-show="sendEmailCopy" class="email-input">
            <input-validation
              ref="email"
              v-model.trim="$v.email.$model"
              :validations="$options.validations.email"
              :v="$v"
              :tooltip-label="
                $tr('layout.nameTooltip', [{ pt: 'author', en: 'lowAuthor' }])
              "
              placeholder="Ex.: seu.email@exemplo.com"
              label="Digite seu email"
              field-name="email"
              class="author-first-input"
            >
              <template #email>
                {{ $tr('layout.email') }}
              </template>
            </input-validation>
          </b-field>
          <b-field class="email-box">
            <WithTooltip :text="$tr('layout.receiveEmailTooltip')">
              <b-checkbox
                :aria-label="$tr('layout.receiveEmailTooltip')"
                @input="focusOnEmailInput"
                v-model="sendEmailCopy"
                class="email-checkbox"
              >
                {{ $tr('layout.sendCopyToEmail') }}
              </b-checkbox>
            </WithTooltip>
          </b-field>

          <div>
            <WithTooltip :text="$tr('layout.solveCaptcha')">
              <recaptcha
                @success="onSuccess"
                @error="onSomeError('error')"
                @expired="onSomeError('exp')"
              />
            </WithTooltip>
          </div>
          <b-field>
            <WithTooltip :text="$tr('layout.generateTooltip')">
              <b-button
                :disabled="disabled"
                class="is-success"
                rounded
                expanded
                native-type="submit"
              >
                {{ $tr('layout.generate') }}
              </b-button>
            </WithTooltip>
          </b-field>
        </form>
      </div>
    </div>
  </Card>
</template>

<script>
import { email } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import WithTooltip from '~/components/WithTooltip'
import helper from '~/mixins/helper'
import { recovery, replace } from '~/front/persistence'
import { maybe, romanize } from '~/shared/frontUtils'
import InputValidation from '~/components/InputValidation.js'

export default {
  name: 'SendCatalogDataForm',
  components: {
    Card,
    WithTooltip,
    InputValidation
  },
  mixins: [helper],

  data() {
    const { catalogFont } = recovery('form')
    return {
      catalogFont,
      touchedCaptcha: false,
      captchaHasError: false,
      captchaHasExpired: false,
      sendEmailCopy: false,
      emailInvalid: false,
      email: ''
    }
  },

  computed: {
    disabled() {
      return (
        !this.touchedCaptcha ||
        this.captchaHasError ||
        this.captchaHasExpired ||
        this.emailInvalid
      )
    }
  },

  watch: {
    catalogFont() {
      replace('form', { catalogFont: this.catalogFont })
    },

    sendEmailCopy(value) {
      if (value === false) {
        this.resetEmail()
      }
    },

    email(value) {
      this.isEmailValid()
    }
  },

  beforeCreate() {
    if (!recovery('form').catalogFont)
      replace('form', {
        catalogFont: this.catalogFont || 'times'
      })
  },

  methods: {
    focusOnEmailInput(value) {
      if (value) {
        this.$refs.email.focus()
      }
    },
    focus() {
      this.$refs.font.focus()
    },

    isEmailValid() {
      const { validations } = this.$options
      this.$v.$touch()
      for (const field in validations) {
        if (this.$v[field].$invalid && !this.$v[field].$each) {
          this.$refs[field].focus()
          this.emailInvalid = true
          return
        }
      }
      this.emailInvalid = false
    },

    resetEmail() {
      this.email = ''
      this.emailInvalid = false
    },

    onSomeError(type) {
      const data = type === 'exp' ? 'captchaHasExpired' : 'captchaHasError'
      this.$set(this.$data, data, true)
    },

    onSuccess() {
      this.touchedCaptcha = true
      this.captchaHasError = false
      this.captchaHasExpired = false
    },

    onSubmit() {
      const form = recovery('form')
      const {
        authors,
        work,
        advisors,
        keywords,
        cotutorship,
        catalogFont
      } = form

      const totalPages =
        work.numberType === 'roman'
          ? romanize(+work.totalPages)
          : work.totalPages

      this.$axios
        .post('/api/catalogCards', {
          keywords: keywords.map(k => k.text),
          userEmail: this.email,
          authors: {
            authorName: authors[0].authorName,
            authorSurname: authors[0].authorSurname,
            ...maybe('author2Name', authors[1] ? authors[1].authorName : ''),
            ...maybe(
              'author2Surname',
              authors[1] ? authors[1].authorSurname : ''
            )
          },
          work: {
            workTitle: work.workTitle,
            ...maybe('workSubtitle', work.workSubtitle),
            presentationYear: work.presentationYear,
            workImagesType: work.workImagesType,
            totalPages,
            workType: work.workType
          },
          advisors,
          academicDetails: {
            acdUnityName: work.selectedAcdUnity.name,
            knAreaId: work.selectedKnArea.id,
            courseName: work.course
          },
          cotutorship: {
            ...maybe(
              'cotutorshipAdvisorName',
              cotutorship ? cotutorship.cotutorshipAdvisorName : ''
            ),
            ...maybe(
              'cotutorshipAdvisorGender',
              cotutorship ? cotutorship.cotutorshipAdvisorGender : ''
            ),
            ...maybe(
              'advisorTitle',
              cotutorship ? cotutorship.advisorTitle : false
            ),
            ...maybe(
              'cotutorshipInstitution',
              cotutorship ? cotutorship.cotutorshipInstitution : ''
            ),
            ...maybe(
              'cotutorshipProgram',
              cotutorship ? cotutorship.cotutorshipProgram : ''
            )
          },
          catalogFont
        })
        .then(response => {
          const location = response.headers['pdf-location']
          window.open(location, '_blank')
        })
        .catch()
        .finally(() => (this.loading = false))
    }
  },

  validations: {
    email: {
      email
    }
  }
}
</script>
<style scoped>
.g-recaptcha {
  display: flex;
  justify-content: center;
}

.email-input {
  margin-top: 10%;
}

.email-box {
  margin-bottom: 7%;
}

.email-checkbox {
  font-size: 0.8em;
}

@media screen and (max-width: 575px) {
  #rc-imageselect,
  .g-recaptcha {
    transform: scale(0.77);
    -webkit-transform: scale(0.77);
  }
}
</style>
