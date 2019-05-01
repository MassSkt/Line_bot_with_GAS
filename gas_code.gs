
var CHANNEL_ACCESS_TOKEN = ''; 
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';
var sheet_id = "";
var sheet_name = "Sheet1";//実際のシート名に合わせて下さい


// ＊＊＊＊＊＊LINE返信用関数部分＊＊＊＊＊
//ポストで送られてくるので、送られてきたJSONをパース
function doPost(e) {
  var json = JSON.parse(e.postData.contents);

  //返信するためのトークン取得
  var reply_token= json.events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }

  //送られたメッセージ内容を取得
  var message = json.events[0].message.text;
  //var userId = JSON.parse(e.postData.contents).events[0].source.userId;
  //var username=getUsername(userId);

  //スプレッドシートの内容に応じてメッセージに返信
  var reply_txt=GetReply(message);

  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': [{
        'type': 'text',
        'text': reply_txt,
      }],
    }),
  });
  

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

// 返信テキスト用関数
function GetReply(message){
  Logger.log(message);
  // シートの取得
  var spreadsheet = SpreadsheetApp.openById(sheet_id);
  var sheet = spreadsheet.getSheetByName(sheet_name);
  var lr = sheet.getLastRow();

  // 設定
  var message_col=1;
  var reply_col=2;
  var start_row=2;

  // 読み込み
  var reply_txt="";
  for (var i = start_row; i <= lr+1; i++){
    
    // 最後の行まで見ても見つからない場合
    if (i==lr+1){
      var reply_txt="わかりません"
    }
    
    var temp_txt=sheet.getRange(i,message_col).getValue();   // 値取得
    Logger.log(temp_txt);
    if (message==temp_txt){
      var reply_txt=sheet.getRange(i,reply_col).getValue(); // 返信値取得
      break; // for を抜ける
    }
    
  };
  // 書き込み
  //sheet.getRange(lr+1,1).setValue(year);

  return reply_txt;
}


// LINE id から名前を取得
function getUsername(userId) {
  var url = 'https://api.line.me/v2/bot/profile/' + userId;
  var response = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    }
  });
  return JSON.parse(response.getContentText()).displayName;
}


//テスト関数
function testgetreply(){
  //var ret=GetReply("さようなら");
  var ret=GetReply("ようなら");
  Logger.log(ret);
}
