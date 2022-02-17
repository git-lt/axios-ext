# @mtjs/axios-ext

axios 插件集合

## 业务需求

在业务开发中，对于异步请求的处理方式有多种多样，最常见的主要有以下几种：

- 请求时显示 `loading`
- 请求和响应要处理 `JWT header`
- 全局和局部的异常处理
- Tab切换时，取消上一次请求
- 第一次请求失败时，再重试几次
- 接口轮询
- 在一段时间里缓存幂等请求(get/head/option/put/delete)的请求结果

## 插件设计

- 插件支持全局默认配置
- 在注册插件时可以修改默认配置
- 在局部请求时也可以修改配置
- 局部请求可以开启相关功能
- 部分插件默认为关闭状态，需要在使用时局部开启，避免影响其它请求

### 示例1：通过设置为 **true** 来开启插件功能，作用于单个请求，默认都为 `false`

```js
// 显示全局配置的 loading
api.login({ data, loading: true })
// 错误时重试
api.getUser({ data, retry: true })
// 出错时，使用全局配置的异常拦截器
api.getUser({ data, catchError: true })
// 重复请求时，取消上一次请求
api.getUser({ data, prevCancel: true })
```

### 示例2：通过**配置对象**来覆盖全局配置，同时开启插件功能

```js
// 显示全局配置的 loading
api.login({ data, loading:{ 
    handler: (isLoading, tip) => {
        // 自定义处理loading
    }
} })
// 错误时重试
api.getUser({ data, retry: {
    // 失败时重试 5 次
    count: 5
} })
// 出错时，使用全局配置的异常拦截器
api.getUser({ data, catchError: {
    handler: (error) => {
        // ... 自定义异常处理
    }
} })
// 重复请求时，取消上一次请求
api.getUser({ data, prevCancel: {
    // 判断相同请求时，也判断params
    matchParams: true
} })
```

### 示例3: 没用使用 `registApi` 插件时，可以使用axios原生方式使用插件

```js
// 显示全局配置的 loading
axios.post('/api/login', {}, { loading: true })
// 错误时重试
axios.get('/api/users', { retry: true })
```


## registApi 注册API

注册API，简化调用方式

```js
const apiConfig = {
    getUser: 'get /user',
    createUser: 'post /user',
    deleteUser: id => `delete /user/${id}`,
    updateUser: withConfig({dataType: 'form'})`post /user/${'id'}`
}

// api 注册
const api = axiosRegistApi(axios, { 
  apiConfig, 
  prefix: '/api'
});

const data = {a: 1, b: 2}
const id = 1;

api.getUser({ data }).then()
api.createUser({ data }).then()
api.deleteUser(id)({ data }).then().catch()
```


## retry 重试

适用请求: `get/head/options`
请求失败时重试，当响应状态码为 `500-599` 时，重试当前请求


```js
axiosRetry(axios)

axios.get('/api/user', { retry: {
    count: 3,
    delay: 1000
}})

api.getUser({data, retry: true })

api.getUser({data, retry: {
    count: 3,
    delay: 1000
}})
```

## loading 加载状态

处理loading状态
当请求耗时超过一定时间时，显示loading状态

```js
// 全局设置
axiosLoading(axios, {
    handler: (isLoading, loadingText) => {},
    delay: 200,
    tip: '加载中'
})

axios.get('/api/user', { loading: true })

// 单个请求设置，自定义 loading 显示
api.login({data, loading: {
    tip: '正在登录',
    handler: (isLoading, loadingText) => {
        this.loading = isLoading;
    },
}})

// 或设置为 true， 则调用全局配置的 updateLoading 方法
api.login({data, loading:  true })
```


## jwtHeader 请求带上JWT Header

请求时自动带上 `JWT Token`

```js
jwtHeader(axios, { 
    // 请求头中带上  Authorization
    authTokenHeaderName: 'Authorization',
    // 从响应头中获取更新的 authToken
    newTokenHeaderName: 'newToken',
    tokenPrefix: 'Bear',
    // 获取 token
    getToken: () => {},
    // 保存 token
    saveToken: token => {}
})
```

## catchError 捕获异常

```js
// 全局设置
axiosLoading(axios, {
    // 设置为 true, 则出现异常时，会返回一个一直在 pending 状态的promise 以中断后面的then或catch的执行
    // error.type: network、timeout、server、unkonw、cancel
    // error.data: 错误信息
    handler: (error) => {},
})

// 或设置为 false， 则全局不处理异常，当前请求自己处理异常
api.login({data, catchError:  false }).catch(error => {
    console.log(error)
})
```

## prevCancel 取消上一个相同请求

在具体请求上，通过配置打开，只有当 `prevCancel` 为 `true` 或 配置对象时，生效

同一个请求，请求多次时，取消上一个请求，避免重复请求(一般用于订单状态切换)
prevCancel(get/head)

```js
// axios 调用
axios.get('/api/user', { prevCancel: true })

// 配置为一个对象
api.getUsers({data, prevCancel: {
   // 判断相同请求时，是否判断请求参数，false 则只判断请求url，不判断参数
   matchParams: false,
}})

// 配置为一个bool值
api.getUsers({data, prevCancel: true })
```
