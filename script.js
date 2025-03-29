// START OF FILE script.js
// Uses Swiper from CDN

document.addEventListener('DOMContentLoaded', () => {
    // --- Select Essential Elements ---
    const portfolioModal = document.getElementById('portfolio-modal');
    const portfolioModalOverlay = portfolioModal?.querySelector('.modal-overlay');
    const portfolioModalCloseBtn = portfolioModal?.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const modalDescription = document.getElementById('modal-description');
    const modalMeta = document.getElementById('modal-meta');
    const modalLink = document.getElementById('modal-link');
    const applyLicenseBtnPortfolio = document.getElementById('apply-license-btn');
    const purchaseLicenseBtnPortfolio = document.getElementById('purchase-license-btn');

    const licenseApplyModal = document.getElementById('license-apply-modal');
    const licenseModalOverlay = licenseApplyModal?.querySelector('.modal-overlay');
    const licenseModalCloseBtn = licenseApplyModal?.querySelector('.modal-close');
    const licenseForm = document.getElementById('license-form');
    const licenseBeatTitleInput = document.getElementById('license-beat-title');
    const licenseUserNameInput = document.getElementById('license-user-name');
    const licenseSignatureInput = document.getElementById('license-signature');
    const licenseAgreementCheck = document.getElementById('license-agreement-check');
    const licenseFormError = document.getElementById('license-form-error');
    const viewTermsLink = document.getElementById('view-license-terms-link');
    const fullTermsDiv = document.getElementById('license-terms-full');
    const generateLicenseBtn = document.getElementById('generate-license-btn');
    const downloadLicenseBtn = document.getElementById('download-license-btn'); // Button for step 2
    const licenseDisplayArea = document.getElementById('license-display-area'); // Container for text output
    const licenseTextOutput = document.getElementById('license-text-output');   // Textarea
    const copyLicenseBtn = document.getElementById('copy-license-btn');         // Copy button

    const purchaseOptionsModal = document.getElementById('purchase-options-modal');
    const purchaseModalOverlay = purchaseOptionsModal?.querySelector('.modal-overlay');
    const purchaseModalCloseBtn = purchaseOptionsModal?.querySelector('.modal-close');
    const purchaseModalTitle = document.getElementById('purchase-modal-title');
    const purchaseBeatInfo = document.getElementById('purchase-beat-info');

    const homeApplyLicenseBtn = document.getElementById('home-apply-license-btn');
    const homePurchaseLicenseBtn = document.getElementById('home-purchase-license-btn');

    // --- Basic check for essential elements ---
    const essentialElements = [
        portfolioModal, portfolioModalOverlay, portfolioModalCloseBtn, modalTitle,
        modalVideoContainer, modalDescription, modalMeta, modalLink, applyLicenseBtnPortfolio,
        purchaseLicenseBtnPortfolio, licenseApplyModal, licenseModalOverlay, licenseModalCloseBtn,
        licenseForm, licenseBeatTitleInput, licenseUserNameInput, licenseSignatureInput,
        licenseAgreementCheck, licenseFormError, viewTermsLink, fullTermsDiv, generateLicenseBtn,
        downloadLicenseBtn, licenseDisplayArea, licenseTextOutput, copyLicenseBtn, // Added checks
        purchaseOptionsModal, purchaseModalOverlay, purchaseModalCloseBtn, purchaseModalTitle,
        purchaseBeatInfo, homeApplyLicenseBtn, homePurchaseLicenseBtn
    ];

    if (essentialElements.some(el => !el)) {
        console.error("CRITICAL ERROR: Essential UI elements not found! Check IDs in index.html and script.js.");
        // Optional: Display a user-facing error message
        // document.body.innerHTML = '<p style="color: red; padding: 20px; text-align: center;">Error: Page components failed to load. Please refresh or contact support.</p>';
        return; // Stop script execution
    }
    console.log("All essential UI elements found.");

    // --- Initialize Swiper Card Stack ---
    const previewSwiperElement = document.querySelector('.swiper.preview-swiper');
    let previewSwiperInstance = null;
    if (previewSwiperElement) {
        try {
            if (typeof Swiper === 'undefined') { throw new Error('Swiper library not loaded.'); }
            previewSwiperInstance = new Swiper('.swiper.preview-swiper', {
                effect: 'cards',
                grabCursor: true,
                loop: true,
                cardsEffect: {
                    perSlideOffset: 8,
                    perSlideRotate: 2,
                    rotate: true,
                    slideShadows: true,
                },
                navigation: {
                    nextEl: '#preview-swipe-next',
                    prevEl: '#preview-swipe-prev',
                },
                // Optional: Add pagination or other Swiper features if needed
            });
            console.log("Swiper Card Stack initialized successfully.");
        } catch (error) {
             console.error("Failed to initialize Swiper Card Stack:", error);
             const previewContainer = document.querySelector('.preview-container');
             if (previewContainer) {
                 previewContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Could not load preview carousel.</p>';
             }
        }
    } else {
        console.warn("Swiper container '.swiper.preview-swiper' not found in the DOM.");
    }


    // --- License Template (Plain Text) - Kept from System Version ---
    const licenseTemplate = `
FREE LICENSE AGREEMENT

Beat Title: {{BEAT_TITLE}}
Producer: Artchive Beat / Moch Dimas Almahtar
Licensee: {{USER_NAME}}

This Free License Agreement ("Agreement") is made between the Producer and the Licensee ("User"), granting permission to use the beat under the following terms:

1. GRANT OF LICENSE
The Producer grants the User a non-exclusive, non-transferable, royalty-free license to use the beat for:
- Uploading on YouTube or other video platforms (maximum 10,000 views/listeners).
- Uploading on Digital Streaming Platforms (DSPs) such as Spotify, Apple Music, etc. (maximum 10,000 streams/listeners).
- Non-commercial projects (e.g., demos, mixtapes, personal projects).

2. RESTRICTIONS
- This license does not grant ownership or exclusive rights to the beat.
- The User must not register the beat or song using the beat for Content ID, copyright claims, or publishing rights.
- The User cannot resell, sublicense, or redistribute the beat in any form.
- Modifications to the beat do not grant additional rights beyond this license.

3. LICENSE EXPIRATION
Once the total views/listens exceed 10,000, this Free License will automatically expire. The User must contact the Producer to negotiate and renew the license. Continued use beyond the limit without renewal violates this Agreement.

4. CREDITS & ATTRIBUTION
The User must credit the Producer as follows:

  Produced by Artchive Beat / Moch Dimas Almahtar

This credit must appear in the song description, metadata, and/or wherever applicable.

5. TERMINATION
This Agreement will be terminated immediately if the User:
- Breaches any terms stated above.
- Fails to renew the license after exceeding the allowed usage.

The Producer reserves the right to revoke this license at any time if terms are violated.

---
AGREEMENT & SIGNATURE

By downloading and using this beat, the Licensee ({{USER_NAME}}) acknowledges they have read, understood, and agreed to all terms and conditions of this Free License Agreement.

Digital Signature: {{SIGNATURE}}
Date: {{DATE}}

---
Artchive Beat / Moch Dimas Almahtar
Contact for Licensing & Renewal: dimasalmactar12@gmail.com
Instagram: @dmz.artchive or @beat.artchive
`;
    // Populate the expandable terms view
    if (fullTermsDiv) {
         let displayTerms = licenseTemplate
            .replace('{{BEAT_TITLE}}', '[Beat Title]').replace(/\{\{USER_NAME\}\}/g, '[Your Name]')
            .replace('{{SIGNATURE}}', '[Your Signature]').replace('{{DATE}}', '[Date]');
        fullTermsDiv.style.whiteSpace = 'pre-wrap'; // Ensure line breaks are respected
        fullTermsDiv.style.fontFamily = 'monospace'; // Use monospace for readability
        fullTermsDiv.innerText = displayTerms;
    }

    // --- Gumroad URL & Contact Email ---
    const GUMROAD_URL = "https://dimasalmactar.gumroad.com/l/utalaj?wanted=true";
    const EXCLUSIVE_CONTACT_EMAIL = "dimasalmactar12@gmail.com";

    // --- Helper Functions to Open Modals (from first script, slightly adapted) ---
    const openLicenseModal = (beatTitle = null) => {
        licenseForm.reset();
        licenseFormError.style.display = 'none';
        fullTermsDiv.style.display = 'none'; // Keep terms hidden initially
        licenseDisplayArea.style.display = 'none'; // Hide generated license area
        licenseTextOutput.value = ''; // Clear textarea

        // Reset button states to Step 1
        generateLicenseBtn.style.display = 'inline-block';
        generateLicenseBtn.disabled = false;
        generateLicenseBtn.textContent = 'Validate & Prepare'; // Use clearer text for Step 1
        downloadLicenseBtn.style.display = 'none'; // Hide Step 2 button
        copyLicenseBtn.textContent = 'Copy License Text'; // Reset copy button text
        copyLicenseBtn.disabled = false; // Ensure copy button is enabled

        if (beatTitle) {
            licenseBeatTitleInput.value = beatTitle;
            licenseBeatTitleInput.readOnly = true;
            licenseBeatTitleInput.placeholder = "";
        } else {
            licenseBeatTitleInput.value = '';
            licenseBeatTitleInput.readOnly = false;
            licenseBeatTitleInput.placeholder = "Enter the exact beat title";
        }
        licenseApplyModal.classList.add('is-visible');
        document.body.classList.add('modal-open');
        const content = licenseApplyModal.querySelector('.modal-content');
        if (content) content.scrollTop = 0; // Scroll to top
        console.log(`Opened Free License modal${beatTitle ? ' for: ' + beatTitle : ''}`);
    };

    const openPurchaseModal = (beatTitle = null) => {
        if (beatTitle) {
            purchaseModalTitle.textContent = "Purchase License";
            purchaseBeatInfo.textContent = `Selected Beat: ${beatTitle}`;
            purchaseBeatInfo.style.display = 'block';
            purchaseOptionsModal.dataset.beatTitle = beatTitle; // Store title
        } else {
            purchaseModalTitle.textContent = "Choose Your Beat License";
            purchaseBeatInfo.style.display = 'none';
            delete purchaseOptionsModal.dataset.beatTitle; // Remove stored title
        }
        purchaseOptionsModal.classList.add('is-visible');
        document.body.classList.add('modal-open');
        const content = purchaseOptionsModal.querySelector('.modal-content');
        if (content) content.scrollTop = 0; // Scroll to top
        console.log(`Opened Purchase modal${beatTitle ? ' for: ' + beatTitle : ''}`);
    };

    // --- Function to Open Gumroad Link / Contact (Attached to window for onclick) ---
    window.openGumroad = function(licenseType) {
        console.log(`Purchase option selected: ${licenseType}`);
        let url = GUMROAD_URL; // Default Gumroad link
        const beatTitle = purchaseOptionsModal.dataset.beatTitle || "General Inquiry"; // Get title if stored

        if (licenseType === 'exclusive') {
             url = `mailto:${EXCLUSIVE_CONTACT_EMAIL}?subject=Exclusive License Inquiry: ${encodeURIComponent(beatTitle)}`;
             console.log("Opening mailto for exclusive:", url);
             window.location.href = url; // Use mailto link
        } else {
             // For standard/premium, open Gumroad link in new tab
             console.log("Opening Gumroad:", url);
             window.open(url, '_blank', 'noopener,noreferrer');
             // Optional: Add variant info if Gumroad supports it via URL parameters
             // e.g., window.open(GUMROAD_URL + `&variant=${licenseType}`, '_blank');
        }
         // Consider closing the modal after action, or let the user close it
         // closePurchaseModal();
    }

    // --- Open Portfolio Modal (from first script, ensuring data reading) ---
    document.body.addEventListener('click', (event) => {
        // Handle overlay clicks for closing modals first
        if (event.target.classList.contains('modal-overlay')) {
             if (portfolioModal.classList.contains('is-visible')) closePortfolioModal();
             else if (licenseApplyModal.classList.contains('is-visible')) closeLicenseModal();
             else if (purchaseOptionsModal.classList.contains('is-visible')) closePurchaseModal();
             return;
        }

        // Find the closest clickable item (grid or swiper slide)
        const clickableItem = event.target.closest('.grid-item[data-title], .swiper-slide[data-title]');
        if (!clickableItem) return; // Exit if click wasn't on a relevant item

        // --- Get Data Attributes ---
        const title = clickableItem.dataset.title || 'Project Details';
        const type = clickableItem.dataset.type;
        const videoId = clickableItem.dataset.videoId;
        const embedUrl = clickableItem.dataset.embedUrl;
        const videoHeight = clickableItem.dataset.height; // For fixed height embeds like SC/Spotify
        const link = clickableItem.dataset.link;
        const linkText = clickableItem.dataset.linkText || 'View Source';
        const isBeat = clickableItem.dataset.isBeat === 'true'; // Check if it's a beat
        const description = clickableItem.dataset.description || '';
        const meta = clickableItem.dataset.meta || '';

        console.log('Portfolio Item Clicked:', { title, type, isBeat, link });

        // --- Populate Modal ---
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalMeta.textContent = meta;
        modalLink.href = link || '#';
        modalLink.textContent = linkText;
        modalLink.style.display = (link && link !== '#') ? 'inline-block' : 'none';
        modalLink.className = 'modal-button secondary'; // Ensure style

        // Show/Hide License Buttons based on 'data-is-beat'
        if (isBeat) {
            applyLicenseBtnPortfolio.style.display = 'inline-block';
            purchaseLicenseBtnPortfolio.style.display = 'inline-block';
            applyLicenseBtnPortfolio.dataset.beatTitle = title; // Store title for later
            purchaseLicenseBtnPortfolio.dataset.beatTitle = title; // Store title for later
        } else {
            applyLicenseBtnPortfolio.style.display = 'none';
            purchaseLicenseBtnPortfolio.style.display = 'none';
            delete applyLicenseBtnPortfolio.dataset.beatTitle;
            delete purchaseLicenseBtnPortfolio.dataset.beatTitle;
        }

        // --- Clear & Prepare Video Container ---
        modalVideoContainer.innerHTML = '';
        modalVideoContainer.className = 'modal-video-container'; // Reset classes
        modalVideoContainer.style.height = ''; // Reset inline height
        modalVideoContainer.style.paddingBottom = ''; // Reset padding
        modalVideoContainer.style.display = 'none'; // Hide initially

        let embedHtml = '';
        let needsContainerDisplayBlock = false; // Flag

                // --- Create Embed HTML Based on Type ---
                if (type === 'youtube' && videoId) {
                    // ... (kode youtube tetap sama)
                    embedHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                    modalVideoContainer.classList.add('aspect-16-9');
                    needsContainerDisplayBlock = true;
        
                } else if ((type === 'spotify' || type === 'soundcloud') && embedUrl) {
                     // ... (kode spotify/soundcloud tetap sama)
                     let defaultHeight = type === 'spotify' ? (videoHeight || '152') : (videoHeight || '166');
                     embedHtml = `<iframe style="border-radius: var(--modal-video-radius, 10px);" src="${embedUrl}" width="100%" height="${defaultHeight}" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
                     modalVideoContainer.classList.add('fixed-height');
                     modalVideoContainer.style.height = `${defaultHeight}px`;
                     needsContainerDisplayBlock = true;
        
                } else if (type === 'instagram' && link) {
                    console.log('Creating Instagram embed for:', link);
                    modalVideoContainer.classList.add('instagram-embed-container'); // Add specific class
                    needsContainerDisplayBlock = true; // Always show the container
        
                    let instagramEmbedUrl = '#'; // Default to '#' if URL construction fails
                    try {
                        let cleanLink = link.trim().split('?')[0]; // Remove query params
                        if (!cleanLink.endsWith('/')) cleanLink += '/';
                        instagramEmbedUrl = cleanLink + 'embed/';
                        console.log("Attempting Instagram Iframe URL:", instagramEmbedUrl);
                    } catch (e) {
                        console.error("Error constructing Instagram iframe URL:", e);
                    }
        
                    // Create HTML containing the iframe, play button, and fallback link
                    embedHtml = `
                        <div class="instagram-embed-wrapper">
                            <iframe
                                src="${instagramEmbedUrl}"
                                class="instagram-iframe"
                                scrolling="no"
                                frameborder="0"
                                allowTransparency="true"
                                allowfullscreen="true"
                                title="${title} Instagram Post"
                                loading="lazy"
                                sandbox="allow-scripts allow-same-origin allow-popups"
                                referrerpolicy="origin"
                                style="pointer-events: none;" <!-- Disable interaction initially -->
                            ></iframe>
                            <button class="instagram-play-button" aria-label="Play Instagram Video">
                                ▶
                            </button>
                        </div>
                        <p class="instagram-fallback">
                            Loading Instagram content... If it doesn't appear,
                            <a href="${link}" target="_blank" rel="noopener noreferrer" class="instagram-fallback-link">view it directly on Instagram</a>.
                        </p>
                    `;
        
                } else {
                     // ... (kode jika tidak ada tipe yang cocok)
                }
        
                // --- Display Container if Embed Exists ---
                if (needsContainerDisplayBlock) {
                    // Use 'flex' for IG container for centering, 'block' otherwise
                    modalVideoContainer.style.display = modalVideoContainer.classList.contains('instagram-embed-container') ? 'flex' : 'block';
                    modalVideoContainer.innerHTML = embedHtml;
                } else {
                    modalVideoContainer.style.display = 'none'; // Keep hidden if no embed
                }

        // --- Display Container if Embed Exists ---
        if (needsContainerDisplayBlock) {
            // Use 'flex' for IG container to help centering, 'block' otherwise
            modalVideoContainer.style.display = modalVideoContainer.classList.contains('instagram-embed-container') ? 'flex' : 'block';
            modalVideoContainer.innerHTML = embedHtml;
        } else {
            modalVideoContainer.style.display = 'none'; // Keep hidden if no embed
        }

        // --- Show Portfolio Modal ---
        portfolioModal.classList.add('is-visible');
        document.body.classList.add('modal-open');
        const content = portfolioModal.querySelector('.modal-content');
        if (content) content.scrollTop = 0; // Scroll modal to top
    });

    // --- Event Listeners for Buttons activating Modals ---
    applyLicenseBtnPortfolio.addEventListener('click', () => {
        const beatTitle = applyLicenseBtnPortfolio.dataset.beatTitle;
        openLicenseModal(beatTitle || null);
    });
    purchaseLicenseBtnPortfolio.addEventListener('click', () => {
        const beatTitle = purchaseLicenseBtnPortfolio.dataset.beatTitle;
        openPurchaseModal(beatTitle || null);
    });
    homeApplyLicenseBtn.addEventListener('click', () => openLicenseModal());
    homePurchaseLicenseBtn.addEventListener('click', () => openPurchaseModal());

    // --- Event Listeners for Closing Modals ---
    portfolioModalCloseBtn.addEventListener('click', closePortfolioModal);
    licenseModalCloseBtn.addEventListener('click', closeLicenseModal);
    purchaseModalCloseBtn.addEventListener('click', closePurchaseModal);

    // --- Toggle Full Free License Terms View ---
    viewTermsLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        const isVisible = fullTermsDiv.style.display === 'block';
        fullTermsDiv.style.display = isVisible ? 'none' : 'block';
        console.log("Toggled license terms view:", !isVisible);
    });

    // --- Close Modals Functions ---
    function closePortfolioModal() {
        portfolioModal.classList.remove('is-visible');
        checkAndRemoveBodyClass();
        // Stop video/audio playback by clearing the container
        modalVideoContainer.innerHTML = '';
        modalVideoContainer.style.display = 'none'; // Ensure hidden
        console.log("Closed Portfolio Modal");
    };
    function closeLicenseModal() {
        licenseApplyModal.classList.remove('is-visible');
        checkAndRemoveBodyClass();
        // Reset button states and clear display area when closing manually
        generateLicenseBtn.style.display = 'inline-block';
        generateLicenseBtn.disabled = false;
        generateLicenseBtn.textContent = 'Validate & Prepare';
        downloadLicenseBtn.style.display = 'none';
        licenseDisplayArea.style.display = 'none'; // Hide display area
        licenseTextOutput.value = ''; // Clear text
        licenseForm.reset(); // Reset the form fields
        licenseFormError.style.display = 'none'; // Hide errors
        console.log("Closed License Modal");
    };
    function closePurchaseModal() {
        purchaseOptionsModal.classList.remove('is-visible');
        checkAndRemoveBodyClass();
        console.log("Closed Purchase Modal");
    };

    // Helper to remove modal-open class only if no modals are visible
    function checkAndRemoveBodyClass() {
        if (!portfolioModal.classList.contains('is-visible') &&
            !licenseApplyModal.classList.contains('is-visible') &&
            !purchaseOptionsModal.classList.contains('is-visible')) {
            document.body.classList.remove('modal-open');
            console.log("Removed modal-open body class");
        }
    }


    // --- Handle Free License Form Submission (Step 1: Validate & Prepare) - Merged from System ---
    licenseForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission
        console.log("License form submitted (Step 1 validation).");
        licenseFormError.style.display = 'none'; // Hide previous errors
        licenseDisplayArea.style.display = 'none'; // Ensure display area is hidden initially

        // --- Validation ---
        const beatTitle = licenseBeatTitleInput.value.trim();
        const userName = licenseUserNameInput.value.trim();
        const signature = licenseSignatureInput.value.trim();
        const agreed = licenseAgreementCheck.checked;

        let errors = [];
        if (!beatTitle) errors.push("Beat Title is required.");
        if (!userName) errors.push("Your Full Name is required.");
        if (!signature) errors.push("Digital Signature is required.");
        if (signature && signature.toLowerCase() !== userName.toLowerCase()) {
            errors.push("Signature must match your full name.");
        }
        if (!agreed) errors.push("You must agree to the license terms.");

        if (errors.length > 0) {
            licenseFormError.innerHTML = errors.join('<br>'); // Display all errors
            licenseFormError.style.display = 'block';
            console.warn("License form validation failed:", errors);
            return; // Stop if validation fails
        }
        // --- End Validation ---

        // --- If Valid: Show "Preparing" state and switch buttons ---
        console.log("License form validation successful.");
        generateLicenseBtn.textContent = 'Preparing...';
        generateLicenseBtn.disabled = true;

        // Simulate short delay then show next button (doesn't generate yet)
        setTimeout(() => {
            generateLicenseBtn.style.display = 'none';        // Hide Step 1 button
            downloadLicenseBtn.style.display = 'inline-block'; // Show Step 2 button
            console.log("Step 1 complete, ready for Step 2 (Generate & Download).");
        }, 500); // Short delay for visual feedback
    });


    // --- Handle "Generate & Download License" Button Click (Step 2) - Merged from System ---
    downloadLicenseBtn.addEventListener('click', () => {
        console.log("Step 2 button clicked: Generate & Download License.");
        // Get current form values again to be safe
        const beatTitle = licenseBeatTitleInput.value.trim();
        const userName = licenseUserNameInput.value.trim();
        const signature = licenseSignatureInput.value.trim();
        const currentDate = new Date().toLocaleDateString(); // Format date based on locale

        // Basic check again just in case
        if (!beatTitle || !userName || !signature) {
            licenseFormError.textContent = 'Error: Form data missing. Please refill.';
            licenseFormError.style.display = 'block';
            // Reset to step 1
            generateLicenseBtn.style.display = 'inline-block';
            generateLicenseBtn.disabled = false;
            generateLicenseBtn.textContent = 'Validate & Prepare';
            downloadLicenseBtn.style.display = 'none';
            return;
        }

        // --- Generate the license content ---
        let generatedLicense = licenseTemplate
            .replace('{{BEAT_TITLE}}', beatTitle)
            .replace(/\{\{USER_NAME\}\}/g, userName) // Use global replace
            .replace('{{SIGNATURE}}', signature)
            .replace('{{DATE}}', currentDate);
        console.log("License text generated.");

        // --- 1. Display the license text in the textarea ---
        licenseTextOutput.value = generatedLicense; // Set textarea content
        licenseDisplayArea.style.display = 'block'; // Show the display area

        // Scroll the modal content down to reveal the new area
        const modalContent = licenseApplyModal.querySelector('.modal-content');
        if (modalContent) {
             modalContent.scrollTo({ top: modalContent.scrollHeight, behavior: 'smooth' });
        }

        // --- 2. Attempt the file download ---
        try {
            const blob = new Blob([generatedLicense], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const tempLink = document.createElement('a');

            // Create a safe filename
            const safeBeatTitle = beatTitle.replace(/[^a-z0-9_\-\.]/gi, '_').replace(/_+/g, '_');
            const safeUserName = userName.replace(/[^a-z0-9_\-]/gi, '_').replace(/_+/g, '_');
            tempLink.download = `Free_License_${safeBeatTitle}_${safeUserName}.txt`;

            tempLink.href = url;
            tempLink.style.display = 'none'; // Hide the link
            document.body.appendChild(tempLink); // Add link to body
            tempLink.click(); // Programmatically click the link
            document.body.removeChild(tempLink); // Remove link
            URL.revokeObjectURL(url); // Release memory
            console.log("License file download attempt initiated.");
            downloadLicenseBtn.textContent = 'Download Again'; // Update button text
        } catch (error) {
            console.error("License file download failed:", error);
            licenseFormError.textContent = "Download failed. Please copy the text below.";
            licenseFormError.style.display = 'block';
            downloadLicenseBtn.textContent = 'Download Failed'; // Update button text
        }

        // --- 3. Keep the modal open ---
        // User can now view/copy the text and close manually.
    });

    // --- Handle "Copy License Text" Button Click ---
    copyLicenseBtn.addEventListener('click', () => {
        if (!licenseTextOutput.value) {
            console.warn("Copy button clicked, but no text to copy.");
            return;
        }
        navigator.clipboard.writeText(licenseTextOutput.value).then(() => {
            console.log('License text copied to clipboard.');
            const originalText = copyLicenseBtn.textContent;
            copyLicenseBtn.textContent = 'Copied!';
            copyLicenseBtn.disabled = true;
            setTimeout(() => {
                copyLicenseBtn.textContent = originalText;
                copyLicenseBtn.disabled = false;
            }, 1500); // Reset after 1.5 seconds
        }).catch(err => {
            console.error('Clipboard copy failed: ', err);
            // Fallback for older browsers or security restrictions
            try {
                licenseTextOutput.select(); // Select the text
                document.execCommand('copy'); // Try legacy copy command
                window.getSelection().removeAllRanges(); // Deselect
                const originalText = copyLicenseBtn.textContent;
                copyLicenseBtn.textContent = 'Copied! (Legacy)';
                copyLicenseBtn.disabled = true;
                setTimeout(() => { copyLicenseBtn.textContent = originalText; copyLicenseBtn.disabled = false; }, 2000);
            } catch (legacyErr) {
                console.error('Legacy clipboard copy also failed: ', legacyErr);
                alert('Could not copy text automatically. Please select and copy the text manually.');
            }
        });
    });

    // --- Global Escape Key Listener to Close Topmost Modal ---
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            console.log("Escape key pressed.");
            // Close modals in reverse order of likely appearance
            if (purchaseOptionsModal.classList.contains('is-visible')) {
                closePurchaseModal();
            } else if (licenseApplyModal.classList.contains('is-visible')) {
                closeLicenseModal();
            } else if (portfolioModal.classList.contains('is-visible')) {
                closePortfolioModal();
            }
        }
    });

    // Add event listener for play button
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('instagram-play-button')) {
            const wrapper = event.target.closest('.instagram-embed-wrapper');
            const iframe = wrapper.querySelector('.instagram-iframe');
            if (iframe) {
                iframe.style.pointerEvents = 'auto'; // Enable interaction with the iframe
                event.target.style.display = 'none'; // Hide the play button
                console.log('Instagram video play button clicked.');
            }
        }
    });

}); // End of DOMContentLoaded listener

// END OF FILE script.js