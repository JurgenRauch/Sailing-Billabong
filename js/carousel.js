// Image Carousel functionality
function initImageCarousel() {
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    let carouselInterval;
    
    if (dots.length === 0 || slides.length === 0) return;
    
    if (typeof sbLog === 'function') sbLog('Carousel initialized with', slides.length, 'slides');
    
    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            // Reset auto-play timer when user interacts
            clearInterval(carouselInterval);
            startAutoPlay();
        });
    });
    
    // Add arrow navigation functionality
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
            // Reset auto-play timer when user interacts
            clearInterval(carouselInterval);
            startAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
            // Reset auto-play timer when user interacts
            clearInterval(carouselInterval);
            startAutoPlay();
        });
    }
    
    // Auto-play functionality
    function startAutoPlay() {
        carouselInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }
    
    // Pause auto-play on hover
    const carousel = document.querySelector('.image-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
    
    // Start auto-play
    startAutoPlay();
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initImageCarousel();
});
