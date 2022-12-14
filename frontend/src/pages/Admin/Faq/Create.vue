<template>
    <Layout>
        <h1 class="mt-4">{{ title }}</h1>
        <ol class="breadcrumb mb-4">
            <li class="breadcrumb-item"><router-link to="/admin/dashboard">Home</router-link></li>
            <li class="breadcrumb-item"><a href="#">Reference</a></li>
            <li class="breadcrumb-item"><router-link to="/admin/faq/list">{{ title }}</router-link></li>
            <li class="breadcrumb-item active">Create</li>
        </ol>
         <div v-if="alert.message" :class="`alert alert-dismissible fade show ${alert.type}`" role="alert">
            <small><i class="fa" v-bind:class="[ alert.type === 'alert-success' ? 'fa-check' : 'fa-warning']"></i> &nbsp;{{alert.message}}</small>
        </div>
        <form autocomplete="off" @submit.prevent="handleSubmit">
             <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h6><i class="fas fa-edit"></i>&nbsp;Please fill in the form below</h6>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <label  class="col-sm-2 col-form-label">Category <span class="text-danger">*</span></label>
                        <div class="col-sm-10">
                            <v-select :options="categories" v-model="faq.categorySelected" :disabled="status.sendRequest" :class="{ 'is-invalid': submitted && v$.faq.categorySelected.$error }"></v-select>
                             <span v-if="v$.faq.categorySelected.$error" class="invalid-feedback"> {{ v$.faq.categorySelected.$errors[0].$message }} </span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label  class="col-sm-2 col-form-label">Question <span class="text-danger">*</span></label>
                        <div class="col-sm-10">
                            <input type="text" v-model="faq.question"  class="form-control" :disabled="status.sendRequest" :class="{ 'is-invalid': submitted && v$.faq.question.$error }">
                            <span v-if="v$.faq.question.$error" class="invalid-feedback"> {{ v$.faq.question.$errors[0].$message }} </span>
                        </div>
                    </div>
                     <div class="row mb-3">
                        <label  class="col-sm-2 col-form-label">Answer <span class="text-danger">*</span></label>
                        <div class="col-sm-10">
                            <textarea class="form-control" v-model="faq.answer" rows="6" :disabled="status.sendRequest" :class="{ 'is-invalid': submitted && v$.faq.answer.$error }"></textarea>
                            <span v-if="v$.faq.answer.$error" class="invalid-feedback"> {{ v$.faq.answer.$errors[0].$message }} </span>
                        </div>
                    </div>
                     <div class="row mb-3">
                        <label  class="col-sm-2 col-form-label">Sort</label>
                        <div class="col-sm-10">
                            <input type="number" v-model="faq.sort"  class="form-control" :disabled="status.sendRequest">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label  class="col-sm-2 col-form-label">Status</label>
                        <div class="col-sm-10">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" value="1" v-model="faq.is_published">
                                <label class="form-check-label" for="inlineRadio1">Published</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" value="0" v-model="faq.is_published">
                                <label class="form-check-label text-nowrap" for="inlineRadio2">Draft</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer clearfix">
                    <div class="float-start">
                         <router-link to="/admin/faq/list" data-bs-toggle="tooltip" data-bs-placement="top" title="Back To List" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i>&nbsp;Back To List
                        </router-link>
                        &nbsp;
                        <button type="submit" class="btn btn-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Save From" :disabled="status.sendRequest">
                            <template v-if="status.sendRequest === true">
                                <i class="fa fa-spinner fa-spin"></i>&nbsp;Send Data...
                            </template>
                            <template v-else>
                                <i class="fa fa-save"></i>&nbsp;Save Change
                            </template>
                        </button>
                    </div>
                    <div class="float-end">
                        <button type="reset" class="btn btn-warning text-white" data-bs-toggle="tooltip" data-bs-placement="top" title="Reset Form"><i class="fa fa-refresh"></i>&nbsp;Reset Form</button>
                    </div>
                </div>
            </div>
        </form>
    </Layout>
</template>
<script>

    import Layout from "../../../components/Admin/Layout.vue"
    import { useMeta } from 'vue-meta'
    import { mapState, mapActions } from 'vuex'
    import useValidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'

    const SITE_TITLE = "Faq";

    export default {
        name: "CreateFaq",
        components: {
            Layout
        },
        data(){
            return {
                title: SITE_TITLE,
                submitted: false,
                v$: useValidate(),
                faq:{
                    question: "",
                    answer: "",
                    sort: 0,
                    is_published: 0,
                    categorySelected: { code: "", label: "" }
                }
            }
        },
        computed: {
            ...mapState('faq', ['status']),
            ...mapState({
                alert: state => state.alert,
                categories: state=> state.faq.faqCategories,
            })
        },
        created() { 
           this.alert.message = ''
        },
        mounted() {
            this.getCategories()
        },
        methods: {
            ...mapActions({
                clearAlert: 'alert/clear',
            }),
            ...mapActions('faq', {
                create: 'create',
                getCategories: 'categories'
            }),
            handleSubmit(e) {
                this.submitted = true;
                this.v$.faq.$validate()
                if (!this.v$.faq.$error) {
                    this.create(this.faq)
                } 
            }
        },
        setup() {
            useMeta({
                title: SITE_TITLE
            })
        },
        watch: {
            $route (to, from){
                // clear alert on location change
                this.clearAlert();
            }
        },
        validations() {
            return {
                faq: {
                    categorySelected: { required },
                    question: { required },
                    answer: { required }
                }
            }
        },
    }
</script>