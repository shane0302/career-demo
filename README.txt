銀齡新動力－職業推薦系統（靜態互動網頁原型）
================================================

執行方式
1) 解壓縮後，用 Chrome 開啟 index.html
2) 流程：index → survey → result

特色
- 三頁式流程（更像完整產品）
- 使用 localStorage 保存問卷資料（刷新不會消失）
- Top 3 推薦職業 + 匹配度百分比 + 進度條（含技能維度）
- 每個職業都有「推薦理由卡片」與可行動建議
- 對應 SDG 8（尊嚴工作與經濟成長）

檔案結構
- index.html：首頁
- survey.html：問卷頁
- result.html：結果頁
- styles.css：共用樣式
- js/common.js：資料/模型/工具函式
- js/index.js：首頁行為
- js/survey.js：問卷儲存與導頁
- js/result.js：結果計算與渲染


加分功能
- 使用者可在首頁自取名（稱呼），並以 localStorage 保存，問卷與結果頁會顯示專屬稱呼，提升產品化體驗。


影片教學頁
- video.html：嵌入勞動部官方動畫短片（YouTube），作為第三頁「影片教學」，內容介紹《中高齡者及高齡者就業促進法》與友善職場概念。

- 影片教學頁改為三支影片資源（導向 YouTube 觀看）：故事/技巧/法規與資源。

【DEMO入口】請先開啟 demo.html（或直接開 index.html）開始操作。
