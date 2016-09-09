import Vue from 'vue'
import store from '../../../../../../src/vuex/store'
import {mockedComponent} from '../../../helper'

describe('Update component test', () => {
  let UpdateInjector = require('!!vue?inject!../../../../../../src/components/Security/Users/Update')
  let Update
  let sandbox = sinon.sandbox.create()
  let vm
  let $vm
  let $dispatch
  let $broadcast
  let triggerError = true

  let refreshIndexSpy = sandbox.stub()
  let setNewDocumentSpy = sandbox.stub()

  const mockInjector = () => {
    Update = UpdateInjector({
      './Common/CreateOrUpdate': mockedComponent,
      '../../Materialize/Headline': mockedComponent,
      '../Collections/Dropdown': mockedComponent,
      '../../../services/kuzzle': {
        security: {
          updateUserPromise: () => {
            if (triggerError) {
              return Promise.reject('error')
            }
            return Promise.resolve()
          },
          getUserPromise: () => {
            if (triggerError) {
              return Promise.reject('error')
            }
            return Promise.resolve({content: {}})
          }
        },
        refreshIndex: refreshIndexSpy
      },
      '../../../vuex/modules/data/getters': {
        newDocument: sandbox.stub(),
        documentToEditId: sandbox.stub()
      },
      '../../../vuex/modules/data/actions': {
        setNewDocument: sandbox.stub()
      },
      '../Collections/Tabs': mockedComponent
    })

    document.body.insertAdjacentHTML('afterbegin', '<body></body>')
    vm = new Vue({
      template: '<div><update v-ref:update index="index" collection="collection"></update></div>',
      components: {Update},
      replace: false,
      store: store
    }).$mount('body')

    $vm = vm.$refs.update
    $vm.$router = {_prevTransition: {to: sandbox.stub()}, go: sandbox.stub()}
    $dispatch = sandbox.stub()
    $broadcast = sandbox.stub()
    $vm.setNewDocument = setNewDocumentSpy
    $vm.$dispatch = $dispatch
    $vm.$broadcast = $broadcast
  }

  before(() => mockInjector())
  afterEach(() => sandbox.restore())

  describe('methods test', () => {
    describe('update', () => {
      it('should dispatch an error because the json document is invalid', () => {
        $vm.update('code')
        expect($dispatch.calledWith('toast', 'Invalid document', 'error'))
      })

      it('should mutate a new json document', () => {
        mockInjector()
        $vm.setNewDocument = setNewDocumentSpy
        $vm.update('code', {foo: 'bar'})
        expect(setNewDocumentSpy.called).to.be.ok
      })

      it('should update the document and redirect', (done) => {
        triggerError = false
        $vm.$router = {go: sandbox.stub()}
        mockInjector()
        $vm.update('form', {foo: 'bar'})
        setTimeout(() => {
          expect(refreshIndexSpy.called).to.be.ok
          done()
        }, 0)
      })
    })

    describe('cancel', () => {
      it('should broadcast document-create::cancel', () => {
        $vm.$router.go.reset()
        $vm.cancel()
        expect($vm.$router.go.callCount).to.be.equal(1)
      })
    })
  })
})