;(function () {
  var form = document.getElementById('damage-form')
  var editionEl = document.getElementById('edition')
  // Difficulty is not used for player output damage
  // var difficultyEl = document.getElementById('difficulty')
  var weaponPresetEl = document.getElementById('weapon-preset')
  var baseDamageEl = document.getElementById('base-damage')
  var sharpnessEl = document.getElementById('sharpness')
  var criticalEl = document.getElementById('critical')
  var strengthEl = document.getElementById('strength')
  var armorEl = document.getElementById('armor')
  var toughnessEl = document.getElementById('toughness')
  var toughnessContainer = document.getElementById('toughness-container')
  var armorValueEl = document.getElementById('armor-value')
  var resultDamageEl = document.getElementById('result-damage')
  var resultHeartsEl = document.getElementById('result-hearts')
  var resultHitsEl = document.getElementById('result-hits')
  var resultRawEl = document.getElementById('result-raw')
  var resultReductionEl = document.getElementById('result-reduction')
  var resultContextEl = document.getElementById('result-context')
  var resultNoteEl = document.getElementById('result-note')
  var resultTagsEl = document.getElementById('result-tags')
  var prevContainerEl = document.getElementById('previous-result')
  var prevContextEl = document.getElementById('prev-context')
  var prevDamageEl = document.getElementById('prev-damage')
  var prevHeartsEl = document.getElementById('prev-hearts')
  var prevHitsEl = document.getElementById('prev-hits')
  var copyResultBtn = document.getElementById('copy-result')
  var resetButton = document.getElementById('reset-button')

  var lastSnapshot = null
  var currentSnapshot = null

  if (armorEl && armorValueEl) {
    var updateArmorLabel = function () {
      armorValueEl.textContent = 'Armor: ' + armorEl.value
    }
    armorEl.addEventListener('input', updateArmorLabel)
    updateArmorLabel()
  }

  // Preset weapon damage values (Java / Bedrock mixed approximation or standard values)
  // Reference: https://minecraft.wiki/w/Sword#Damage
  var weaponPresets = {
    'custom': 0,
    'netherite_sword': 8,
    'diamond_sword': 7,
    'iron_sword': 6,
    'stone_sword': 5,
    'wood_gold_sword': 4,
    'netherite_axe': 10, // Java
    'diamond_axe': 9,    // Java
    'iron_axe': 9,       // Java
    'trident': 9,
    'mace_smash': 50     // Example high value
  }

  if (weaponPresetEl && baseDamageEl) {
    weaponPresetEl.addEventListener('change', function() {
      var val = weaponPresetEl.value
      if (val !== 'custom' && weaponPresets[val] !== undefined) {
        baseDamageEl.value = weaponPresets[val]
        performCalculation()
      }
    })
    
    // If user changes base damage manually, set preset to custom
    baseDamageEl.addEventListener('input', function() {
       weaponPresetEl.value = 'custom'
    })
  }

  if (editionEl) {
    editionEl.addEventListener('change', function() {
      // Toggle toughness visibility
      if (toughnessContainer) {
        if (editionEl.value === 'bedrock') {
          toughnessContainer.classList.add('hidden')
        } else {
          toughnessContainer.classList.remove('hidden')
        }
      }
      performCalculation()
    })
  }

  var formatNumber = function (value, digits) {
    return Number(value.toFixed(digits))
  }

  var applyStrengthBonus = function (edition, raw, strengthLevel) {
    if (strengthLevel <= 0) return raw
    var level = strengthLevel
    if (edition === 'java') {
      return raw + 3 * level
    }
    var multiplier = Math.pow(1.3, level)
    var flatBonus = (multiplier - 1) / 0.3
    return raw * multiplier + flatBonus
  }

  var calculateJavaDamage = function (base, sharpness, critical, strength, armor, toughness) {
    var damage = applyStrengthBonus('java', base, strength)
    if (sharpness > 0) {
      damage += 0.5 * sharpness + 0.5
    }
    if (critical) {
      var baseWithStrength = applyStrengthBonus('java', base, strength)
      var critDamage = baseWithStrength * 1.5
      var sharpnessBonus = 0
      if (sharpness > 0) {
        sharpnessBonus = 0.5 * sharpness + 0.5
      }
      damage = critDamage + sharpnessBonus
    }
    var defense = armor - damage / (2 + toughness / 4)
    var minDefense = armor / 5
    var effectiveDefense = Math.max(minDefense, defense)
    effectiveDefense = Math.min(20, effectiveDefense)
    var reduction = effectiveDefense / 25
    var finalDamage = damage * (1 - reduction)
    if (finalDamage < 0) finalDamage = 0
    return {
      rawBeforeArmor: damage,
      finalDamage: finalDamage,
      reductionRatio: reduction
    }
  }

  var calculateBedrockDamage = function (base, sharpness, critical, strength, armor) {
    var damage = applyStrengthBonus('bedrock', base, strength)
    if (sharpness > 0) {
      damage += 1.25 * sharpness
    }
    if (critical) {
      damage = damage * 1.5
    }
    var reduction = 0.04 * armor
    if (reduction > 0.8) reduction = 0.8
    if (reduction < 0) reduction = 0
    var finalDamage = damage * (1 - reduction)
    if (finalDamage < 0) finalDamage = 0
    return {
      rawBeforeArmor: damage,
      finalDamage: finalDamage,
      reductionRatio: reduction
    }
  }

  var updateNote = function (edition) {
    if (!resultNoteEl) return
    if (edition === 'java') {
      resultNoteEl.innerHTML =
        'Calculations use <a href="https://minecraft.wiki/w/Damage#Java_Edition" target="_blank" rel="noopener" class="font-medium text-cf-primary hover:text-sky-600 hover:underline">official Java Edition formulas</a> (Wiki, Minecraft Java 1.20+ combat) for Sharpness, Strength, Critical hits, and Armor/Toughness reduction.<br><span class="opacity-75">Order: (Base + Strength) × 1.5 (if Crit) + Sharpness → Armor Reduction</span>'
    } else {
      resultNoteEl.innerHTML =
        'Calculations use <a href="https://minecraft.wiki/w/Damage#Bedrock_Edition" target="_blank" rel="noopener" class="font-medium text-cf-primary hover:text-sky-600 hover:underline">Bedrock Edition formulas</a> (current Bedrock combat): Strength (1.3^lvl scaling), Sharpness (+1.25/lvl) and standard flat armor reduction (4% per point).<br><span class="opacity-75">Bedrock armor mechanics do not use Toughness for damage reduction.</span>'
    }
  }

  var parseInitialFromQuery = function () {
    if (typeof window === 'undefined') return
    if (!window.location || !window.location.search) return
    var params = new URLSearchParams(window.location.search)
    if (editionEl && params.get('edition')) {
      editionEl.value = params.get('edition')
    }
    if (weaponPresetEl && params.get('weapon') && weaponPresets[params.get('weapon')] !== undefined) {
      weaponPresetEl.value = params.get('weapon')
      baseDamageEl.value = String(weaponPresets[weaponPresetEl.value])
    }
    if (baseDamageEl && params.get('base')) {
      baseDamageEl.value = params.get('base')
    }
    if (sharpnessEl && params.get('sharpness')) {
      sharpnessEl.value = params.get('sharpness')
    }
    if (criticalEl && params.get('crit')) {
      criticalEl.checked = params.get('crit') === '1'
    }
    if (strengthEl && params.get('strength')) {
      strengthEl.value = params.get('strength')
    }
    if (armorEl && params.get('armor')) {
      armorEl.value = params.get('armor')
      if (armorValueEl) {
        armorValueEl.textContent = 'Armor: ' + armorEl.value
      }
    }
    if (toughnessEl && params.get('toughness')) {
      toughnessEl.value = params.get('toughness')
    }
  }

  var buildResultSummary = function (snapshot, url) {
    if (!snapshot) return ''
    var editionLabel = snapshot.edition === 'java' ? 'Java' : 'Bedrock'
    var critLabel = snapshot.critical ? 'Yes' : 'No'
    var lines = []
    lines.push('Minecraft Damage Calculation (' + editionLabel + ')')
    lines.push('Base damage: ' + snapshot.base)
    lines.push('Sharpness: ' + snapshot.sharpness)
    lines.push('Critical hit: ' + critLabel)
    lines.push('Strength level: ' + snapshot.strength)
    lines.push('Armor points: ' + snapshot.armor)
    if (snapshot.edition === 'java') {
      lines.push('Armor toughness: ' + snapshot.toughness)
    }
    lines.push('Final damage: ' + formatNumber(snapshot.finalDamage, 2) + ' HP (' + formatNumber(snapshot.hearts, 2) + ' hearts)')
    lines.push('Hits to kill 20 HP: ' + snapshot.hits)
    lines.push('Damage reduction from armor: ' + formatNumber(snapshot.reductionRatio * 100, 1) + '%')
    if (url) {
      lines.push('Link: ' + url)
    }
    return lines.join('\n')
  }

  var updateUrlFromState = function (edition, base, sharpness, critical, strength, armor, toughness) {
    if (typeof window === 'undefined') return
    if (!window.history || !window.location) return
    var params = new URLSearchParams()
    params.set('edition', edition)
    params.set('base', String(base))
    params.set('sharpness', String(sharpness))
    params.set('crit', critical ? '1' : '0')
    params.set('strength', String(strength))
    params.set('armor', String(armor))
    if (edition === 'java') {
      params.set('toughness', String(toughness))
    }
    if (weaponPresetEl && weaponPresetEl.value && weaponPresetEl.value !== 'custom') {
      params.set('weapon', weaponPresetEl.value)
    }
    var newUrl = window.location.pathname + '?' + params.toString()
    window.history.replaceState(null, '', newUrl)
  }

  var updatePreviousDisplay = function () {
    if (!prevContainerEl || !prevDamageEl || !prevHeartsEl || !prevHitsEl || !prevContextEl) return
    if (!lastSnapshot) return
    prevContainerEl.classList.remove('hidden')
    prevDamageEl.textContent = 'Damage: ' + formatNumber(lastSnapshot.finalDamage, 2) + ' HP'
    prevHeartsEl.textContent = 'Hearts: ' + formatNumber(lastSnapshot.hearts, 2)
    prevHitsEl.textContent = 'Hits: ' + lastSnapshot.hits
    var prevEditionLabel = lastSnapshot.edition === 'java' ? 'Java' : 'Bedrock'
    prevContextEl.textContent = prevEditionLabel
  }

  var updateExplanationTags = function (edition, hearts, hits, reductionRatio) {
    if (!resultTagsEl) return
    var editionLabel = edition === 'java' ? 'Java' : 'Bedrock'
    var message = editionLabel + ' melee: ' + formatNumber(hearts * 2, 2) + ' HP per hit, ' + hits + ' hits to defeat 20 HP. Armor blocks ' + formatNumber(reductionRatio * 100, 1) + '% of damage.'
    resultTagsEl.textContent = message
  }

  var trackCalculatorEvent = function (name, params) {
    if (typeof gtag !== 'function') return
    gtag('event', name, params || {})
  }

  var performCalculation = function () {
    if (
      !editionEl ||
      !baseDamageEl ||
      !sharpnessEl ||
      !criticalEl ||
      !strengthEl ||
      !armorEl ||
      !toughnessEl ||
      !resultDamageEl
    ) {
      return
    }

    var edition = editionEl.value
    var base = parseFloat(baseDamageEl.value || '0')
    var sharpness = parseInt(sharpnessEl.value || '0', 10)
    var critical = criticalEl.checked
    var strength = parseInt(strengthEl.value || '0', 10)
    var armor = parseInt(armorEl.value || '0', 10)
    var toughness = parseFloat(toughnessEl.value || '0')

    if (base < 0) base = 0
    if (sharpness < 0) sharpness = 0
    if (strength < 0) strength = 0
    if (armor < 0) armor = 0
    if (toughness < 0) toughness = 0

    if (currentSnapshot) {
      lastSnapshot = currentSnapshot
    }

    var result
    if (edition === 'java') {
      result = calculateJavaDamage(base, sharpness, critical, strength, armor, toughness)
    } else {
      result = calculateBedrockDamage(base, sharpness, critical, strength, armor)
    }

    var finalDamage = result.finalDamage
    var raw = result.rawBeforeArmor
    var reductionRatio = result.reductionRatio
    var hearts = finalDamage / 2
    var hits = finalDamage > 0 ? Math.ceil(20 / finalDamage) : 0

    resultDamageEl.textContent = formatNumber(finalDamage, 2).toString()
    resultHeartsEl.textContent = formatNumber(hearts, 2).toString()
    resultHitsEl.textContent = hits.toString()
    resultRawEl.textContent = formatNumber(raw, 2).toString() + ' HP'
    resultReductionEl.textContent = formatNumber(reductionRatio * 100, 1).toString() + '%'
    
    var editionLabel = edition === 'java' ? 'Java' : 'Bedrock'
    resultContextEl.textContent = editionLabel
    
    currentSnapshot = {
      edition: edition,
      base: base,
      sharpness: sharpness,
      critical: critical,
      strength: strength,
      armor: armor,
      toughness: toughness,
      finalDamage: finalDamage,
      hearts: hearts,
      hits: hits,
      reductionRatio: reductionRatio
    }

    if (lastSnapshot) {
      updatePreviousDisplay()
    }

    updateExplanationTags(edition, hearts, hits, reductionRatio)
    updateUrlFromState(edition, base, sharpness, critical, strength, armor, toughness)
    updateNote(edition)
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault()
      performCalculation()
      if (currentSnapshot) {
        var editionLabel = currentSnapshot.edition === 'java' ? 'java' : 'bedrock'
        var weapon = weaponPresetEl && weaponPresetEl.value ? weaponPresetEl.value : 'custom'
        trackCalculatorEvent('calculate_damage', {
          event_category: 'calculator',
          event_label: editionLabel,
          weapon_preset: weapon,
          final_damage: currentSnapshot.finalDamage,
          hearts: currentSnapshot.hearts,
          hits: currentSnapshot.hits
        })
      }
    })
    
    // Add live update listeners
    var inputs = form.querySelectorAll('input, select')
    inputs.forEach(function(input) {
      if (input.type === 'range' || input.type === 'checkbox' || input.tagName === 'SELECT') {
         input.addEventListener('change', performCalculation)
      } else {
         input.addEventListener('input', performCalculation)
      }
    })
  }

  if (copyResultBtn) {
    copyResultBtn.addEventListener('click', function () {
      if (!currentSnapshot) return
      var shareUrl = null
      if (typeof window !== 'undefined' && window.location) {
        shareUrl = window.location.href
      }
      var text = buildResultSummary(currentSnapshot, shareUrl)
      if (!text) return
      var onSuccess = function () {
        copyResultBtn.textContent = 'Copied'
        if (currentSnapshot) {
          var editionLabel = currentSnapshot.edition === 'java' ? 'java' : 'bedrock'
          trackCalculatorEvent('copy_result', {
            event_category: 'calculator',
            event_label: editionLabel,
            final_damage: currentSnapshot.finalDamage,
            hearts: currentSnapshot.hearts,
            hits: currentSnapshot.hits
          })
        }
        setTimeout(function () {
          copyResultBtn.textContent = 'Copy result'
        }, 1500)
      }
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onSuccess)
      } else {
        var textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        try {
          document.execCommand('copy')
          onSuccess()
        } catch (e) {
        }
        document.body.removeChild(textarea)
      }
    })
  }

  if (resetButton && form) {
    resetButton.addEventListener('click', function () {
      editionEl.value = 'java'
      if (weaponPresetEl) weaponPresetEl.value = 'custom'
      baseDamageEl.value = '7'
      sharpnessEl.value = '5'
      criticalEl.checked = false
      strengthEl.value = '0'
      armorEl.value = '20'
      toughnessEl.value = '2'
      if (armorValueEl) {
        armorValueEl.textContent = 'Armor: ' + armorEl.value
      }
      if (toughnessContainer) toughnessContainer.classList.remove('hidden')
      lastSnapshot = null
      currentSnapshot = null
      if (prevContainerEl) {
        prevContainerEl.classList.add('hidden')
      }
      if (typeof window !== 'undefined' && window.history && window.location) {
        window.history.replaceState(null, '', window.location.pathname)
      }
      performCalculation()
    })
  }

  // Initialize
  parseInitialFromQuery()
  if (editionEl && toughnessContainer) {
     if (editionEl.value === 'bedrock') {
        toughnessContainer.classList.add('hidden')
     } else {
        toughnessContainer.classList.remove('hidden')
     }
  }
  performCalculation()
})()
