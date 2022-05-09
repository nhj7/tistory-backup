<template>
<div id="request-backup">
    
<br />    

<div > <h4>백업하고 싶은 티스토리 아이디와 받고 싶은 메일 주소를 적어주세요 🚀</h4> </div>

<form>
    
    <div class="mb-3">
        <label for="tistoryInputID" class="form-label">티스토리 아이디</label>
        <input type="text" class="form-control" id="tistoryID" v-model="reqBakObj.id" aria-describedby="tistoryIDHelp">
        <div id="tistoryIDHelp" class="form-text">[].tistory.com 부분에 [] 부분을 입력해주세요. ex) {{exTistoryID}}.tistory.com => {{exTistoryID}}</div>
    </div>
    <div class="mb-3">
        <label for="tistoryInputIDChk" class="form-label">티스토리 아이디 확인</label>
        <input type="text" class="form-control" id="tistoryIDChk" v-model="reqBakObj.idChk" aria-describedby="tistoryIDChkHelp">
        <div id="tistoryIDChkHelp" class="form-text">윗 부분과 동일하게 입력해주세요.</div><br/>
    </div>
    <div class="mb-4">
        <label for="tistoryInputEmail" class="form-label">이메일 주소</label>
        <input type="email" class="form-control" id="tistoryInputEmail" v-model="reqBakObj.email" >
        
    </div>
    <div class="mb-5 form-check">
        <input type="checkbox" class="form-check-input" id="tistoryAgree" v-model="reqBakObj.agree">
        <label class="form-check-label" for="tistoryAgree">백업 기능이 완전하지 않다는 사실을 확인합니다.</label>
    </div>
    <button type="button" class="btn btn-dark"  data-bs-toggle="modal" data-bs-target="#requestModal">백업</button>
</form>


<!-- modal list -->
<!-- Button trigger modal -->
  <!-- Modal -->
  <div class="modal fade" id="requestModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="exampleModalLabel">티스토리 백업 요청</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          티스토리 아이디 {{reqBakObj.id}} 백업 후 이메일 주소 {{reqBakObj.email}} 로 발송해드릴게요. 
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-bs-dismiss="modal">닫기</button>
          <button type="button" class="btn btn-primary" @click="requestBackup">백업 요청</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  const data = {
    exTistoryID : 'nhj12311'
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
      requestBackup : function(){ requestBackup(); }
    }
    ,created: function() {
          
    }
    , mounted:function () {
    }
  }

  const validateBackup = async() => {
    if( !data.reqBakObj.id ){
      
    }
  }

  const requestBackup = async() => {    
    console.log("axios",axios);
    const result = await axios.get("/api/request-backup", data.reqBakObj);
    console.log("axios",result);
    data.id="request-list2";
  }

</script>