var data = [{ "id": 1, "userId": 27, "todayPublishNum": 0, "weekPublishNum": 4, "followerNum": 3, "phoneNumber": "15639283218" }, { "id": 2, "userId": 12, "todayPublishNum": 1, "weekPublishNum": 15, "followerNum": 1, "phoneNumber": "13777446171" }, { "id": 3, "userId": 13, "todayPublishNum": 0, "weekPublishNum": 0, "followerNum": 0, "phoneNumber": "18457123939" }, { "id": 4, "userId": 14, "todayPublishNum": 0, "weekPublishNum": 0, "followerNum": 0, "phoneNumber": "13777889580" }]


var userId = data.filter(item=>{
    if(item.id == 1){
        return item;
    }
});

console.log(userId);


