// Contact form (EmailJS) isolated module
(function() {
    let emailInitialized = false;

    // Initialize EmailJS (once) when config is available
    async function ensureEmailReady(retries = 40, delayMs = 250) {
        for (let attempt = 0; attempt < retries; attempt++) {
            if (typeof siteData !== 'undefined' && siteData.config && siteData.config.emailjs && typeof emailjs !== 'undefined') {
                if (!emailInitialized) {
                    try {
                        emailjs.init(siteData.config.emailjs.public_key);
                        emailInitialized = true;
                    } catch (_) {
                        // swallow and retry
                    }
                }
                if (emailInitialized) return;
            }
            await new Promise(r => setTimeout(r, delayMs));
        }
        throw new Error('Email service not ready');
    }

    // Wire the contact form submit handler; do not depend on config being ready
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        // Avoid double binding
        if (!contactForm.__emailBound) {
            contactForm.addEventListener('submit', handleSubmit);
            contactForm.__emailBound = true;
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
            // Make sure EmailJS and config are ready (wait briefly if needed)
            await ensureEmailReady();
			const formData = new FormData(form);
			const contactEmail = 'contact@sailingbillabong.com'; // single fixed recipient
            const params = {
				from_name: formData.get('from_name'),
				from_email: formData.get('from_email'),
				// aliases for template compatibility
				name: formData.get('from_name'),
				email: formData.get('from_email'),
                // some templates expect reply_to specifically
                reply_to: formData.get('from_email'),
				subject: formData.get('subject') || 'Contact Form Submission',
				message: formData.get('message'),
				website: siteData.config.emailjs.website_name || 'Sailing Billabong',
				to_email: contactEmail,
				contactEmail: contactEmail
			};

            const response = await emailjs.send(
				siteData.config.emailjs.service_id,
				siteData.config.emailjs.template_id,
				params
			);

            console.log('EmailJS send success:', response);
			showFormStatus('success', "Message sent successfully! We'll get back to you soon.");
			form.reset();
		} catch (error) {
            console.error('EmailJS Error:', error && (error.text || error.message) || error);
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

    // Init immediately if DOM is already ready; also listen for DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }

	// Also expose a manual initializer for explicit usage
	window.initContactForm = initContactForm;
})();
