/*
Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var AltGr = { PLAIN: "plain", ALTERNATE: "alternate" };
var Shift = { PLAIN: "plain", SHIFTED: "shifted" };

var contextID = -1;
var altGrState = AltGr.PLAIN;
var shiftState = Shift.PLAIN;
var lastRemappedKeyEvent = undefined;

var lut = {
"Backquote": { "plain": {"plain": "Ᏽ", "shifted": "Ꮚ"}, "alternate": {"plain": "", "shifted":"~"}, "code": "Backquote"},
"Digit1": { "plain": {"plain": "\ᏣᎳᎩ", "shifted": "Ꮁ"}, "alternate": {"plain": "1", "shifted":"!"}, "code": "Digit1"},
"Digit2": { "plain": {"plain": "\ᎣᏏᏲ", "shifted": "Ꮗ"}, "alternate": {"plain": "2", "shifted":"@"}, "code": "Digit2"},
"Digit3": { "plain": {"plain": "\ᏩᏙ", "shifted": "Ꮷ"}, "alternate": {"plain": "3", "shifted":"#"}, "code": "Digit3"},
"Digit4": { "plain": {"plain": "Ꮩ", "shifted": "Ꮀ"}, "alternate": {"plain": "4", "shifted":"$"}, "code": "Digit4"},
"Digit5": { "plain": {"plain": "Ꮶ", "shifted": "Ꮉ"}, "alternate": {"plain": "5", "shifted":"%"}, "code": "Digit5"},
"Digit6": { "plain": {"plain": "Ꮬ", "shifted": "Ꮭ"}, "alternate": {"plain": "6", "shifted":"^"}, "code": "Digit6"},
"Digit7": { "plain": {"plain": "Ꮛ", "shifted": "Ꮱ"}, "alternate": {"plain": "7", "shifted":"&"}, "code": "Digit7"},
"Digit8": { "plain": {"plain": "Ꮦ", "shifted": "Ꮊ"}, "alternate": {"plain": "8", "shifted":"*"}, "code": "Digit8"},
"Digit9": { "plain": {"plain": "Ꮢ", "shifted": "("}, "alternate": {"plain": "9", "shifted":"("}, "code": "Digit9"},
"Digit0": { "plain": {"plain": "Ꮔ", "shifted": ")"}, "alternate": {"plain": "0", "shifted":")"}, "code": "Digit0"},
"Minus": { "plain": {"plain": "Ꮏ", "shifted": "Ꮌ"}, "alternate": {"plain": "-", "shifted":"-"}, "code": "Minus"},
"Equal": { "plain": {"plain": "Ᏻ", "shifted": "Ꮍ"}, "alternate": {"plain": "=", "shifted":"+"}, "code": "Equal"},
"KeyQ": { "plain": {"plain": "Ꭺ", "shifted": "Ꮖ"}, "alternate": {"plain": "q", "shifted":"Q"}, "code": "KeyQ"},
"KeyW": { "plain": {"plain": "Ꮃ", "shifted": "Ꮻ"}, "alternate": {"plain": "w", "shifted":"W"}, "code": "KeyW"},
"KeyE": { "plain": {"plain": "Ꭱ", "shifted": "Ꮳ"}, "alternate": {"plain": "e", "shifted":"E"}, "code": "KeyE"},
"KeyR": { "plain": {"plain": "Ꮫ", "shifted": "Ꮟ"}, "alternate": {"plain": "r", "shifted":"R"}, "code": "KeyR"},
"KeyT": { "plain": {"plain": "Ꮤ", "shifted": "Ꮨ"}, "alternate": {"plain": "t", "shifted":"T"}, "code": "KeyT"},
"KeyY": { "plain": {"plain": "Ꮿ", "shifted": "Ᏺ"}, "alternate": {"plain": "y", "shifted":"Y"}, "code": "KeyY"},
"KeyU": { "plain": {"plain": "Ꭴ", "shifted": "Ꭽ"}, "alternate": {"plain": "u", "shifted":"U"}, "code": "KeyU"},
"KeyI": { "plain": {"plain": "Ꭲ", "shifted": "Ᏹ"}, "alternate": {"plain": "i", "shifted":"I"}, "code": "KeyI"},
"KeyO": { "plain": {"plain": "Ꭳ", "shifted": "Ꮼ"}, "alternate": {"plain": "o", "shifted":"O"}, "code": "KeyO"},
"KeyP": { "plain": {"plain": "Ꮑ", "shifted": "Ꮺ"}, "alternate": {"plain": "p", "shifted":"P"}, "code": "KeyP"},
"BracketLeft": { "plain": {"plain": "Ꮥ", "shifted": "Ꮡ"}, "alternate": {"plain": "[", "shifted":"{"}, "code": "BracketLeft"},
"BracketRight": { "plain": {"plain": "Ꮆ", "shifted": "Ꮴ"}, "alternate": {"plain": "]", "shifted":"}"}, "code": "BracketRight"},
"Backslash": { "plain": {"plain": "Ꮹ", "shifted": "Ꮾ"}, "alternate": {"plain": "", "shifted":"|"}, "code": "Backslash"},
"KeyA": { "plain": {"plain": "Ꭰ", "shifted": "Ꮜ"}, "alternate": {"plain": "a", "shifted":"A"}, "code": "KeyA"},
"KeyS": { "plain": {"plain": "Ꮝ", "shifted": "Ꮞ"}, "alternate": {"plain": "s", "shifted":"S"}, "code": "KeyS"},
"KeyD": { "plain": {"plain": "Ꮧ", "shifted": "Ꮠ"}, "alternate": {"plain": "d", "shifted":"D"}, "code": "KeyD"},
"KeyF": { "plain": {"plain": "Ꭹ", "shifted": "Ꮘ"}, "alternate": {"plain": "f", "shifted":"F"}, "code": "KeyF"},
"KeyG": { "plain": {"plain": "Ꭶ", "shifted": "Ꮵ"}, "alternate": {"plain": "g", "shifted":"G"}, "code": "KeyG"},
"KeyH": { "plain": {"plain": "Ꭿ", "shifted": "Ꮂ"}, "alternate": {"plain": "h", "shifted":"H"}, "code": "KeyH"},
"KeyJ": { "plain": {"plain": "Ꭻ", "shifted": "Ꮪ"}, "alternate": {"plain": "j", "shifted":"J"}, "code": "KeyJ"},
"KeyK": { "plain": {"plain": "Ꮈ", "shifted": "Ꭷ"}, "alternate": {"plain": "k", "shifted":"K"}, "code": "KeyK"},
"KeyL": { "plain": {"plain": "Ꮅ", "shifted": "Ꭾ"}, "alternate": {"plain": "l", "shifted":"L"}, "code": "KeyL"},
"Semicolon": { "plain": {"plain": "Ꮸ", "shifted": "Ꮰ"}, "alternate": {"plain": ";", "shifted":":"}, "code": "Semicolon"},
"Quote": { "plain": {"plain": "'", "shifted": "\""}, "alternate": {"plain": "'", "shifted":"\""}, "code": "Quote"},
"KeyZ": { "plain": {"plain": "Ꭼ", "shifted": "Ꮓ"}, "alternate": {"plain": "z", "shifted":"Z"}, "code": "KeyZ"},
"KeyX": { "plain": {"plain": "Ᏼ", "shifted": "Ꮽ"}, "alternate": {"plain": "x", "shifted":"X"}, "code": "KeyX"},
"KeyC": { "plain": {"plain": "Ꮣ", "shifted": "Ꮯ"}, "alternate": {"plain": "c", "shifted":"C"}, "code": "KeyC"},
"KeyV": { "plain": {"plain": "Ꭵ", "shifted": "Ꮮ"}, "alternate": {"plain": "v", "shifted":"V"}, "code": "KeyV"},
"KeyB": { "plain": {"plain": "Ꭸ", "shifted": "Ᏸ"}, "alternate": {"plain": "b", "shifted":"B"}, "code": "KeyB"},
"KeyN": { "plain": {"plain": "Ꮎ", "shifted": "Ꮋ"}, "alternate": {"plain": "n", "shifted":"N"}, "code": "KeyN"},
"KeyM": { "plain": {"plain": "Ꮕ", "shifted": "Ꮇ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyM"},
"Comma": { "plain": {"plain": ",", "shifted": "Ꮲ"}, "alternate": {"plain": ",", "shifted":"<"}, "code": "Comma"},
"Period": { "plain": {"plain": ".", "shifted": "Ꮄ"}, "alternate": {"plain": ".", "shifted":">"}, "code": "Period"},
"Slash": { "plain": {"plain": "Ꮒ", "shifted": "Ꮙ"}, "alternate": {"plain": "/", "shifted":"?"}, "code": "Slash"},
};
    

chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

function updateAltGrState(keyData) {
  altGrState = (keyData.code == "AltRight") ? ((keyData.type == "keydown") ? AltGr.ALTERNATE : AltGr.PLAIN)
                                              : altGrState;
}

function updateShiftState(keyData) {
  shiftState = ((keyData.shiftKey && !(keyData.capsLock)) || (!(keyData.shiftKey) && keyData.capsLock)) ? 
                 Shift.SHIFTED : Shift.PLAIN;
}

function isPureModifier(keyData) {
  return (keyData.key == "Shift") || (keyData.key == "Ctrl") || (keyData.key == "Alt");
}

function isRemappedEvent(keyData) {
  // hack, should check for a sender ID (to be added to KeyData)
  return lastRemappedKeyEvent != undefined &&
         (lastRemappedKeyEvent.key == keyData.key &&
          lastRemappedKeyEvent.code == keyData.code &&
          lastRemappedKeyEvent.type == keyData.type
         ); // requestID would be different so we are not checking for it  
}


chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;
      
      if (isRemappedEvent(keyData)) {
        lastRemappedKeyEvent = undefined;
        return handled;
      }

      updateAltGrState(keyData);
      updateShiftState(keyData);
                
      if (lut[keyData.code]) {
          var remappedKeyData = keyData;
          remappedKeyData.key = lut[keyData.code][altGrState][shiftState];
          remappedKeyData.code = lut[keyData.code].code;
        
        if (chrome.input.ime.sendKeyEvents != undefined) {
          chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [remappedKeyData]});
          handled = true;
          lastRemappedKeyEvent = remappedKeyData;
        } else if (keyData.type == "keydown" && !isPureModifier(keyData)) {
          chrome.input.ime.commitText({"contextID": contextID, "text": remappedKeyData.key});
          handled = true;
        }
      }
      
      return handled;
});
