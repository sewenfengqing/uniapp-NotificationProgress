```
import NotifiUtil from '@/common/js/js_sdk/notification/util.js'

var appname='�ǻ۹���'+'-V'+'1.0.0'
var NotificationUtil=NotifiUtil()//ʵ������
NotificationUtil.setNotification(appname, "��ʼ����! ");
//dtask����plus.createDownload
var dtask = plus.downloader.createDownload(url);// POST�����ύ����
dtask.start();
dtask.addEventListener( "statechanged", async function(task,status){
switch(task.state) {
case undefined: //��������δ��ʼ
case 0: //��������ʼ����
case 1: //��������ʼ����
case 2: break; //�������������Ѿ�����
case 3: // �ѽ��յ�����
NotificationUtil.setProgress(Math.round(task.downloadedSize/task.totalSize*100),appname);
break;
case 4: // �������
console.log("Download success: " + task.filename);
NotificationUtil.compProgressNotification(appname,"�������! ");
var ins=plus.runtime.install(plus.io.convertLocalFileSystemURL(task.filename), {force: force},()=>{
uni.showToast({icon:'none',title:'��װ�ɹ���'});
NotificationUtil.clearNotification();
},(e)=>{
uni.showToast({icon:'none',title:'��װʧ�ܣ�'});
NotificationUtil.clearNotification();
})
break;
default: //5: (Number ���� )������������ͣ -1: (Number ���� )ö������״̬
console.log("Download failed: " + status);
NotificationUtil.compProgressNotification(appname,"����ʧ��! ");
break;
}
} );
```