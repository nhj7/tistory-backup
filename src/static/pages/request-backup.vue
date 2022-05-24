<template>
<div id="request-backup">
    
<br />    

<div > <h4>백업하고 싶은 티스토리 아이디와 받고 싶은 메일 주소를 적어주세요 🚀</h4> </div>

<form class="form-floating">
    
    <div class="mb-3">
        <label for="tistoryInputID" class="form-label">티스토리 아이디</label>
        <input type="text" v-validate="'required|alpha_dash'" data-vv-validate-on="keyup|blur" data-vv-as="티스토리 아이디" 
          class="form-control" :class="[errors.has('tistoryID')?'is-invalid':'']" name="tistoryID" ref="tistoryID" v-model="reqBakObj.id" >
        <span v-show="errors.has('tistoryID')" class="text-danger">{{ errors.first('tistoryID') }}</span>
        <div id="tistoryIDHelp" class="form-text">[].tistory.com 부분에 [] 부분을 입력해주세요. ex) {{exTistoryID}}.tistory.com => {{exTistoryID}}</div>
    </div>
    <div class="mb-3">
        <label for="tistoryInputIDChk" class="form-label">티스토리 아이디 확인</label>
        <input type="text" v-validate="'required|alpha_dash|confirmed:tistoryID'" data-vv-validate-on="keyup|blur" data-vv-as="티스토리 아이디 확인" 
          class="form-control" :class="[errors.has('tistoryIDChk')?'is-invalid':'']" name="tistoryIDChk" ref="tistoryIDChk" v-model="reqBakObj.idChk">
        <div ref="tistoryIDChkHelp" class="form-text" :class="[errors.has('tistoryIDChk')?'text-danger':'']">{{ errors.first('tistoryIDChk') }} </div><br/>
    </div>
    <div class="mb-4">
        <label for="userEmail" class="form-label">이메일 주소</label>
        <input type="email" v-validate="'required|email'" data-vv-validate-on="keyup|blur" data-vv-as="이메일"  class="form-control" name="userEmail" ref="userEmail" v-model="reqBakObj.email"  >
        <span v-show="errors.has('userEmail')" class="text-danger">{{ errors.first('userEmail') }}</span>
        
    </div>
    <div class="mb-5 form-check">
        <input type="checkbox" v-validate="'required'" data-vv-as="사실 확인" class="form-check-input" id="tistoryAgree" name="tistoryAgree" ref="tistoryAgree" v-model="reqBakObj.agree">
        <label class="form-check-label" for="tistoryAgree" :class="[errors.has('tistoryAgree')?'text-danger':'']">백업 기능이 완전하지 않다는 사실을 확인합니다.</label>
    </div>
    <button type="button" class="btn btn-dark"  @click="chkBackup">백업</button>
</form>


<!-- modal list -->
<!-- Button trigger modal -->
  <!-- Modal -->
  <div class="modal fade" id="requestModal" ref="requestModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="exampleModalLabel">티스토리 백업 요청</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          티스토리 아이디 `{{reqBakObj.id}}`` 백업 후 이메일 주소 `{{reqBakObj.email}}` 로 발송해드릴게요. 
          <div>{{}}</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn btn-primary" @click="requestBackup" data-bs-dismiss="modal">백업 요청</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  const data = {
    exTistoryID : 'nhj12311'
    , modal : false
    , reqBakObj : {
      id : ''
      , idChk : ''
      , email : ''
      , agree : false
    }
  }
  module.exports = {
    name: 'backup',
    data: function () {
      return data
    },
    computed: {
      hasResult: function () {
        return this.posts.length > 0
      }
    }
    ,methods: {
      async requestBackup(){
        console.log("axios",axios);
        //const params = new URLSearchParams(data.reqBakObj);
        this.$store.state.progressModal = true;
        const result = await axios.post("/api/request-backup", data.reqBakObj);
        this.$store.state.progressModal = false;
        console.log("axios",result);
        data.id="request-list2";
      } 
      , async chkBackup (){
        
        const valid = await this.$validator.validate();
        //debugger;
        if( !valid ){
          this.$el.querySelector('[name="' + this.$validator.errors.items[0].field + '"]').scrollIntoView()
          this.$el.querySelector('[name="' + this.$validator.errors.items[0].field + '"]').focus();
          return;
        }
        const requestModal = new bootstrap.Modal(document.getElementById('requestModal'))
        requestModal.show();

        return;
      }      
    }
    ,created: function() {
      //debugger;
      console.log(this.$store.state.progressModal)

    }
    , mounted:function () {
    }
  }

</script>