function checkDevice() {
  var ua = navigator.userAgent.toLowerCase();
  var isAndroid = ua.indexOf("android") > -1; 
  var isiOS = /ipad|iphone|ipod/.test(ua) && !window.MSStream;

  var mockups = document.querySelector('.mockups');

  if (mockups) {
    if (window.matchMedia('(max-width: 767px)').matches) {
      if (isAndroid) {
        mockups.classList.add('reverse-order');
      } 
    } else {
      mockups.classList.remove('reverse-order');
    }
  }
}

window.onload = checkDevice;
window.onresize = debounce(checkDevice, 250);

// Debounce function
function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
        timeout = null;
        func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}



// Contact form
function onEmailSuccess(data, textStatus, jqXR) {
  console.log("Success");
  var successMessage = "Success! Your message has been sent. We will get back to you as soon as possible!"; // default message

  if (window.location.pathname.indexOf("/es/") !== -1) { // Spanish version of contact page
    successMessage = "¡Éxito! Su mensaje ha sido enviado. Nos pondremos en contacto con usted lo antes posible!"; // Spanish message
  }
  else if (window.location.pathname.indexOf("/pt/") !== -1) { // Portuguese version of contact page
    successMessage = "Sucesso! Sua mensagem foi enviada. Entraremos em contato com você o mais breve possível!"; // Portuguese message
  }
  else if (window.location.pathname.indexOf("/ru/") !== -1) { 
    successMessage = "Успешно! Ваше сообщение было отправлено. Мы свяжемся с вами как можно скорее!";
  }
  else if (window.location.pathname.indexOf("/tr/") !== -1) { 
    successMessage = "Başarılı! Mesajınız gönderildi. En kısa zamanda size geri dönüş yapacağız!";
  }
  else if (window.location.pathname.indexOf("/id/") !== -1) { 
    successMessage = "Sukses! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda secepat mungkin!";
  }

  $('#contact-feedback').css("color", "green").html(successMessage);
  $('#contact-form').css("display","none");
  $('.contact-heading').css("display","none");
}


function onEmailError(jqXHR, textStatus, errorThrown) {
  console.log("Error");
  $('#contact-feedback').css("color", "red").html("Uh Oh! There was a problem with your request.");
}

$('#contact-button').click(function(event) {
  event.preventDefault(); // Prevent form submission

  var name = $('#contact-name').val();
  var email = $('#contact-email').val();
  var message = $('#contact-message').val();
  var subject = $('#contact-subject').val();
  var data = JSON.stringify({
    name: name,
    email: email,
    message: message,
    subject: subject,
  });

  // Check if any of the fields are empty
  let langCode = "";
  let validationMessage = "";
  
  if (window.location.pathname.indexOf("/es/") !== -1) {
    langCode = "es";
    validationMessage = "¡Vaya! Debe completar todos los campos.";
  } else if (window.location.pathname.indexOf("/pt/") !== -1) {
    langCode = "pt";
    validationMessage = "Oops! Você precisa preencher todos os campos.";
  } else if (window.location.pathname.indexOf("/ru/") !== -1) {
    langCode = "ru";
    validationMessage = "Упс! Вам нужно заполнить все поля.";
  } else if (window.location.pathname.indexOf("/tr/") !== -1) {
    langCode = "tr";
    validationMessage = "Hop! Tüm alanları doldurmanız gerekiyor.";
  } else if (window.location.pathname.indexOf("/id/") !== -1) {
    langCode = "id";
    validationMessage = "Ups! Anda perlu mengisi semua kolom.";
  } else {
    // Default to English
    langCode = "en";
    validationMessage = "Uh Oh! You need to fill in all fields.";
  }
  
  if (name === "" || email === "" || message === "" || subject === "") {
    $('#contact-feedback').css("color", "red").html(validationMessage);
    return;
  }
  

  // Check if email is in correct format
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    var errorMessage = "";
    if (window.location.pathname.indexOf("/es/") !== -1) { // Spanish version of contact page
      errorMessage = "¡Uh Oh! Debe ingresar una dirección de correo electrónico válida.";
    } else if (window.location.pathname.indexOf("/pt/") !== -1) { // Portuguese version of contact page
      errorMessage = "Uh Oh! Você precisa inserir um endereço de e-mail válido.";
    } else if (window.location.pathname.indexOf("/ru/") !== -1) { // Russian version of contact page
      errorMessage = "Упс! Вам нужно ввести действительный адрес электронной почты.";
    } else if (window.location.pathname.indexOf("/tr/") !== -1) { // Turkish version of contact page
      errorMessage = "Uh Oh! Geçerli bir e-posta adresi girmeniz gerekiyor.";
    } else if (window.location.pathname.indexOf("/id/") !== -1) { // Indonesian version of contact page
      errorMessage = "Uh Oh! Anda perlu memasukkan alamat email yang valid.";
    } else { // default to English
      errorMessage = "Uh Oh! You need to enter a valid email address.";
    }
    $('#contact-feedback').css("color", "red").html(errorMessage);
    return;
  }
  

  // Send the form data
  $.ajax({
    type: "POST",
    url: 'https://api.red.wemesh.ca/contact',
    contentType: 'application/json; charset=UTF-8',
    data: data,
    success: onEmailSuccess,
    error: onEmailError,
  });

  // Disable the submit button and show a loading spinner
  $('#contact-button').prop('disabled', true);
  $('#contact-feedback').html('<i class="fa fa-spinner fa-spin"></i> Sending message...');
});


$(document).ready(init);

let videosStarting = false

// Starts the videos in the phone elements
function videoStart($android, $iphone, $mac, $desktop) {
  if (!videosStarting) {
    videosStarting = true
    const startTime = 0
    $iphone.get(0).currentTime = startTime;
    $android.get(0).currentTime = startTime;
    $mac.get(0).currentTime = startTime;
    $desktop.get(0).currentTime = startTime;
    
    setTimeout(function () {
      videosStarting = false

      // $iphone.get(0).play();
      // $android.get(0).play();
      // $mac.get(0).play();
      // $desktop.get(0).play();
    }, 1000);
  }
}


function isWindows() {
  if ( navigator.platform === "Win32" ||
    navigator.platform === "Win64" ||
    navigator.platform === "WOW64" 
  ) {
    return true
  }
  return false
}

function isMac() {
  if ( navigator.platform === "MacIntel" ||
    navigator.platform && navigator.platform.startsWith("Mac")
  ) {
    return true
  }
  return false
}

function isAndroid() {
  if ( navigator.platform === "Android" ) {
    return true
  }
  return false
}

function isIOS() {
  if ( navigator.platform === "iPhone" ||
    navigator.platform === "iPod" ||
    navigator.platform === "iPad" 
  ) {
    return true
  }
  return false
}

function identifyPlatform() {
  if (isAndroid()) {
    return "Android"
  }
  if (isIOS()) {
    return "iOS"
  }
  if (isMac()) {
    return "Mac"
  }
  if (isWindows()) {
    return "Windows"
  }
  return "Windows"
}

function identifyArch () {
  // from: https://github.com/feross/arch/blob/master/browser.js

  /**
   * User agent strings that indicate a 64-bit OS.
   * See: http://stackoverflow.com/a/13709431/292185
   */
  var userAgent = navigator.userAgent
  if ([
    'x86_64',
    'x86-64',
    'Win64',
    'x64;',
    'amd64',
    'AMD64',
    'WOW64',
    'x64_64'
  ].some(function (str) {
    return userAgent.indexOf(str) > -1
  })) {
    return 'x64'
  }

  /**
   * Platform strings that indicate a 64-bit OS.
   * See: http://stackoverflow.com/a/19883965/292185
   */
  var platform = navigator.platform
  if (platform === 'MacIntel' || platform === 'Linux x86_64') {
    return 'x64'
  }

  /**
   * CPU class strings that indicate a 64-bit OS.
   * See: http://stackoverflow.com/a/6267019/292185
   */
  if (navigator.cpuClass === 'x64') {
    return 'x64'
  }

  /**
   * If none of the above, assume the architecture is 32-bit.
   */
  return 'x86'
}

function downloadRave(event, platform = identifyPlatform(), arch = identifyArch()) {
  event.preventDefault()
  // document.getElementsByTagName('button')[0].innerText = platform
  let downloadLink = "https://app.rave-web.com/windows"
  switch (platform) {
    case "Android":
      downloadLink = "https://play.google.com/store/apps/details?id=com.wemesh.android"
      break;
  
    case "iOS":
      downloadLink = "https://apps.apple.com/us/app/rave-watch-party/id929775122"
      break;
  
    case "Mac":
      downloadLink = "https://app.rave-web.com/mac"
      break;
  
    case "Windows":
      if ( arch === "x64" ) {
        downloadLink = "https://app.rave-web.com/windows"
      } else if ( arch === "x86" ) {
        downloadLink = "https://app.rave-web.com/windows-32bit"
      }
      break;
  
    default:
      break;
  }

  // if ( platform === "Windows") {
  //   if (identifyArch() === "x64") {
  //     platform += " 64bit"
  //   } else {
  //     platform += " 32bit"
  //   }
  // }
  window.location = downloadLink
  console.log(`nav`, platform, arch, downloadLink)
}

function isIphone() {
  return false
  return /iPad|iPhone|iPod/.test(navigator.platform);
}

function init() {
  /*
    Phone Video Sync Management
    */
  var $android = $("#android video"),
    $iphone = $("#iphone video"),
    $mac = $("#mac video"),
    $desktop = $("#desktop video"),
  
    elemsReady = 0,
    needReady = 4;



  // If the video is in the cache of the browser,
  // the 'canplaythrough' event might have been triggered
  // before we registered the event handler.
  if ($android.get(0).readyState > 3 ) {
    elemsReady++;
  } else {
    $android.one('canplay', function () {
      elemsReady++;

      if (elemsReady == needReady) {
        elemsReady = 0;
        videoStart($android, $iphone, $mac, $desktop/*, $vrvid*/);
      }
    });
  }
  
  if ($iphone.get(0).readyState > 3 ) {
    elemsReady++;
  } else {
    $iphone.one('canplay', function () {
      elemsReady++;

      if (elemsReady == needReady) {
        elemsReady = 0;
        videoStart($android, $iphone, $mac, $desktop/*, $vrvid*/);
      }
    });
  }
  
  if ($mac.get(0).readyState > 3 ) {
    elemsReady++;
  } else {
    $mac.one('canplay', function () {
      elemsReady++;

      if (elemsReady == needReady) {
        elemsReady = 0;
        videoStart($android, $iphone, $mac, $desktop/*, $vrvid*/);
      }
    });
  }
  
  if ($desktop.get(0).readyState > 3 ) {
    elemsReady++;
  } else {
    $desktop.one('canplay', function () {
      elemsReady++;

      if (elemsReady == needReady) {
        elemsReady = 0;
        videoStart($android, $iphone, $mac, $desktop/*, $vrvid*/);
      }
    });
  }

  if (elemsReady == needReady) {
    elemsReady = 0;
    videoStart($android, $iphone, $mac, $desktop/*, $vrvid*/);
  }

  // $bgvid.on('canplay', function () {
  //   $bgvid.get(0).play();
  // });

  // $bgvid.on('ended', function () {
  //   $bgvid.get(0).play();
  // });

  // $djvid.on('canplay', function () {
  // $djvid.get(0).play();
  // });

  // $djvid.on('ended', function () {
  // $djvid.get(0).play();
  // });

  // These event listeners are used to sync video looping.
  $android.on('timeupdate', function (event) {
    if ( !videosStarting && event.target.currentTime < 0.5 ) {
      videoStart($android, $iphone, $mac, $desktop/*, $vrvid*/);
    }
  });

  $iphone.on('timeupdate', function (event) {
    if ( !videosStarting && event.target.currentTime < 0.5 ) {
      console.log(`iphone start!`)
      videoStart($android, $iphone, $mac, $desktop/*, $vrvid*/);
    }
  });

  $mac.on('timeupdate', function (event) {
    if ( !videosStarting && event.target.currentTime < 0.5 ) {
      console.log(`mac start!`)
      videoStart($android, $iphone, $mac, $desktop/*, $vrvid*/);
    }
  });

  $desktop.on('timeupdate', function (event) {
    if ( !videosStarting && event.target.currentTime < 0.5 ) {
      console.log(`desktop start!`)
      videoStart($android, $iphone, $mac, $desktop/*, $vrvid*/);
    }
  });

}


// FAQ

let question = document.querySelectorAll(".question");

question.forEach(question => {
  question.addEventListener("click", event => {
    const active = document.querySelector(".question.active");
    if(active && active !== question ) {
      active.classList.toggle("active");
      active.nextElementSibling.style.maxHeight = 0;
    }
    question.classList.toggle("active");
    const answer = question.nextElementSibling;
    if(question.classList.contains("active")){
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = 0;
    }
  })
})

// Langauge Selector

document.getElementById('selectedLanguage').addEventListener('click', function (event) {
  var options = document.getElementById('languageOptions');
  if (options.classList.contains('hidden')) {
      options.classList.remove('hidden');
  } else {
      options.classList.add('hidden');
  }
  event.stopPropagation(); 
});

var languageOptions = document.querySelectorAll('#languageOptions li');
languageOptions.forEach(function(option) {
  option.addEventListener('click', function (event) {
      var lang = this.getAttribute('data-value');
      document.getElementById('selectedLanguage').textContent = this.textContent;
      document.getElementById('languageOptions').classList.add('hidden');

      var urlParts = window.location.pathname.split('/').filter(function(part) {
          return part !== '';
      });
      if (lang === 'en') {
          if (['en', 'ru', 'id', 'tr', 'es', 'pt'].includes(urlParts[0])) {
              urlParts.splice(0, 1);
          }
      } else {
          if (['en', 'ru', 'id', 'tr', 'es', 'pt'].includes(urlParts[0])) {
              urlParts[0] = lang;
          } else {
              urlParts.unshift(lang);
          }
      }
      window.location.href = window.location.origin + '/' + urlParts.join('/');
      event.stopPropagation(); 
  });
});

document.addEventListener('click', function (event) {
  var langSelector = document.getElementById('lang-selector');
  var isClickInside = langSelector.contains(event.target);

  if (!isClickInside) {
      var options = document.getElementById('languageOptions');
      options.classList.add('hidden');
  }
});

function getCurrentLanguage() {
  var urlParts = window.location.pathname.split('/').filter(function(part) {
      return part !== '';
  });
  var lang = urlParts[0];
  var languageList = ['en', 'ru', 'id', 'tr', 'es', 'pt'];
  return languageList.includes(lang) ? lang : 'en';
}

function getLanguageName(code) {
  var languageNames = {
      'en': 'English',
      'ru': 'Русский',
      'id': 'Indonesia',
      'tr': 'Türkçe',
      'es': 'Español',
      'pt': 'Português',
  };
  return languageNames[code];
}

var currentLanguage = getCurrentLanguage();
var currentLanguageName = getLanguageName(currentLanguage);
document.getElementById('selectedLanguage').textContent = currentLanguageName;

function hideCurrentLanguage() {
    var languageOptions = document.querySelectorAll('#languageOptions li');
    languageOptions.forEach(function(option) {
        if (option.getAttribute('data-value') === currentLanguage) {
            option.style.display = 'none';
        } else {
            option.style.display = '';
        }
    });
}

hideCurrentLanguage();

var languageOptions = document.querySelectorAll('#languageOptions li');
languageOptions.forEach(function(option) {
  option.addEventListener('click', function (event) {
      currentLanguage = this.getAttribute('data-value');
      currentLanguageName = getLanguageName(currentLanguage);
      document.getElementById('selectedLanguage').textContent = currentLanguageName;
      document.getElementById('languageOptions').classList.add('hidden');

      hideCurrentLanguage(); 
    
  });
});

var currentLanguage = getCurrentLanguage();
var currentLanguageName = getLanguageName(currentLanguage);
document.getElementById('selectedLanguage').textContent = currentLanguageName;
document.getElementById('lang-selector').style.visibility = 'visible';

