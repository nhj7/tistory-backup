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
        <tr v-for="(request, idx) in requestList" v-bind:key="request.id">
          <th scope="row">{{idx+1}}</th>
          <td>{{request.id}}</td>
          <td>{{request.date | date}}</td>
          <td><i class="bi text-primary" :class="['bi-'+statusMap[request.status].icon]"></i> {{statusMap[request.status].name}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

const data = {
  id : 'request-list'
  , requestList : [
    { id : 'nhj7', date : '20220509', status:'0'}
    , { id : 'Jacob', date : '20220508', status:'3'}
    , { id : 'nhj12311', date : '20220507', status:'7'}
  ]
  , statusMap : {
    0 : { name : '대기중', icon : 'hourglass'}
    , 3 : { name : '백업중', icon : 'hourglass-split'}
    , 7 : { name : '완료', icon : 'check-circle'}
  }
};

module.exports = {
  name: 'list',
  data: function () {
    return data
  },
  computed: {
    hasResult: function () {
      return this.posts.length > 0
    }
  }
  ,methods: {
    getRequestList : async () => { getRequestList(); }
  }
  ,created: function() {
    getRequestList();
  }
  , mounted:function () {
  }, filters : {
    date : (val) => {
      return val.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    }
  }
}

const getRequestList = async() => {
  console.log("axios",axios);
  const result = await axios.get("/api/request-list");
  console.log("axios",result);
  data.id="request-list2";
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