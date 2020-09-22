"# tbit-guard-vue-apollo" 

目前有用的目录

	fe
	server


## 启动订阅服务器的方法

	cd server
	node index.js


## 验证订阅服务器生效的方法

可以启动两个graphql playground，一个执行如下订阅脚本，即可进入订阅侦听状态，屏幕下边缘的中间会显示Listening：

	subscription{messageAdded}


另外一个graphql playground，用来添加消息，也就是执行这样的脚本：

	mutation{addMessage(input:"1")}
	mutation{addMessage(input:"2")}
	mutation{addMessage(input:"3")}


在扮演侦听角色内的graphql playground，会显示新增的消息：

	{
	  "data": {
	    "messageAdded": "1"
	  }
	}
	{
		"data": {
	    "messageAdded": "2"
	  }
	}
	{
	  "data": {
	    "messageAdded": "3"
	  }
	}

## 启动vue客户端的方法


	 cd fe
	 npm run serve

然后启动两个chrome tab，地址都是localhost:8080，在其中一个tab内添加一个消息，可以看到两个tab的message列表都会更新。
