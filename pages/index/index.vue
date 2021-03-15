<template>
	<view>
		<button @click="test()">测试</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			test:function(){
				//测试版本更新
				this.Version.downloadApkAndShowProgressForUpdate("https://www.***.com.cn/test.apk");
			}
		}
	}
</script>

<style>

</style>
