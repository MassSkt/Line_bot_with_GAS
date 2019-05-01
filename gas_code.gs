
var CHANNEL_ACCESS_TOKEN = ''; 
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';
var sheet_id = "";
var sheet_name = "Sheet1";//���ۂ̃V�[�g���ɍ��킹�ĉ�����


// ������������LINE�ԐM�p�֐���������������
//�|�X�g�ő����Ă���̂ŁA�����Ă���JSON���p�[�X
function doPost(e) {
  var json = JSON.parse(e.postData.contents);

  //�ԐM���邽�߂̃g�[�N���擾
  var reply_token= json.events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }

  //����ꂽ���b�Z�[�W���e���擾
  var message = json.events[0].message.text;
  //var userId = JSON.parse(e.postData.contents).events[0].source.userId;
  //var username=getUsername(userId);

  //�X�v���b�h�V�[�g�̓��e�ɉ����ă��b�Z�[�W�ɕԐM
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

// �ԐM�e�L�X�g�p�֐�
function GetReply(message){
  Logger.log(message);
  // �V�[�g�̎擾
  var spreadsheet = SpreadsheetApp.openById(sheet_id);
  var sheet = spreadsheet.getSheetByName(sheet_name);
  var lr = sheet.getLastRow();

  // �ݒ�
  var message_col=1;
  var reply_col=2;
  var start_row=2;

  // �ǂݍ���
  var reply_txt="";
  for (var i = start_row; i <= lr+1; i++){
    
    // �Ō�̍s�܂Ō��Ă�������Ȃ��ꍇ
    if (i==lr+1){
      var reply_txt="�킩��܂���"
    }
    
    var temp_txt=sheet.getRange(i,message_col).getValue();   // �l�擾
    Logger.log(temp_txt);
    if (message==temp_txt){
      var reply_txt=sheet.getRange(i,reply_col).getValue(); // �ԐM�l�擾
      break; // for �𔲂���
    }
    
  };
  // ��������
  //sheet.getRange(lr+1,1).setValue(year);

  return reply_txt;
}


// LINE id ���疼�O���擾
function getUsername(userId) {
  var url = 'https://api.line.me/v2/bot/profile/' + userId;
  var response = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    }
  });
  return JSON.parse(response.getContentText()).displayName;
}


//�e�X�g�֐�
function testgetreply(){
  //var ret=GetReply("���悤�Ȃ�");
  var ret=GetReply("�悤�Ȃ�");
  Logger.log(ret);
}
