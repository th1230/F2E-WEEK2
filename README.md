# F2E-WEEK2 自行車道地圖資訊整合網
## [GitPage頁面連結](https://th1230.github.io/F2E-WEEK2/)

### 使用的相關工具以及框架

#### 框架
* angular 

#### 地圖工具&圖資
* leaflet 
* 圖資mapbox

#### github上傳工具
* angular-cli-ghpages [npm連結](https://www.npmjs.com/package/angular-cli-ghpages)

#### 使用的OpenAPI 
* TDX運輸資料流通服務 [API連結](https://tdx.transportdata.tw/api-service/swagger)

## 網頁結構

#### 頁面簡介

1. home(為初始的頁面，通過搜尋或navbar可跳轉至search頁面)
2. search(為主要搜尋以及顯示的畫面，包括地圖以及相關的搜尋結果)

#### 組件分類

* components-----放置所有的組件包過home以及search頁
* search-----放置所有有關search需要顯示的相關組件
  1. bike-card-----用於顯示搜尋後的腳踏車站點資料
  2. route-card-----用於顯示搜尋後的路線資料
  3. map-----為地圖組件，包含一個service用於控制地圖的資料以及card與map的互動
  4. view-food-card-----顯示路線旁的景點與美食
  5. view-food-detail-----顯示景點與美食的相關細節
* shareComponents-----有一個搜尋專用的組件
  1. search-card-----主要處理搜尋的地點以及名稱的紀錄，並解打出相對應的api儲存到data-manager-service.ts

#### service分類

1. data-service-----放置所有的http api
2. data-manager-----儲存搜尋後的值，並送到search頁面
3. page-manager-----管理頁面的切換(不包括美食和景點)

#### interceptor

* 主要為所有api加上header

#### 圖片

* 所有靜態圖片放置在assets/images中

## 心得

##### 第二週挑戰我未曾使用過的地圖Api，初次嘗試理解地圖的圖層概念，也讓我大吃一驚原來地圖是由類似玻璃紙層層疊加上去而成，在結束這週的挑戰後我對於地圖有了基本的理解可以自行建構屬於自己的地圖，還算蠻有趣的一個體驗，對於下周的全台公車地圖期許自己能夠做出不錯的成果!!!!
