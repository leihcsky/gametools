;(function () {
  var toggle = document.getElementById('nav-toggle')
  var menuDesktop = document.getElementById('nav-menu')
  var menuMobile = document.getElementById('nav-menu-mobile')
  if (toggle && menuDesktop && menuMobile) {
    toggle.addEventListener('click', function () {
      var isOpen = menuMobile.classList.contains('hidden') === false
      if (isOpen) {
        menuMobile.classList.add('hidden')
      } else {
        menuMobile.classList.remove('hidden')
      }
    })
  }
  var yearEl = document.getElementById('cf-year')
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString()
  }
  var root = document.documentElement
  var storageKey = 'cf-theme'
  var getPreferredTheme = function () {
    var stored = null
    try {
      stored = window.localStorage.getItem(storageKey)
    } catch (e) {}
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }
  var applyTheme = function (theme) {
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    var btns = document.querySelectorAll('.js-theme-toggle')
    btns.forEach(function (btn) {
      btn.setAttribute('data-theme', theme)
      btn.textContent = theme === 'dark' ? 'Dark' : 'Light'
    })
  }
  var activeTheme = getPreferredTheme()
  applyTheme(activeTheme)
  var themeButtons = document.querySelectorAll('.js-theme-toggle')
  themeButtons.forEach(function (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = root.classList.contains('dark') ? 'light' : 'dark'
      applyTheme(next)
      try {
        window.localStorage.setItem(storageKey, next)
      } catch (e) {}
    })
  })
  var homeCta = document.getElementById('home-cta-open-calculator')
  if (homeCta) {
    homeCta.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'cta_click', {
          event_category: 'homepage',
          event_label: 'hero_open_damage_calculator'
        })
      }
    })
  }
})()
