"# tbit-guard-vue-apollo" 

目前有用的目录

	fe
	server

# 文件上传

此处使用的服务器文件为indexUpload.js：

	node indexUpload.js
	
文件上传使用graphql playground并不支持。可以使用allair graphql 工具来访问。查询输入：

	mutation ($file:Upload!){
	  singleUpload(file:$file){
	    id
	    path
	    filename
	    mimetype
	    encoding
	  }
	}


变量区(variables)内点击Add files ,添加一个文件，即可点击执行。此时应该看到返回为：

	{
	  "data": {
	    "singleUpload": {
	      "id": "rNmULh-m-",
	      "path": "files/rNmULh-m--libEGL.dll",
	      "filename": "libEGL.dll",
	      "mimetype": "application/x-msdownload",
	      "encoding": "7bit"
	    }
	  }
	}

且在服务器的./uploads内看到上传的文件。

# 订阅
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
