/* getClosest(), getSibling(), getSiblings(), getChild(), getChildren()  */
function getClosest(element, selector) {
	if (!element) {
		return null
	}
	if (!selector) {
		return element.parentNode
	}
	return element.closest(selector) || null
}
function getSibling(element, selector) {
	if (!element) {
		return null
	}
	const siblings = Array.from(element.parentNode.children).filter(child => child !== element)
	if (!selector) {
		return siblings[0] || null
	}
	return siblings.find(sibling => sibling.matches(selector)) || null
}
function getSiblings(element, selector) {
	if (!element) {
		return []
	}
	const siblings = Array.from(element.parentNode.children).filter(child => child !== element)
	if (!selector) {
		return siblings
	}
	return siblings.filter(sibling => sibling.matches(selector))
}
function getChild(element, selector) {
	if (!element) {
		return null
	}
	const children = Array.from(element.children)
	if (!selector) {
		return children[0] || null
	}
	return children.find(child => child.matches(selector)) || null
}
function getChildren(element, selector) {
	if (!element) {
		return []
	}
	const children = Array.from(element.children)
	if (!selector) {
		return children
	}
	return children.filter(child => child.matches(selector))
}
/* fxShow() && fxHide() */
const fxShowHideMap = new Map()
function fxShowHandler(element, animationType, animationDuration, animationDisplay) {
	const allAnimations = {
		default: function (el) {
			el.removeAttribute('style')
			el.style.display = animationDisplay
		},
		fade: function (el, animationDuration) {
			let currentOpacity
			if (window.getComputedStyle(el).display === 'none') {
				currentOpacity = 0
			} else {
				currentOpacity = parseFloat(window.getComputedStyle(el).getPropertyValue('opacity'))
			}
			el.removeAttribute('style')
			el.style.transition = window.getComputedStyle(el).transition + ', opacity .1s !important'
			el.style.opacity = currentOpacity
			el.style.display = animationDisplay
			let start = Date.now()
			const loop = function () {
				let progress = (Date.now() - start) / animationDuration
				progress = Math.max(0, Math.min(1, progress))
				el.style.opacity = currentOpacity + progress
				if (progress < 1 || el.style.opacity < 1) {
					fxShowHideMap.set(el, window.requestAnimationFrame(loop))
				} else {
					el.style.transition = ''
					el.style.opacity = ''
					el.style.display = animationDisplay
				}
			}
			fxShowHideMap.set(el, window.requestAnimationFrame(loop))
		},
		slide: function (el, animationDuration) {
		},
	}
	const currentAnimation = allAnimations[animationType] || allAnimations.default
	currentAnimation(element, animationDuration)
}
function fxHideHandler(element, animationType, animationDuration, animationDisplay) {
	const allAnimations = {
		default: function (el) {
			el.removeAttribute('style')
			el.style.display = 'none'
		},
		fade: function (el, animationDuration) {
			let defaultOpacity = parseFloat(window.getComputedStyle(el).getPropertyValue('opacity'))
			el.style.transition = window.getComputedStyle(el).transition + ', opacity .1s !important'
			el.style.opacity = defaultOpacity
			el.style.display = animationDisplay
			let start = Date.now()
			const loop = function () {
				let progress = (Date.now() - start) / animationDuration
				progress = Math.max(0, Math.min(1, progress))
				el.style.opacity = defaultOpacity - progress
				let temp = parseFloat(el.style.opacity)
				if (progress < 1 && temp > 0) {
					fxShowHideMap.set(el, window.requestAnimationFrame(loop))
				} else {
					el.removeAttribute('style')
					el.style.display = 'none'
				}
			}
			fxShowHideMap.set(el, window.requestAnimationFrame(loop))
		},
		slide: function (el, animationDuration) {
		},
	}
	const currentAnimation = allAnimations[animationType] || allAnimations.default
	currentAnimation(element, animationDuration)
}
function fxShowHide(functionName, element, animationType, animationDuration, animationDisplay) {
	if (!element) {
		return
	}
	if (fxShowHideMap.has(element)) {
		window.cancelAnimationFrame(fxShowHideMap.get(element))
	}
	if (isNaN(animationDuration)) {
		animationDuration = 200
	}
	functionName(element, animationType, animationDuration, animationDisplay)
}
function fxShow(element, animationType = 'default', animationDuration = 200, animationDisplay = 'flex') {
	fxShowHide(fxShowHandler, element, animationType, animationDuration, animationDisplay)
}
function fxHide(element, animationType = 'default', animationDuration = 200, animationDisplay = 'flex') {
	if (window.getComputedStyle(element).display === 'none') {
		return
	}
	fxShowHide(fxHideHandler, element, animationType, animationDuration, animationDisplay)
}
/* Build - data-fx-toggle */
document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll('[data-fx-toggle]').forEach(function (each) {
		each.querySelectorAll('[data-fx-toggle-start]').forEach(function (each) {
			const toggleId = each.dataset.fxToggleButton
			const toggleNumber = each.dataset.fxToggleNumber
			const toggleBlock = document.querySelectorAll(`[data-fx-toggle-block='${toggleId}'][data-fx-toggle-number='${toggleNumber}']`)
			each.classList.add('active')
			toggleBlock.forEach(function (each) {
				each.classList.add('active')
				fxShow(each)
			})
		})
	})
	document.querySelectorAll('[data-fx-toggle-button]').forEach(function (each) {
		each.addEventListener('click', function (e) {
			e.preventDefault()
			if (!this.classList.contains('active')) {
				const toggleId = this.dataset.fxToggleButton
				const toggleNumber = this.dataset.fxToggleNumber
				const toggleAnimation = getClosest(this, '[data-fx-toggle]').dataset.fxToggleAnimation
				const toggleBlock = document.querySelectorAll(`[data-fx-toggle-block='${toggleId}'][data-fx-toggle-number='${toggleNumber}']`)
				document.querySelectorAll(`[data-fx-toggle-button='${toggleId}']`).forEach(function (each) {
					each.classList.remove('active')
				})
				document.querySelectorAll(`[data-fx-toggle-block='${toggleId}']`).forEach(function (each) {
					each.classList.remove('active')
					fxHide(each)
				})
				this.classList.add('active')
				toggleBlock.forEach(function (each) {
					each.classList.add('active')
					fxShow(each, toggleAnimation)
				})
			}
		})
	})
})

$(function () {})


$(function(){
    
});