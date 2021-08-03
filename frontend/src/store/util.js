
   let util = {
    getElem(obj ,path){
      try{
        if(obj != null && path != null && obj != undefined && path != undefined){
        const pathPieces = path.split('/');
        let res = obj;
        pathPieces?.forEach(piece => {
          if(res != undefined && res != null && res != ""){
            res = res[piece];
          }
        });
        if (res != undefined) {
          return JSON.parse((JSON.stringify(res)));
        }else{
          return res;
        }
      }else{
        return null;
      }
    }catch(e){
      return null;
    }
      },
    formatDate(timestamp) {
        let date = new Date(timestamp);
        let now = new Date();
        //now = now-now.getTimezoneOffset()
        let duration = now - date;
        let dur = (duration/1000).toString().timeduration();
          return dur;
       }

  }
  
  export default util;

    String.prototype.timeduration = function () {
      var sec_num = parseInt(this, 10);

      var days = Math.floor(sec_num / 86400);
      sec_num -= days * 86400;
      var hours = Math.floor(sec_num / 3600) % 24;
      sec_num -= hours * 3600;
      var minutes = Math.floor(sec_num / 60) % 60;
      sec_num -= minutes * 60;
      let str = "";
      if (days > 0) {
        str += days + " days ";
      }
      if (days < 3) {
        if (hours > 0) {
          str += hours + " hours ";
        }     
        if (minutes > 0) {
          str += minutes + " minutes ";
        } 
      }
      str += "ago";
      if (minutes == 0 && hours == 0 && days == 0) {
        str = "now";
      }

      return str;
  }