// Contact form (EmailJS) isolated module
(function() {
	// Initialize EmailJS and wire the contact form if present on the page
	function initContactForm() {
		// Ensure EmailJS and config data are available
		if (typeof emailjs === 'undefined' || !window.siteData || !siteData.config || !siteData.config.emailjs) {
			return;
		}
		try {
			emailjs.init(siteData.config.emailjs.public_key);
			const contactForm = document.getElementById('contact-form');
			if (!contactForm) return;
			contactForm.addEventListener('submit', handleSubmit);
		} catch (err) {
			console.warn('EmailJS init failed:', err);
		}
	}

	// Send handler
	async function handleSubmit(event) {
		event.preventDefault();
		const form = event.target;
		const submitBtn = document.getElementById('submit-btn');
		// basic UX locking
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = 'Sending...';
		}

		try {
			const formData = new FormData(form);
			const contactEmail = 'contact@sailingbillabong.com'; // single fixed recipient
			const params = {
				from_name: formData.get('from_name'),
				from_email: formData.get('from_email'),
				// aliases for template compatibility
				name: formData.get('from_name'),
				email: formData.get('from_email'),
				subject: formData.get('subject') || 'Contact Form Submission',
				message: formData.get('message'),
				website: siteData.config.emailjs.website_name || 'Sailing Billabong',
				to_email: contactEmail,
				contactEmail: contactEmail
			};

			await emailjs.send(
				siteData.config.emailjs.service_id,
				siteData.config.emailjs.template_id,
				params
			);

			showFormStatus('success', "Message sent successfully! We'll get back to you soon.");
			form.reset();
		} catch (error) {
			console.error('EmailJS Error:', error);
			showFormStatus('error', 'Failed to send message. Please try again or contact us directly.');
		} finally {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.textContent = 'Send Message';
			}
		}
	}

	// Lightweight status display used by contact form
	function showFormStatus(type, message) {
		const statusDiv = document.getElementById('form-status');
		if (!statusDiv) return;

		statusDiv.style.display = 'block';
		statusDiv.textContent = message;
		if (type === 'success') {
			statusDiv.style.backgroundColor = '#d4edda';
			statusDiv.style.color = '#155724';
			statusDiv.style.border = '1px solid #c3e6cb';
		} else {
			statusDiv.style.backgroundColor = '#f8d7da';
			statusDiv.style.color = '#721c24';
			statusDiv.style.border = '1px solid #f5c6cb';
		}
		setTimeout(() => { statusDiv.style.display = 'none'; }, 5000);
	}

	// Auto-init on DOM ready if the contact form exists
	document.addEventListener('DOMContentLoaded', function() {
		if (document.getElementById('contact-form')) {
			initContactForm();
		}
	});

	// Also expose a manual initializer for explicit usage
	window.initContactForm = initContactForm;
})();
