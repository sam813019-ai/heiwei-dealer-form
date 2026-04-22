// ════════════════════════════════════════════════════
//  HEIWEI 何謂美 — 經銷商申請 Google Apps Script 後端
//  貼到 Google Apps Script，部署為 Web App 後取得 URL
// ════════════════════════════════════════════════════

const SHEET_ID   = "1QM2YLU0uRGzxmKva9JD_L0ZkFfoSr5TkC_xBUE2Z8C0";
const SHEET_NAME = "工作表1";   // 如果你的分頁名稱不同，請修改這裡

// 欄位標題（第一次執行時會自動建立）
const HEADERS = [
  "提交時間",
  "LINE UID",
  "LINE 顯示名稱",
  "代理姓名 / 公司全銜",
  "身份證字號 / 統一編號",
  "負責人姓名",
  "聯繫電話",
  "電子郵件",
  "公司 / 通訊地址",
  "主要經營平台",
  "平台賣場連結",
  "上級代理 / 貨源 LINE ID",
  "申請人 LINE ID",
];

function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // 建立標題列（若第一列是空的）
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === "") {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold")
           .setBackground("#C4A45A").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // 寫入資料
    sheet.appendRow([
      data.submitted_at      || "",
      data.line_uid          || "",
      data.line_display_name || "",
      data.company_name      || "",
      data.id_number         || "",
      data.owner_name        || "",
      data.phone             || "",
      data.email             || "",
      data.address           || "",
      data.platforms         || "",
      data.platform_links    || "",
      data.upstream_line_id  || "",
      data.applicant_line_id || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 測試用：在 Apps Script 編輯器直接執行這個函式可檢查連線
function testWrite() {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  Logger.log("連線成功，工作表名稱：" + sheet.getName());
  Logger.log("目前資料筆數：" + (sheet.getLastRow() - 1));
}
