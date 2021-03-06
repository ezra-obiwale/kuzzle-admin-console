<template>
  <div class="CollectionForm wrapper">

    <div v-if="Object.keys(flattenMapping).length > 0">
      <h4>Set up the document-creation form.</h4>
      <p>Here, you'll be able to associate mapping fields to form fields to setup a form that will ease the creation of
        documents in this collection.
      </p>
      <p>You can toggle the document-creation form using the checkbox below</p>

      <div class="row">
        <label>
          <input type="checkbox" class="filled-in" id="allowForm" @change="changeAllowForm" :checked="$store.state.collection.allowForm"/>
          <span class="allow-form">Enable forms for this collection.</span>
        </label>
      </div>

      <div
        v-if="$store.state.collection.allowForm"
        >
        <div class="row">
          <div class="divider"></div>
        </div>

        <div class="CollectionForm-head row">
          <div class="col s3">Mapping fields</div>
          <div class="col s9">Form fields</div>
        </div>

        <div class="row">
          <div class="divider"></div>
        </div>

        <collection-form-line
          v-for="(type, attributeName, index) in flattenMapping"
          :key="index"
          :name="attributeName"
          :type="type"
          :index="index"
          :choose-values="flattenSchemaWithType[attributeName].chooseValues"
          :values="flattenSchemaWithType[attributeName].values"
          :value="flattenSchemaWithType[attributeName]"
          @input="changeSchema">
        </collection-form-line>
      </div>

      </div>

    <div class="CollectionForm-noMapping" v-else>
      <h4>You are creating a collection with an empty mapping.</h4>
      <p>This is OK, since <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-field-mapping.html">
        the mapping of your collection will be determined by the
        persistence engine as you create new documents</a>, but there's a few things
        you may need to know before proceeding.</p>

      <ul>
        <li>Defining the mapping for a collection enables you to specify the types of the attibutes of the object contained into it.</li>
        <li>If you want to edit the mapping of the current collection, once it's created, you can click on "Edit collection" in the context,
          right after its name. You will access this wizard.
        </li>
        <li>Once specified, the fields of a mapping cannot be updated or deleted, you will only be able to add new fields.</li>
        <li>Once your collection has a mapping, you can associate its fields with a set of form fields using this wizard. This will enable
          you to setup a form that will ease the creation of documents.
        </li>
      </ul>
    </div>

    <div class="row">
      <div class="divider"></div>
    </div>

    <!-- Actions -->
    <div class="row">
      <div class="col s12">
        <a tabindex="6" class="btn-flat waves-effect" @click.prevent="cancel">Cancel</a>
        <button type="submit" class="btn primary waves-effect waves-light" @click.prevent="next">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import title from '../../../../directives/title.directive'
import {
  SET_SCHEMA,
  SET_ALLOW_FORM
} from '../../../../vuex/modules/collection/mutation-types'
import CollectionFormLine from './CollectionFormLine'
import CollectionFormName from './CollectionFormName'

export default {
  name: 'CollectionForm',
  props: {
    mapping: Object,
    step: Number
  },
  components: {
    CollectionFormLine,
    CollectionFormName
  },
  directives: {
    title
  },
  data() {
    return {
      schema: {},
      allowForm: true
    }
  },
  methods: {
    next() {
      this.$store.commit(SET_SCHEMA, this.schema)
      this.$emit('collection-create::create')
    },
    cancel() {
      this.$emit('cancel')
    },
    changeAllowForm(e) {
      this.$store.commit(SET_ALLOW_FORM, e.target.checked)
    },
    changeSchema(event) {
      this.$store.commit(SET_SCHEMA, {
        ...this.schema,
        [event.name]: event.element
      })
    }
  },
  computed: {
    flattenMapping() {
      return this.$store.getters.flattenMapping
    },
    flattenSchemaWithType() {
      return this.$store.getters.flattenSchemaWithType
    }
  },
  watch: {
    step() {
      // if (Object.keys(this.schema).length) {
      //   this.$store.commit(SET_SCHEMA, this.schema)
      // }
    },
    flattenSchemaWithType() {
      this.schema = { ...this.flattenSchemaWithType }
    },
    flattenMapping(newMapping) {
      if (Object.keys(newMapping).length === 0) {
        this.$store.commit(SET_ALLOW_FORM, false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// @TODO pass this code to BEM
.CollectionForm {
  .CollectionForm-head {
    color: $lavandia-color;
  }
  .CollectionForm-noMapping {
    padding: 20px;

    ul,
    li {
      list-style-type: disc;
    }
  }
}
</style>
