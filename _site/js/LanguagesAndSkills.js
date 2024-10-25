let canShowProjects = false; // Flag to control when projects can be shown

const scrollPrompt = document.getElementById('scroll-prompt');

// Handle the scroll prompt fade-out
setTimeout(() => {
    scrollPrompt.classList.add('show'); // Display the scroll prompt
    setTimeout(() => {
        scrollPrompt.classList.remove('show');
        scrollPrompt.classList.add('fade-out');
        setTimeout(() => {
            scrollPrompt.style.display = 'none';
            canShowProjects = true; // Allow projects to be shown on scroll
            document.body.classList.add('show-projects'); // Add the class to show projects
            window.dispatchEvent(new Event('scroll')); // Trigger scroll event to show projects
        }, 1000); // 1 second for the fade-out effect of the scroll prompt
    }, 2000); // 2.0 seconds before fading out the scroll prompt
}, 1500); // 1.5 seconds delay before showing the scroll prompt


// Handle scroll effects
const projects = document.querySelectorAll('.project');
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
    let scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollPercent = (scrollPos / scrollHeight) * 100;
    progressBar.style.width = scrollPercent + '%';

    if (!canShowProjects) return; // Prevent showing projects before scroll prompt fades out

    const viewportHeight = window.innerHeight;

    projects.forEach((project) => {
        let projectTop = project.getBoundingClientRect().top;
        let projectBottom = project.getBoundingClientRect().bottom;
        let fadeInStart = viewportHeight * 0.25; // When 20% of the viewport height
        let fadeOutEnd = viewportHeight * 0.75;  // When 80% of the viewport height        

        // Fade in if the project is partially within the viewport
        if (projectTop < fadeOutEnd && projectBottom > fadeInStart) {
            project.classList.add('active');
        } else {
            project.classList.remove('active');
        }
    });
});