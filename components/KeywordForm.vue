<template>
  <card :title="$tr('layout.keywords')">
    <div class="columns is-centered">
      <div class="column is-half">
        <WithTooltip :text="$tr('layout.vocabulary')">
          <b-button
            ref="vocabBtn"
            tag="a"
            href="http://bibcentral.ufpa.br/pergamum/biblioteca/autoridade.php"
            type="is-ficat"
            icon-left="book"
            class="vocab-button"
            target="_blank"
            rounded
            >Consultar vocabulário controlado</b-button
          ></WithTooltip
        >
        <div
          v-for="(kw, i) in $v.keywords.$each.$iter"
          :key="i"
          class="field is-grouped is-grouped"
        >
          <input-validation
            ref="keywords"
            v-model.trim="kw.text.$model"
            :label="$tr('layout.keyword') + (+i + 1)"
            :validations="$options.validations.keywords.$each.text"
            :v="kw"
            :tooltip-label="$tr('layout.keywordTooltip')"
            :placeholder="
              placeholderKeywords[i] ? 'Exemplo: ' + placeholderKeywords[i] : ''
            "
            field-name="text"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
          </input-validation>
          <div class="btn-block">
            <WithTooltip :text="$tr('layout.addKeyword')">
              <b-button
                :disabled="keywords.length > 4"
                @click="keywords.push({ text: '' })"
                aria-label="Adicionar mais um campo de palavra-chave"
                icon-right="plus"
                class="btn"
                type="is-success"
                outlined
              >
              </b-button>
            </WithTooltip>
            <WithTooltip :text="$tr('layout.removeKeyword')">
              <b-button
                v-if="i > 0"
                @click="keywords.splice(i, 1)"
                aria-label="Remover um campo de palavra-chave"
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
  </card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import { recovery, replace } from '~/front/persistence'
import InputValidation from '~/components/InputValidation.js'
import WithTooltip from '~/components/WithTooltip'

export default {
  name: 'KeywordForm',
  components: { Card, InputValidation, WithTooltip },
  data() {
    const { keywords } = recovery('form')
    return {
      keywords,
      placeholderKeywords: [
        'Bibliotecas universitárias',
        'Redes sociais',
        'Universidades e faculdades',
        '',
        ''
      ]
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { keywords: this.keywords })
      }
    }
  },

  beforeCreate() {
    if (!recovery('form').keywords)
      replace('form', {
        keywords: [{ text: '' }]
      })
  },

  methods: {
    focus() {
      this.$refs.keywords[0].focus()
    },
    onHover(evt, action) {
      const btn = evt.target
      btn.classList.add('tt-btn-visible')
    },

    checkNext() {
      const { keywords } = this.$refs
      this.$v.$touch()
      for (const i in keywords) {
        if (this.$v.keywords.$each[i].$invalid) {
          this.$refs.keywords[i].focus()
          return false
        }
      }
      return true
    }
  },

  validations: {
    keywords: {
      required,
      minLength: minLength(1),
      $each: {
        text: {
          required,
          minLength: minLength(2)
        }
      }
    }
  }
}
</script>

<style>
.vocab-button {
  margin-bottom: 1rem;
}

.btn-block {
  display: flex;
  margin-left: 1em;
  justify-content: space-between;
}
</style>
