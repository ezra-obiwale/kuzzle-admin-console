<template>
  <form class="wrapper">
    <div class="row">
      <div class="col s3">
        <strong>KUID</strong>
      </div>

      <div class="col s6">
        <input
          v-if="editKuid"
          type="text"
          id="custom-kuid"
          class="validate"
          placeholder="Custom KUID"
          :value="kuid"
          :disabled="autoGenerateKuid"
          @change="setCustomKuid"
        />
        <span
          v-if="!editKuid"
        >{{kuid}}</span>
      </div>
      <div class="col s3" v-if="editKuid">
        <label>
          <input
            type="checkbox"
            id="user-auto-generate-kuid"
            class="filled-in"
            :checked="autoGenerateKuid"
            @change="setAutoGenerateKuid"
          />
          <span>
            Auto-generate
          </span>
        </label>
      </div>
    </div>
    <div class="row">
      <div class="col s3">
        <strong>Profiles</strong>
      </div>
      <div class="col s9">
        <user-profile-list
          :added-profiles="addedProfiles"
          @selected-profile="onProfileSelected"
          @remove-profile="removeProfile"
        ></user-profile-list>
      </div>
    </div>
  </form>
</template>

<script type="text/javascript">
import UserProfileList from './UserProfileList'

export default {
  name: 'UserBasicData',
  components: {
    UserProfileList
  },
  props: {
    addedProfiles: {
      type: Array,
      default: () => {
        return []
      }
    },
    autoGenerateKuid: {
      type: Boolean,
      default: false
    },
    kuid: {
      type: String,
      default: null
    },
    editKuid: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setAutoGenerateKuid(event) {
      this.$emit('set-auto-generate-kuid', event.target.checked)
    },
    setCustomKuid(event) {
      this.$emit('set-custom-kuid', event.target.value)
    },
    onProfileSelected(profile) {
      this.$emit('profile-add', profile)
    },
    removeProfile(profile) {
      this.$emit('profile-remove', profile)
    }
  }
}
</script>
