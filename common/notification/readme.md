```
import NotifiUtil from '@/common/js/js_sdk/notification/util.js'

var appname='智慧工地'+'-V'+'1.0.0'
var NotificationUtil=NotifiUtil()//实例创建
NotificationUtil.setNotification(appname, "开始下载! ");
//dtask就是plus.createDownload
var dtask = plus.downloader.createDownload(url);// POST请求提交数据
dtask.start();
dtask.addEventListener( "statechanged", async function(task,status){
switch(task.state) {
case undefined: //下载任务未开始
case 0: //下载任务开始调度
case 1: //下载任务开始请求
case 2: break; //下载任务请求已经接收
case 3: // 已接收到数据
NotificationUtil.setProgress(Math.round(task.downloadedSize/task.totalSize*100),appname);
break;
case 4: // 下载完成
console.log("Download success: " + task.filename);
NotificationUtil.compProgressNotification(appname,"下载完成! ");
var ins=plus.runtime.install(plus.io.convertLocalFileSystemURL(task.filename), {force: force},()=>{
uni.showToast({icon:'none',title:'安装成功！'});
NotificationUtil.clearNotification();
},(e)=>{
uni.showToast({icon:'none',title:'安装失败！'});
NotificationUtil.clearNotification();
})
break;
default: //5: (Number 类型 )下载任务已暂停 -1: (Number 类型 )枚举任务状态
console.log("Download failed: " + status);
NotificationUtil.compProgressNotification(appname,"下载失败! ");
break;
}
} );
```