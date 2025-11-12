function initNavigation() {
	const navToggle = document.getElementById('nav-toggle')
	const nav = document.getElementById('nav')
	const navLinks = document.getElementById('nav-links')
	const allNavLinks = navLinks.querySelectorAll('.nav-link')

	let lastFocusedElement = null
	let lastScrollTop = 0

	const trapFocus = (container, e) => {
		const focusableSelectors =
			'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
		const focusableElements = Array.from(container.querySelectorAll(focusableSelectors))
		const allFocusable = [navToggle, ...focusableElements]
		const firstEl = allFocusable[0]
		const lastEl = allFocusable[allFocusable.length - 1]

		if (!allFocusable.length) return

		if (e.shiftKey && document.activeElement === firstEl) {
			e.preventDefault()
			lastEl.focus()
		} else if (!e.shiftKey && document.activeElement === lastEl) {
			e.preventDefault()
			firstEl.focus()
		}
	}

	const CloseMenu = () => {
		const mobileWidthLimit = 767
		nav.classList.remove('nav-open')
		if (window.innerWidth < mobileWidthLimit) {
			setTimeout(() => {
				navLinks.style.display = 'none'
			}, 500)
		}
	}

	navToggle.addEventListener('click', function () {
		const isOpen = nav.classList.contains('nav-open')

		if (!isOpen) {
			lastFocusedElement = document.activeElement
			navLinks.style.display = 'block'
			const firstLink = navLinks.querySelector('a[href]')

			setTimeout(() => {
				nav.classList.add('nav-open')
			}, 100)

			if (firstLink) firstLink.focus()
		} else {
			CloseMenu()
			if (lastFocusedElement) lastFocusedElement.focus()
		}
	})

	// Close mobile menu when clicking on a link
	allNavLinks.forEach(function (link) {
		link.addEventListener('click', function () {
			CloseMenu()
			if (lastFocusedElement) lastFocusedElement.focus()
		})
	})

	// Add scroll effect - slight shadow enhancement on scroll
	window.addEventListener('scroll', function () {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop

		if (scrollTop > 20) {
			nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, .9)'
		} else {
			nav.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.3)'
		}

		lastScrollTop = scrollTop
	})

	// Focus trap + keyboard navigation
	document.addEventListener('keydown', function (e) {
		const isOpen = nav.classList.contains('nav-open')
		if (!isOpen) return

		// ESC closes menu
		if (e.key === 'Escape') {
			CloseMenu()
		}

		// Enter on link closes menu
		if (e.key === 'Enter' && e.target.closest('#nav-links a')) {
			CloseMenu()
		}

		// Tab moves focus
		if (e.key === 'Tab') {
			trapFocus(navLinks, e)
		}
	})
}

function initShowcase() {
	// Gallery filter functionality
	const filterButtons = document.querySelectorAll('.showcase-filter-btn')

	// Filtering gallery cards
	const galleryCards = document.querySelectorAll('[data-category]')

	filterButtons.forEach(button => {
		button.addEventListener('click', function () {
			const filter = this.dataset.filter
			galleryCards.forEach(card => {
				const categories = card.dataset.category.split(' ')

				if (filter === 'all' || categories.includes(filter)) {
					// show with fade in
					card.style.display = 'block'
					card.classList.remove('hidden')
					card.classList.add('active')
					button.setAttribute('aria-pressed', 'true')
				} else {
					// close with fade out
					card.classList.remove('active')
					card.classList.add('hidden')
					button.setAttribute('aria-pressed', 'false')
					setTimeout(() => {
						card.style.display = 'none'
					}, 300)
				}
			})
		})
	})
}

function initHeader() {
	// Parallax effect for header video (subtle)
	const headerVideo = document.querySelector('.header-media-video')
	if (headerVideo) {
		window.addEventListener('scroll', function () {
			const scrolled = window.pageYOffset
			const rate = scrolled * 0.1
			if (scrolled < 800) {
				headerVideo.style.transform = `translateY(${rate}px) translateZ(0)`
			}
		})
	}
}

function initForms() {
	const headerForm = document.querySelector('.header-booking-form')
	const bookingForm = document.querySelector('.booking-concierge-form')

	if (headerForm) {
		headerForm.addEventListener('submit', function (e) {
			e.preventDefault()
			const alert = document.querySelector('.alert-message--header')
			alert.style.display = 'block'
			this.reset()
			setTimeout(() => {
				alert.style.display = 'none'
			}, 5000)
		})
	}

	if (bookingForm) {
		bookingForm.addEventListener('submit', function (e) {
			e.preventDefault()
			const submitBtn = this.querySelector('.booking-submit')
			const originalText = submitBtn.textContent
			const alert = document.querySelector('.alert-message--booking')
			submitBtn.textContent = 'Sending...'
			submitBtn.disabled = true
			alert.style.display = 'block'
			this.reset()

			setTimeout(() => {
				submitBtn.textContent = originalText
				submitBtn.disabled = false
			}, 1500)

			setTimeout(() => {
				alert.style.display = 'none'
			}, 5000)
		})
	}
}

// Footer
function initFooter() {
	const footer = document.getElementById('footer')
	const yearSpan = document.querySelector('.footer-year')

	if (footer) {
		const socialLinks = footer.querySelectorAll('.footer-social-link')
		const contactItems = footer.querySelectorAll('[data-tag=footer-animation]')

		socialLinks.forEach(link => {
			link.addEventListener('mouseenter', function () {
				this.style.transform = 'translateY(-3px) rotate(5deg)'
			})

			link.addEventListener('mouseleave', function () {
				this.style.transform = 'translateY(0) rotate(0deg)'
			})
		})

		// Initial state
		contactItems.forEach(item => {
			item.style.opacity = '0'
			item.style.transform = 'translateY(20px)'
		})

		const observerOptions = {
			threshold: 0.4,
		}

		const footerObserver = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					// Kiedy footer pojawi się w ekranie — animacja
					contactItems.forEach((item, index) => {
						setTimeout(() => {
							item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
							item.style.opacity = '1'
							item.style.transform = 'translateY(0)'
						}, index * 100)
					})
					footerObserver.unobserve(footer)
				}
			})
		}, observerOptions)

		footerObserver.observe(footer)
	}

	if (yearSpan) {
		const currentYear = new Date().getFullYear()
		yearSpan.textContent = currentYear
	}
}

// Setion scroll animations
function initScrollAnimations() {
	const animatedSections = document.querySelectorAll('.js-anim-section')
	if (!animatedSections.length) return

	animatedSections.forEach(section => {
		section.classList.add('section-anim--hidden')
	})

	const observerOptions = {
		threshold: 0,
		rootMargin: '0px 0px -10% 0px',
	}

	const sectionObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return

			entry.target.classList.add('section-anim--visible')
			entry.target.classList.remove('section-anim--hidden')
			sectionObserver.unobserve(entry.target)
		})
	}, observerOptions)

	requestAnimationFrame(() => {
		animatedSections.forEach(section => {
			sectionObserver.observe(section)
		})
	})
}

document.addEventListener('DOMContentLoaded', () => {
	initScrollAnimations()
	initNavigation()
	initHeader()
	initShowcase()
	initForms()
	initFooter()
})
