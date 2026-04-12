1. 上传文件失败,我看了一下，是接口访问的不对，别的都是dev-api/pet/info/list，但是上传的确是common/upload
2. 修改知识课堂弹窗中的课程内容的样式是不对的，现在特别窄


3.use-handlers.ts:27 
 UploadAjaxError: fail to post /dev-api/common/upload 0
    at getError (ajax.ts:22:10)
    at XMLHttpRequest.<anonymous> (ajax.ts:58:20)
ajax.ts:80 
 
 POST http://localhost:3000/dev-api/common/upload net::ERR_CONNECTION_RESET




 4. 我点击进入捐赠详情，出现：请求参数类型不匹配，参数[donationId]要求类型为：'java.lang.Long'，但输入值为：'undefined'