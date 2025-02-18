let canShowProjects = false; // Flag to control when projects can be shown

// Welcome message fade-out and scroll prompt
const welcomeMessage = document.getElementById('welcome-message');
const scrollPrompt = document.getElementById('scroll-prompt');

// Handle the index welcome message and scroll prompt fade-out
setTimeout(() => {
    welcomeMessage.classList.add('fade-out');
    setTimeout(() => {
        welcomeMessage.style.display = 'none';
        // Display the scroll prompt
        scrollPrompt.classList.add('show');
        setTimeout(() => {
            scrollPrompt.classList.remove('show');
            scrollPrompt.classList.add('fade-out');
            setTimeout(() => {
                scrollPrompt.style.display = 'none';
                canShowProjects = true; // Allow projects to be shown on scroll
                document.body.classList.add('show-projects'); // Add the class to show projects
                window.dispatchEvent(new Event('scroll')); // Trigger scroll event to show projects
            }, 1000); // 1 second for the fade-out effect of the scroll prompt
        }, 1500); // 1.5 seconds before fading out the scroll prompt
    }, 1500); // 1.5 seconds for the fade-out effect of the welcome message
}, 1500); // 1.5 seconds before fading out the welcome message


// Handle language hover
document.addEventListener('DOMContentLoaded', () => {
    const spotlight = document.querySelector('.spotlight');
    const languageLinks = document.querySelectorAll('.languages-and-skills a');
    const mainMenuContainer = document.querySelector('.main-menu-container');

    // Function to reset all language link styles
    const resetLanguageStyles = () => {
        languageLinks.forEach(link => {
            const heading = link.querySelector('h4');
            heading.style.backgroundColor = ''; // Reset background color
            heading.style.color = ''; // Reset text color
        });
    };

    // Function to reset spotlight and language link styles
    const resetSpotlight = () => {
        spotlight.innerHTML = '<p>Scroll to view projects</p> <p>Vist a specific projects repo on GitHub by clicking the project card</p>';
        spotlight.style.backgroundColor = ''; // Reset background color
        spotlight.style.color = ''; // Reset text color

        resetLanguageStyles();
    };

    languageLinks.forEach(link => {
        const heading = link.querySelector('h4'); // Select the h4 inside the link

        link.addEventListener('mouseenter', (event) => {
            // Reset all languages before applying new styles
            resetLanguageStyles();

            const content = event.currentTarget.getAttribute('data-content');
            spotlight.innerHTML = content;

            spotlight.style.backgroundColor = '#f8f9fa'; // Change background color
            spotlight.style.color = '#000000'; // Change text color

            heading.style.backgroundColor = '#f8f9fa'; // Change background color
            heading.style.color = '#000000'; // Change text color
        });
    });

    // Add a mouseleave event to the main container to reset everything when mouse exits the section
    mainMenuContainer.addEventListener('mouseleave', () => {
        resetSpotlight();
    });
});


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