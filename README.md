# uniapp-NotificationProgress


 1. 创建version.js文件（封装了版本更新的业务处理）
```
import NotifiUtil from './notification/notification.js'
const downloadAndHandleWgtFile = function(url){
    uni.downloadFile({
        url: url,  
        success: (downloadResult) => {  
            console.log("downLoadFile:" + JSON.stringify(downloadResult));
            if (downloadResult.statusCode === 200) {  
                plus.runtime.install(downloadResult.tempFilePath, {  
                    force: false  
                }, function() {  
                    console.log('install success...');  
                    plus.runtime.restart();  
                }, function(e) {  
                    console.error('install fail...');  
                });  
            }  
        }  
    });  
}
const downloadAndHandleApkFile = function(url){    
    plus.nativeUI.showWaiting("下载中..."); 
    var dtask = plus.downloader.createDownload( url, {}, function ( d, status ) {  
        if ( status == 200 ) { // 下载成功 
            var path = d.filename;  
            console.log("path:" + d.filename);  
            plus.runtime.install(path);  // 安装下载的apk文件  
        } else {//下载失败  
            alert( "Download failed: " + status );   
        }   
        plus.nativeUI.closeWaiting(); 
    });  
    dtask.start();
}
//版本升级：实现通知栏显示下载进度
const downloadApkAndShowProgressForUpdate = function(url){
    // if(!hasNetwork()){
    //     return;
    // }
    uni.showToast({
        title: '下载中...',
        icon:'none'
    });
    //Uni.Push：标准基座下可直接运行；自定义基座或正式包，需在manifest.json添加Uni.Push模块并配置
    // plus.push.createMessage( "下载中...", "jack",{cover:true,sound:"none",title:"标题",subtitle:"副标题"});//仅在通知栏显示开始和结束提醒：不会引起操作界面卡顿
    var appname='杰克物联';
    var NotificationUtil = NotifiUtil();//实例创建
    NotificationUtil.setNotification(appname, "开始下载! ");
    //dtask就是plus.createDownload
    // var url = "https://www.uchat.com.cn/app/iot/JackIot.apk";
    var dtask = plus.downloader.createDownload(url);// POST请求提交数据
    dtask.start();
    var arr = [{
        pro:1,
        isFirst:true
    },{
        pro:10,
        isFirst:true
    },{
        pro:30,
        isFirst:true
    },{
        pro:50,
        isFirst:true
    },{
        pro:70,
        isFirst:true
    },{
        pro:90,
        isFirst:true
    }]
    dtask.addEventListener( "statechanged", async function(task,status){
        switch(task.state) {
            case undefined: //下载任务未开始
            case 0: //下载任务开始调度
            case 1: //下载任务开始请求
            case 2: break; //下载任务请求已经接收
            case 3: // 已接收到数据
                // NotificationUtil.setProgress(Math.round(task.downloadedSize/task.totalSize*100),appname);//通知栏中实时更新进度条会引起操作界面卡顿：一秒执行40多次（监听函数），导致UI操作阻塞
                var pro = parseInt(task.downloadedSize/task.totalSize*100);
                    // if(pro == 1 || pro == 10 || pro == 30 || pro == 50 || pro == 70 || pro == 90){//优化方案一：仅在指定整数进度时更新
                    //     console.log("进度：" + pro);
                    //     NotificationUtil.setProgress(pro,appname);
                    // }
                    switch (pro){//优化方案二：仅进度第一次出现（1,10，30，50，70，90）时刷新
                        case arr[0].pro:
                            if(arr[0].isFirst){
                                console.log("进度：" + pro);
                                NotificationUtil.setProgress(pro,appname);
                                arr[0].isFirst = false;
                            }
                            break;
                        case arr[1].pro:
                            if(arr[1].isFirst){
                                console.log("进度：" + pro);
                                NotificationUtil.setProgress(pro,appname);
                                arr[1].isFirst = false;
                            }
                            break;
                        case arr[2].pro:
                            if(arr[2].isFirst){
                                console.log("进度：" + pro);
                                NotificationUtil.setProgress(pro,appname);
                                arr[2].isFirst = false;
                            }
                            break;
                        case arr[3].pro:
                            if(arr[3].isFirst){
                                console.log("进度：" + pro);
                                NotificationUtil.setProgress(pro,appname);
                                arr[3].isFirst = false;
                            }
                            break;
                        case arr[4].pro:
                            if(arr[4].isFirst){
                                console.log("进度：" + pro);
                                NotificationUtil.setProgress(pro,appname);
                                arr[4].isFirst = false;
                            }
                            break;
                        case arr[5].pro:
                            if(arr[5].isFirst){
                                // console.log("进度：" + pro);
                                NotificationUtil.setProgress(pro,appname);
                                arr[5].isFirst = false;
                            }
                            break;
                        default:
                            break;
                    }
                break;
            case 4: // 下载完成
                console.log("Download success: " + task.filename);
                NotificationUtil.compProgressNotification(appname,"下载完成! ");
                // var ins = plus.runtime.install(plus.io.convertLocalFileSystemURL(task.filename), {force: force},()=>{
                //     uni.showToast({icon:'none',title:'安装成功！'});
                //     NotificationUtil.clearNotification();
                // },(e)=>{
                //     uni.showToast({icon:'none',title:'安装失败！'});
                //     NotificationUtil.clearNotification();
                // })
                plus.runtime.install(task.filename);  // 安装下载的apk文件  
                break;
            default: //5: (Number 类型 )下载任务已暂停 -1: (Number 类型 )枚举任务状态
                console.log("Download failed: " + status);
                NotificationUtil.compProgressNotification(appname,"下载失败! ");
                break;
        }
    });
}
export default {
    downloadAndHandleWgtFile,
    downloadAndHandleApkFile,
    downloadApkAndShowProgressForUpdate
}
```

2. main.js：全局引入version.js（可略过，在调用页面引入也行）
```
import Vue from 'vue'
import App from './App'
import Version from './common/version.js'
Vue.config.productionTip = false
Vue.prototype.Version = Version 
App.mpType = 'app'
const app = new Vue({
    Version,
    ...App
})
app.$mount()
```

3. test.vue：页面调用版本更新
```
//测试版本更新
this.Version.downloadApkAndShowProgressForUpdate("https://www.***.com.cn/test.apk");
```

