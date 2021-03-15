//在通知栏显示下载进度条
export default function NotificationUtil(){
		var defaultTitle = '通知栏标题';
		var defaultContent = '通知内容';
		var defaultTicker = '通知提示';
		var defaultNotifyId = 1000;
		var defaultNumber = 1;
		/**
		 * @description 比较两个版本大小
		 * 比较版本大小，如果新版本nowVersion大于旧版本OldResourceVersion则返回true，否则返回false
		 */
		function compareVersion(OldVersion, nowVersion) {
			if (!OldVersion || !nowVersion || OldVersion == '' || nowVersion == '') {
				return false;
			}
			//第二份参数 是 数组的最大长度
			var OldVersionA = OldVersion.split(".", 4);
			var nowVersionA = nowVersion.split(".", 4);
			for (var i = 0; i < OldVersionA.length && i < nowVersionA.length; i++) {
				var strOld = OldVersionA[i];
				var numOld = parseInt(strOld);
				var strNow = nowVersionA[i];
				var numNow = parseInt(strNow);
				//小版本到高版本
				if (numNow > numOld /*||strNow.length>strOld.length*/ ) {
					return true;
				} else if (numNow < numOld) {
					return false;
				}
			}
			//如果是版本  如 1.6 - 1.6.1
			if (nowVersionA.length > OldVersionA.length && 0 == nowVersion.indexOf(OldVersion)) {
				return true;
			}
		};
		/**
		 * @constructor 创建通知栏进度条构造函数
		 */
		function NotificationCustom() {
			if (plus.os.name != 'Android') {
				return;
			}
			//当前版本号
			var SystemVersion = plus.os.version;
			var Context = plus.android.importClass("android.content.Context");
			var main = plus.android.runtimeMainActivity();
			var NotificationManager = plus.android.importClass("android.app.NotificationManager");
			var nm = main.getSystemService(Context.NOTIFICATION_SERVICE)
			// Notification build 要android api16以上才能使用(4.1.2以上)
			var Notification = null;
			if (compareVersion('4.1.1', SystemVersion) == true) {
				Notification = plus.android.importClass("android.app.Notification");
			} else {
				Notification = plus.android.importClass("android.support.v4.app.NotificationCompat");
			}
			if (Notification) {
				// this.notifyManager = nm;
				// this.mNotificationBuild = new Notification.Builder(main);
				
				var Build = plus.android.importClass("android.os.Build");
				if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {//android8.0及以上需设置通知渠道才能显示通知
				    //创建通知渠道
				    var name = "渠道名称1";
				    var description = "渠道描述1";
				    var channelId="channelId1";//渠道id     
				    // var importance = NotificationManager.IMPORTANCE_DEFAULT;//重要性级别
						var importance = NotificationManager.IMPORTANCE_HIGH;//重要性级别
						var NotificationChannel = plus.android.importClass("android.app.NotificationChannel");
				    var mChannel = new NotificationChannel(channelId, name, importance);
						// var mChannel = new NotificationChannel("channelId1", "渠道名称1", importance);
				    mChannel.setDescription(description);//渠道描述
						mChannel.setDescription("渠道描述1");//渠道描述
				    mChannel.enableLights(true);//是否显示通知指示灯
				    mChannel.enableVibration(true);//是否振动
						nm.createNotificationChannel(mChannel);//创建通知渠道
						
						this.notifyManager = nm;
						this.mNotificationBuild = new Notification.Builder(main,channelId);
						// this.mNotificationBuild = new Notification.Builder(main,"channelId1");
				}else{
					this.notifyManager = nm;
					this.mNotificationBuild = new Notification.Builder(main);
				}
				
				/*
				mBuilder.setContentTitle("测试标题")//设置通知栏标题
				        .setContentText("测试内容") //设置通知栏显示内容
				        .setContentIntent(getDefalutIntent(Notification.FLAG_AUTO_CANCEL)) //设置通知栏点击意图
				        //  .setNumber(number) //设置通知集合的数量
				        .setTicker("测试通知来啦") //通知首次出现在通知栏，带上升动画效果的
				        .setWhen(System.currentTimeMillis())//通知产生的时间，会在通知信息里显示，一般是系统获取到的时间
				        .setPriority(Notification.PRIORITY_DEFAULT) //设置该通知优先级
				        //  .setAutoCancel(true)//设置这个标志当用户单击面板就可以让通知将自动取消
				        .setOngoing(false)//ture，ַ设置他为一个正在进行的通知。他们通常是用来表示一个后台任务,用户积极参与(如播放音乐)或以某种方式正在等待,因此占用设备(如一个文件下载,同步操作,主动网络连接)
				        .setDefaults(Notification.DEFAULT_VIBRATE)//向通知添加声音、闪灯和振动效果的最简单、最一致的方式是使用当前的用户默认设置，使用defaults属性，可以组合
				        //Notification.DEFAULT_ALL  Notification.DEFAULT_SOUND 添加声音 // requires VIBRATE permission
				        .setSmallIcon(R.drawable.ic_launcher);//设置通知小ICON
				*/
				//设为true代表常驻状态栏
				this.mNotificationBuild.setOngoing(false);
				this.mNotificationBuild.setContentTitle(defaultTitle);
				this.mNotificationBuild.setContentText(defaultContent);
				this.mNotificationBuild.setTicker(defaultTicker);
				//默认的push图标
				// this.mNotificationBuild.setSmallIcon(17301620);//设置小图标
				//https://www.cnblogs.com/penghuster/p/4909930.html
				var R = plus.android.importClass("android.R");
				this.mNotificationBuild.setSmallIcon(R.drawable.stat_sys_download);
				//设置默认声音
				// console.log('默认:'+plus.android.importClass("android.app.Notification").DEFAULT_SOUND);
				this.mNotificationBuild.setDefaults(plus.android.importClass("android.app.Notification").DEFAULT_SOUND);
				//this.mNotificationBuild.setNumber(defaultNumber)
			}
		};
		/**
		 * @description 给android通知栏发送通知
		 * @param {String} title 标题
		 * @param {String} content  内容
		 * @param {String} tickerTips  提示
		 * @param {Number} notifyId id,默认为1000
		 */
		NotificationCustom.prototype.setNotification = function(title, content, tickerTips,notifyId) {
			if (this.mNotificationBuild == null ||
				this.notifyManager == null) {
				return;
			}
			notifyId = (typeof(notifyId)=='number')?notifyId:defaultNotifyId;
			title = title || defaultTitle;
			content = content || defaultContent;
			tickerTips = tickerTips || defaultTicker;
			this.mNotificationBuild.setContentTitle(title);
			this.mNotificationBuild.setContentText(content);
			this.mNotificationBuild.setTicker(tickerTips);
			//默认有声音
			this.mNotificationBuild.setDefaults(plus.android.importClass("android.app.Notification").DEFAULT_SOUND);
			this.notifyManager.notify(notifyId, this.mNotificationBuild.build());
		};
		/**
		 * @description 设置进度条
		 * @param {Number} progress
		 * @param {String} title 标题
		 * @param {String} content  内容
		 * @param {String} tickerTips  提示
		 * @param {Number} notifyId id,默认为1000
		 */
		NotificationCustom.prototype.setProgress = function(progress, title, content, tickerTips,notifyId) {
			if (this.mNotificationBuild == null ||
				this.notifyManager == null) {
				return;
			}
			notifyId = (typeof(notifyId)=='number')?notifyId:defaultNotifyId;
			title = title || 'APP更新包';
			content = content || '正在下载...【'+progress+'%】';
			tickerTips = tickerTips || '进度提示';
			this.mNotificationBuild.setContentTitle(title);
			this.mNotificationBuild.setContentText(content);
			this.mNotificationBuild.setTicker(tickerTips);
			/*
			如果为确定的进度条：调用setProgress(max, progress, false)来设置通知，在更新进度的时候在此发起通知更新progress，并且在下载完成后要移除进度条，通过调用setProgress(0, 0, false)既可。
			如果为不确定（持续活动）的进度条，这是在处理进度无法准确获知时显示活动正在持续，所以调用setProgress(0, 0, true) ，操作结束时，调用setProgress(0, 0, false)并更新通知以移除指示条
			*/
			//进度条显示时,默认无声音
			this.mNotificationBuild.setDefaults(0);
			this.mNotificationBuild.setProgress(100, progress, false);
			this.notifyManager.notify(notifyId, this.mNotificationBuild.build());
		};
		/**
		 * @description 完成进度条
		 * @param {String} title 标题
		 * @param {String} content  内容
		 * @param {String} tickerTips  提示
		 * @param {Number} notifyId id,默认为1000
		 */
		NotificationCustom.prototype.compProgressNotification = function(title, content, tickerTips,notifyId) {
			if (this.mNotificationBuild == null ||
				this.notifyManager == null) {
				return;
			}
			notifyId = (typeof(notifyId)=='number')?notifyId:defaultNotifyId;
			title = title || 'APP更新包';
			content = content || '下载完毕!';
			tickerTips = tickerTips || '进度提示';
			
			var R = plus.android.importClass("android.R");
			this.mNotificationBuild.setSmallIcon(R.drawable.stat_sys_download_done);
			
			this.mNotificationBuild.setContentTitle(title);
			this.mNotificationBuild.setContentText(content);
			this.mNotificationBuild.setTicker(tickerTips);
			this.mNotificationBuild.setProgress(0, 0, false);//移除进度条
			//默认有声音
			this.mNotificationBuild.setDefaults(plus.android.importClass("android.app.Notification").DEFAULT_SOUND);
			this.notifyManager.notify(notifyId, this.mNotificationBuild.build());
		};
		/**
		 * @description 清除通知栏信息
		 * @param {Number} notifyId id,默认为1000
		 */
		NotificationCustom.prototype.clearNotification = function(notifyId) {
			notifyId = (typeof(notifyId)=='number')?notifyId:defaultNotifyId;
			if(this.notifyManager){
				this.notifyManager.cancel(notifyId);
			}		
		};
		/**
		 * @description 清除所有通知栏信息
		 */
		NotificationCustom.prototype.clearAllNotification = function() {
			if(this.notifyManager){
				this.notifyManager.cancelAll();
			}		
		};
		return new NotificationCustom();
	}