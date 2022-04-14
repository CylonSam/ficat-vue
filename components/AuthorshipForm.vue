<template>
  <Card :title="$tr('layout.authorshipData')">
    <div class="columns">
      <div class="column is-centered">
        <div
          v-for="(kw, i) in $v.authors.$each.$iter"
          :key="i"
          class="field is-grouped input-float"
        >
          <div class="app-author-input">
            <input-validation
              :ref="'authorName-' + i"
              v-model.trim="kw.authorName.$model"
              :label="$tr('layout.whosName', ['author']) + ' ' + (+i + 1)"
              :validations="$options.validations.authors.$each.authorName"
              :v="kw"
              :tooltip-label="
                $tr(
                  +i === 0 ? 'layout.nameTooltip' : 'layout.secondNameTooltip'
                )
              "
              :placeholder="'Exemplo: ' + placeholderNames[i][0]"
              field-name="authorName"
              class="author-first-input"
            >
              <template #required>
                {{ $tr('layout.required') }}
              </template>
              <template #minLength="{ min }">
                {{ $tr('layout.minLength', [min]) }}
              </template>
              <template #alpha>
                {{ $tr('layout.alpha', ['nome']) }}
              </template>
            </input-validation>
            <input-validation
              ref="authorSurname"
              v-model.trim="kw.authorSurname.$model"
              :label="$tr('layout.whosSurname', ['author']) + ' ' + (+i + 1)"
              :validations="$options.validations.authors.$each.authorSurname"
              :tooltip-label="
                $tr(
                  +i === 0
                    ? 'layout.surnameTooltip'
                    : 'layout.secondSurnameTooltip'
                )
              "
              :v="kw"
              :placeholder="'Exemplo: ' + placeholderNames[i][1]"
              field-name="authorSurname"
            >
              <template #required>
                {{ $tr('layout.required') }}
              </template>
              <template #minLength="{ min }">
                {{ $tr('layout.minLength', [min]) }}
              </template>
              <template #alpha>
                {{ $tr('layout.alpha', ['sobrenome']) }}
              </template>
            </input-validation>
          </div>
          <div class="btn-block">
            <WithTooltip :text="$tr('layout.addAuthor')">
              <b-button
                :disabled="authors.length > 1"
                @click="addAuthor"
                icon-right="plus"
                class="btn"
                type="is-success"
                aria-label="Adicionar mais um campo de autor."
                outlined
              >
              </b-button>
            </WithTooltip>
            <WithTooltip :text="$tr('layout.removeAuthor')">
              <b-button
                v-if="i > 0"
                @click="authors.splice(i, 1)"
                icon-right="minus"
                class="btn"
                type="is-danger"
                aria-label="Remover um campo de autor."
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
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'
import WithTooltip from '~/components/WithTooltip'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation, WithTooltip },

  data() {
    const { authors } = recovery('form')
    return {
      authors,
      placeholderNames: [
        ['Samantha Luíza Athayde', 'Silva'],
        ['Carlos Augusto Andrade do', 'Nascimento']
      ]
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { authors: this.authors })
      }
    }
  },

  mounted() {
    // console.log(this.$refs
    this.$refs['authorName-0'][0].focus()
  },

  beforeCreate() {
    if (!recovery('form').authors)
      replace('form', {
        authors: [
          {
            authorName: '',
            authorSurname: ''
          }
        ]
      })
  },
  methods: {
    addAuthor() {
      this.authors.push({ authorName: '', authorSurname: '' })
      this.$nextTick(() => {
        this.$refs['authorName-' + (this.authors.length - 1)][0].focus()
      })
    },
    filterModels() {
      return Object.keys(this.$v).filter(k => !k.startsWith('$'))
    },
    checkNext() {
      const { authorName } = this.$refs
      this.$v.$touch()
      for (const i in authorName) {
        if (this.$v.authors.$each[i].$invalid) {
          this.$refs.authorName[i].focus()
          return false
        }
      }
      return true
    }
  },
  validations: {
    authors: {
      required,
      minLength: minLength(1),
      $each: {
        authorName: {
          required,
          minLength: minLength(3)
        },
        authorSurname: {
          required,
          minLength: minLength(3)
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

.app-author-input {
  display: flex;
}

.author-first-input {
  margin-left: 5%;
  margin-right: 8%;
}

.btn-block {
  display: flex;
  margin-left: 1em;
  justify-content: space-between;
}

@media screen and (max-width: 900px) {
  .input-float {
    flex-direction: column;
  }

  .app-author-input {
    flex-direction: column;
  }

  .author-first-input {
    margin: 0;
  }
}
</style>
