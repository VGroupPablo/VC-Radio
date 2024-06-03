
let RadioStates = {
    PowerState: false,
    Channel: 1,
    Volume: 0,
    UsingKeyboard: false,
    UsingShortCut: false,
    KeyboardChannel: "",
    RestrictedAres: false
}
$(function () {
    // Lua to JS events
  window.addEventListener("message", function (event) {
    if (event.data.action == "showhideRadio") {
      console.log(event.data, event.data.value)
        switchRadio(event.data, event.data.value)
    } 
  });
    // JS events on click
    window.addEventListener("keydown", function (event) {
      switch (event.key) {
        case "ArrowDown":
          // Do something for "down arrow" key press.
          break;
        case "ArrowUp":
          // Do something for "up arrow" key press.
          break;
        case "ArrowLeft":
          // Do something for "left arrow" key press.
          break;
        case "ArrowRight":
          // Do something for "right arrow" key press.
          break;
        case "Enter":
          // Do something for "enter" or "return" key press.
          break;
        case " ":
          // Do something for "space" key press.
          break;
        case "Backspace":
          switchRadio(event.data, false)
          // playSound(`turnoff`)
          $.post(`https://${GetParentResourceName()}/hideRadio`);
          break;
        default:
          return; // Quit when this doesn't handle the key event.
      }
      // JS events on click button
      window.onclick = function(event) {
        // if (event.target == document.getElementById('submit')) {
        //   modal.style.display = "none";
        // }
      }
	});
});

function switchRadio (data, action) {
    let ui = document.body
    if (action === true) {
      RadioStates.RestrictedAres = data.restricted
      $(ui).show();
    } else {
      $(ui).hide();
    }
  }

function ButtonClicked (data) {
    let random = Math.floor(Math.random() * 7) + 1
    let clickSound = `click_` + random
    playSound(clickSound)
    switch (data.id) {
        case "firstscrollr":
            if (RadioStates.PowerState === false) {
                RadioStates.PowerState = true
                $( ".contacts" ).text(translate.Contacts);
                $( ".zones" ).text(translate.Zones);
                RadioStates.Volume = 10
                $( ".activescreen" ).css({transition: 'opacity 1s ease-in-out',"opacity": "1" });
                $( ".screen" ).css({transition: 'background-color 1s ease-in-out',"background-color": "rgb(200 200 200)" });
                playSound(`power_on`)

              } else if (RadioStates.PowerState === true && RadioStates.Volume <= 90 && !RadioStates.UsingKeyboard && !RadioStates.UsingShortCut) {
              RadioStates.Volume = RadioStates.Volume + 10
                changeVolume(true)
            }
        break;
        case "firstscrolll":
            if (RadioStates.PowerState === true && RadioStates.Volume == 10 && !RadioStates.UsingKeyboard && !RadioStates.UsingShortCut) {
                RadioStates.PowerState = false
                RadioStates.Volume = 0
                $( ".screen" ).css({transition: 'background-color 1s ease-in-out',"background-color": "rgb(22	25	27)" });
                $( ".activescreen" ).css({transition: 'opacity 1s ease-in-out',"opacity": "0" });
                $( ".activescreen" ).css("display", "flex")
                $( ".notifyvolume" ).css("display", "none")
                $('#volume').empty()
                RadioStates.UsingKeyboard = false
                RadioStates.UsingShortCut = false
                $.post(`https://${GetParentResourceName()}/ChangeRadioVolume`, JSON.stringify({ volume: RadioStates.Volume}));        

              } else if (RadioStates.PowerState === true && !RadioStates.UsingKeyboard && !RadioStates.UsingShortCut) {
                RadioStates.Volume = RadioStates.Volume - 10
                changeVolume(false)
            }
        break;

        case "scrollrightl":
            if (RadioStates.PowerState === true && RadioStates.Channel >= 2 && !RadioStates.UsingKeyboard && !RadioStates.UsingShortCut) {
                RadioStates.Channel = RadioStates.Channel - 1
                $( ".channel" ).text(translate.Channel + " " + RadioStates.Channel);
                ChangeChannel()
              } 
        break;
        case "scrollrightr":
            if (RadioStates.PowerState === true && RadioStates.Channel <= 998 && !RadioStates.UsingKeyboard && !RadioStates.UsingShortCut) {
                RadioStates.Channel = Number(RadioStates.Channel) + 1
                $( ".channel" ).text(translate.Channel + " " + RadioStates.Channel);
                ChangeChannel()
              } 
        break;

        case "buttonok":
          if (RadioStates.PowerState === true && !RadioStates.UsingKeyboard && !RadioStates.UsingShortCut) {
            if (RadioStates.Channel >= 100 && RadioStates.RestrictedAres) {
              playSound('function')
              $.post(`https://${GetParentResourceName()}/tryJoinThisChannel`, JSON.stringify({ channelid: RadioStates.Channel}));        
            } else if (RadioStates.Channel >= 100 && !RadioStates.RestrictedAres) {
            } else {
              playSound('function')
              $.post(`https://${GetParentResourceName()}/tryJoinThisChannel`, JSON.stringify({ channelid: RadioStates.Channel}));        

            }
          } 
        break;
        case "buttonhome":
            if (RadioStates.PowerState === true && !RadioStates.UsingShortCut) {
              playSound('function')
              StartChoosingChannelByNumbers()
            } 
        break;

        case "buttonp1":
          if (RadioStates.PowerState === true && !RadioStates.UsingKeyboard) {
            playSound('function')
            StartChoosingChannelByShortcut()
          } 
        break;
        // case "buttonp2":
        //   if (RadioStates.PowerState === true) {
        //     playSound('function')
        //     StartChoosingChannelByNumbers()
        //   } 
        // break;

        case "button0":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(0)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(0)
          }
        break;
        case "button1":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(1)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(1)
          }
        break;
        case "button2":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(2)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(2)
          }
        break;
        case "button3":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(3)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(3)
          }
        break;
        case "button4":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(4)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(4)
          }
        break;
        case "button5":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(5)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(5)
          }
        break;
        case "button6":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(6)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(6)
          }
        break;
        case "button7":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(7)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(7)
          }
        break;
        case "button8":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(8)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(8)
          }
        break;
        case "button9":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength(9)
          } else if (RadioStates.PowerState === true && RadioStates.UsingShortCut) {
            playSound('function')
            selectChannelFromShortcut(9)
          }
        break;
        case "buttonstar":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength("star")
          } 
        break;
        case "buttonhashtag":
          if (RadioStates.PowerState === true && RadioStates.UsingKeyboard) {
            playSound('function')
            addToChannelLength("hashtag")
          } 
        break;
    }
}

function playSound (soundSource) {
    let sound = new Audio()
    sound.src = `sfx/` + soundSource + `.ogg`
	  sound.play();
}

function changeVolume (action) {
  $( ".activescreen" ).css("display", "none")
  $( ".notifyvolume" ).css("display", "flex")
  var text = $('#volume').text()
  if (action === false) {
    $('#volume').text(text.substring(0, text.length - 1))
  } else {
    $('#volume').text(text + "I")
  }
  if (text.length != RadioStates.Volume/10) {
    $('#volume').empty()
    var NewContent = ""
    for (let i = 0; i < RadioStates.Volume/10; i++) {
      NewContent += "I";
    } 
    $('#volume').text(NewContent)
  }
  $.post(`https://${GetParentResourceName()}/ChangeRadioVolume`, JSON.stringify({ volume: RadioStates.Volume}));
  var Now = RadioStates.Volume
  setTimeout(
    function() 
    {
      if (Now == RadioStates.Volume) {
        $( ".activescreen" ).css("display", "flex")
        $( ".notifyvolume" ).css("display", "none")
      }
    }, 1000);
}

function ChangeChannel () {
  var channelName = ChannelNames[RadioStates.Channel]
  if (channelName === undefined) {
    $('#channelname').empty()
  } else {
    $('#channelname').text(channelName)
  }
}


function StartChoosingChannelByNumbers() {
  if (RadioStates.UsingKeyboard) {
    if (RadioStates.KeyboardChannel == "") {
      RadioStates.Channel = 1
      $( ".channel" ).text(translate.Channel + " " + RadioStates.Channel);
    }
    RadioStates.UsingKeyboard = false
  } else {
    RadioStates.UsingKeyboard = true
  }
}

function StartChoosingChannelByShortcut() {
  if (RadioStates.UsingShortCut) {
    RadioStates.UsingShortCut = false
  } else {
    RadioStates.UsingShortCut = true
  }
}

function addToChannelLength(button) {
  KeyboardChannel = RadioStates.KeyboardChannel
  if (KeyboardChannel != RadioStates.Channel) { KeyboardChannel = RadioStates.Channel + ""}
  if (button == "star") {
    if (KeyboardChannel.length >= 2) {
      KeyboardChannel = KeyboardChannel.substring(0, KeyboardChannel.length - 1);
    } else {
      KeyboardChannel = ""
    }
  } else if (button == "hashtag") {
      KeyboardChannel = ""
  } else if (KeyboardChannel.length <= 2) {
    KeyboardChannel = KeyboardChannel + button
  }
  RadioStates.Channel = KeyboardChannel
  RadioStates.KeyboardChannel = KeyboardChannel
  $( ".channel" ).text(translate.Channel + " " + RadioStates.Channel);
  ChangeChannel()
}

function selectChannelFromShortcut(button) {
  if (button == "star") {
  } else if (button == "hashtag") {
  } else {
    RadioStates.Channel = ChannelShortCuts[button]
  }
  
  $( ".channel" ).text(translate.Channel + " " + RadioStates.Channel);
  ChangeChannel()
}