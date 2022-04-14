<template>
  <b-steps
    v-model="activeStep"
    :rounded="isRounded"
    :has-navigation="hasNavigation"
    :label-position="labelPosition"
    :mobile-mode="mobileMode"
    type="is-ficat"
  >
    <b-step-item icon="account">
      <AuthorshipForm ref="section-0" />
    </b-step-item>

    <b-step-item icon="book-multiple">
      <WorkForm ref="section-1" />
    </b-step-item>

    <b-step-item icon="account-multiple">
      <OrientationForm ref="section-2" />
      <div class="advisor-footer">
        <b-tooltip
          class="is-ficat"
          label="Ative essa opção caso a modalidade do seu curso seja interinstitucional"
          multilined
          size="is-medium"
        >
          <div class="cotutela-switch">
            <p class="cotutela-switch-label">Interinstitucional</p>

            <b-switch v-model="showCotutela"> </b-switch>
          </div>
        </b-tooltip>
      </div>
    </b-step-item>

    <b-step-item v-if="showCotutela" icon="account-key">
      <CotutorshipForm ref="section-3" />
    </b-step-item>

    <b-step-item icon="tag-multiple">
      <KeywordForm :ref="sectionIndex.keyword" />
    </b-step-item>

    <b-step-item icon="check">
      <SendCatalogDataForm :ref="sectionIndex.send" />
    </b-step-item>

    <template
      slot="navigation"
      v-if="customNavigation"
      slot-scope="{ previous, next }"
    >
      <div class="test">
        <b-button
          :disabled="previous.disabled"
          @click.prevent="previous.action"
          class="app-button"
          icon-left="chevron-left"
        >
          Anterior
        </b-button>
        <b-button
          :disabled="next.disabled"
          @click.prevent="validate(next.action)"
          class="app-button"
          icon-right="chevron-right"
        >
          Próximo
        </b-button>
      </div>
    </template>
  </b-steps>
</template>

<script>
import AuthorshipForm from '~/components/AuthorshipForm'
import WorkForm from '~/components/WorkForm'
import OrientationForm from '~/components/OrientationForm'
import KeywordForm from '~/components/KeywordForm'
import SendCatalogDataForm from '~/components/SendCatalogDataForm'
import CotutorshipForm from '~/components/CotutorshipForm'

export default {
  name: 'Steps',
  components: {
    AuthorshipForm,
    WorkForm,
    OrientationForm,
    KeywordForm,
    SendCatalogDataForm,
    CotutorshipForm
  },
  data() {
    return {
      activeStep: 0,

      showSocial: false,
      isAnimated: true,
      isRounded: true,

      hasNavigation: true,
      customNavigation: true,

      labelPosition: 'bottom',
      mobileMode: 'minimalist',
      position: null,
      size: null,

      showCotutela: false,
      leftLabel: true,

      sectionIndex: {
        keyword: 'section-3',
        send: 'section-4'
      }
    }
  },

  watch: {
    showCotutela(val) {
      if (val === false) {
        this.$refs['section-3'].reset()

        this.sectionIndex.keyword = 'section-3'
        this.sectionIndex.send = 'section-4'
      } else if (val === true) {
        this.sectionIndex.keyword = 'section-4'
        this.sectionIndex.send = 'section-5'
      }
    }
  },

  methods: {
    validate(nextAction) {
      const formSectionRef = 'section-' + this.activeStep
      if (this.$refs[formSectionRef].checkNext() === true) {
        nextAction()
        this.$refs['section-' + (this.activeStep + 1)].focus()
      }
    }
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/_all';

// Set your colors

$ficat: #444352;
$ficat-invert: findColorInvert($ficat);

// Lists and maps
$custom-colors: null !default;
$custom-shades: null !default;

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: mergeColorMaps(
  (
    'ficat': (
      $ficat,
      $ficat-invert
    )
  ),
  $custom-colors
);

$link: $ficat;

@import '~bulma';
@import '~buefy/src/scss/buefy';
</style>

<style scoped>
.test {
  text-align: center;
}

.app-button {
  background-color: #595867;
  color: white;
}

.button-content {
  justify-content: space-between;
}

.app-icon {
  vertical-align: middle;
  color: white;
}

.advisor-footer {
  display: flex;
  justify-content: flex-end;
}

.cotutela-switch-label {
  display: inline-block;
  vertical-align: text-bottom;
  margin-right: 5px;
}

.cotutela-switch {
  text-align: right;
  margin-right: 6px;
}
</style>
