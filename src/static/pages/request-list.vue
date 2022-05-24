<template>
  <div id="request-list">
    
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">ID</th>
          <th scope="col">Request date</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(request, idx) in requestList" v-bind:key="request.SEQ">
          <th scope="row">{{idx+1}}</th>
          <td>
            <div v-if="request.REQ_STATUS==7"><a :href="`/target/${request.ID}/`" target="_blank">{{request.ID}}</a></div>
            <div v-else>{{request.ID}}</div>
          </td>
          <td data-toggle="tooltip" data-placement="top" :title="`${$dayjs(request.REQ_DATE).format('YYYY-MM-DD HH:mm')}`">{{ $dayjs(request.REQ_DATE).format('YYYY-MM-DD')}}</td>
          <td><i class="bi" :class="['bi-'+statusMap[request.REQ_STATUS].icon, 'text-'+statusMap[request.REQ_STATUS].color ]"></i> {{statusMap[request.REQ_STATUS].name}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

var data = {
  id : 'request-list'
  , list : { }
  , requestList : []
  , statusMap : {
    0 : { name : '접수대기', icon : 'hourglass', color : 'secondary'}
    , 1 : { name : '접수완료', icon : 'hourglass', color : 'secondary'}
    , 3 : { name : '백업중', icon : 'hourglass-split', color : 'primary'}
    , 7 : { name : '완료', icon : 'check-circle' , color : 'success'}
    , 9 : { name : '실패', icon : 'exclamation-circle' , color : 'danger'}
  }
};

module.exports = {
  name: 'list',
  data: function () {
    return data
  },
  computed: {
    
  }
  ,methods: {
    getRequestList : async () => { getRequestList(); }
  }
  ,async created() {
    console.log("axios",axios);
    const result = await axios.get("/api/request-list");
    this.requestList = result.data.list;
    // result.data.list.forEach((el,idx) => {
    //   //this.requestList.push(el);  
    //   Vue.set(this.requestList, idx, el);
      
    // });
    
    
    //this.$set("requestList", result.data.list)
    
    //this.$set(this.requestList, result.data.list)
    
    console.log("axios", this.requestList);
    //debugger;
    //data.id="request-list2";
  }
  , mounted:function () {
  }, filters : {
    date : (val) => {
      return val.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4');
    }
  }
}


</script>

<style>
  @keyframes rotate{
      from{ transform: rotate(-360deg); }
      to{ transform: rotate(360deg); }
  }

  .rotation_icon{
    animation-name: rotate;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    border-radius: 50%;
  }

  
</style>