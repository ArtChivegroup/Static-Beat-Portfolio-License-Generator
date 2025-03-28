document.addEventListener('DOMContentLoaded', () => {
    // --- Select Essential Elements ---
    const portfolioGrid = document.querySelector('.portfolio-grid');

    // Portfolio Modal Elements
    const portfolioModal = document.getElementById('portfolio-modal');
    const portfolioModalOverlay = portfolioModal.querySelector('.modal-overlay');
    const portfolioModalCloseBtn = portfolioModal.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const modalDescription = document.getElementById('modal-description');
    const modalMeta = document.getElementById('modal-meta');
    const modalLink = document.getElementById('modal-link');
    const applyLicenseBtnPortfolio = document.getElementById('apply-license-btn');
    const purchaseLicenseBtnPortfolio = document.getElementById('purchase-license-btn');

    // License Application Modal (Free) Elements
    const licenseApplyModal = document.getElementById('license-apply-modal');
    const licenseModalOverlay = licenseApplyModal.querySelector('.modal-overlay');
    const licenseModalCloseBtn = licenseApplyModal.querySelector('.modal-close');
    const licenseForm = document.getElementById('license-form');
    const licenseBeatTitleInput = document.getElementById('license-beat-title');
    const licenseUserNameInput = document.getElementById('license-user-name');
    const licenseSignatureInput = document.getElementById('license-signature');
    const licenseAgreementCheck = document.getElementById('license-agreement-check');
    const licenseFormError = document.getElementById('license-form-error');
    const viewTermsLink = document.getElementById('view-license-terms-link');
    const fullTermsDiv = document.getElementById('license-terms-full');
    const generateLicenseBtn = document.getElementById('generate-license-btn');
    const downloadLicenseBtn = document.getElementById('download-license-btn');
    const licenseDisplayArea = document.getElementById('license-display-area');
    const licenseTextOutput = document.getElementById('license-text-output');

    // Purchase Options Modal Elements
    const purchaseOptionsModal = document.getElementById('purchase-options-modal');
    const purchaseModalOverlay = purchaseOptionsModal.querySelector('.modal-overlay');
    const purchaseModalCloseBtn = purchaseOptionsModal.querySelector('.modal-close');
    const purchaseModalTitle = document.getElementById('purchase-modal-title');
    const purchaseBeatInfo = document.getElementById('purchase-beat-info');

    // Home Page Buttons
    const homeApplyLicenseBtn = document.getElementById('home-apply-license-btn');
    const homePurchaseLicenseBtn = document.getElementById('home-purchase-license-btn');

    // Basic check for essential elements
    if (!portfolioGrid || !portfolioModal || !applyLicenseBtnPortfolio || !purchaseLicenseBtnPortfolio ||
        !licenseApplyModal || !licenseForm || !homeApplyLicenseBtn || !homePurchaseLicenseBtn ||
        !purchaseOptionsModal || !purchaseModalCloseBtn || !purchaseModalOverlay || !modalVideoContainer ||
        !generateLicenseBtn || !downloadLicenseBtn || !licenseDisplayArea || !licenseTextOutput ||
        !fullTermsDiv || !viewTermsLink || !licenseFormError) {
        console.error("Essential UI elements not found! Check IDs in index.html and script.js.");
        // Optional: Display a user-facing error message on the page
        // document.body.innerHTML = '<p style="color: red; padding: 20px;">Error: Page could not load correctly. Essential elements missing.</p>';
        return; // Stop script execution if critical elements are missing
    }

    // --- License Template (Plain Text) ---
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
            .replace('{{BEAT_TITLE}}', '[Beat Title]')
            .replace(/\{\{USER_NAME\}\}/g, '[Your Name]')
            .replace('{{SIGNATURE}}', '[Your Signature]')
            .replace('{{DATE}}', '[Date]');
        fullTermsDiv.innerText = displayTerms;
    }

    // --- Gumroad URL & Contact Email ---
    const GUMROAD_URL = "https://dimasalmactar.gumroad.com/l/utalaj?wanted=true";
    const EXCLUSIVE_CONTACT_EMAIL = "dimasalmactar12@gmail.com";

    // --- Helper Function to Open Free License Modal ---
    const openLicenseModal = (beatTitle = null) => {
        licenseForm.reset(); // Reset form fields
        licenseFormError.style.display = 'none'; // Hide errors
        fullTermsDiv.style.display = 'none'; // Hide full terms

        // Reset button states
        generateLicenseBtn.style.display = 'inline-block'; // Show generate button
        generateLicenseBtn.disabled = false;               // Enable it
        generateLicenseBtn.textContent = 'Generate License'; // Reset text
        downloadLicenseBtn.style.display = 'none';         // Hide view/download button
        downloadLicenseBtn.textContent = 'View & Download License'; // Reset text

        // Hide and clear the license display area
        licenseDisplayArea.style.display = 'none';
        licenseTextOutput.value = '';

        // Pre-fill beat title if provided
        if (beatTitle) {
            licenseBeatTitleInput.value = beatTitle;
            licenseBeatTitleInput.readOnly = true;
            licenseBeatTitleInput.placeholder = "";
        } else {
            licenseBeatTitleInput.value = '';
            licenseBeatTitleInput.readOnly = false;
            licenseBeatTitleInput.placeholder = "Enter the exact beat title";
        }

        // Show the modal
        licenseApplyModal.classList.add('is-visible');
        document.body.classList.add('modal-open'); // Prevent body scrolling
        const content = licenseApplyModal.querySelector('.modal-content');
        if (content) content.scrollTop = 0; // Scroll modal to top
    };

    // --- Helper Function to Open Purchase Options Modal ---
    const openPurchaseModal = (beatTitle = null) => {
        if (beatTitle) {
            purchaseModalTitle.textContent = "Purchase License";
            purchaseBeatInfo.textContent = `Beat: ${beatTitle}`;
            purchaseBeatInfo.style.display = 'block';
            purchaseOptionsModal.dataset.beatTitle = beatTitle; // Store beat title for later use
        } else {
            purchaseModalTitle.textContent = "Choose Your Beat License";
            purchaseBeatInfo.style.display = 'none';
             delete purchaseOptionsModal.dataset.beatTitle;
        }
        // Show the modal
        purchaseOptionsModal.classList.add('is-visible');
        document.body.classList.add('modal-open');
        const content = purchaseOptionsModal.querySelector('.modal-content');
        if (content) content.scrollTop = 0;
    };

    // --- Function to Open Gumroad Link / Contact (Attached to window for onclick) ---
    window.openGumroad = function(licenseType) {
        console.log(`Gumroad/Contact selected: ${licenseType}`);
        let url = GUMROAD_URL; // Default to standard/premium Gumroad link
        const beatTitle = purchaseOptionsModal.dataset.beatTitle || "General Inquiry"; // Get beat title if available

        if (licenseType === 'exclusive') {
            // Create mailto link for exclusive inquiries
             url = `mailto:${EXCLUSIVE_CONTACT_EMAIL}?subject=Exclusive License Inquiry: ${encodeURIComponent(beatTitle)}`;
             console.log("Opening mailto for exclusive:", url);
             window.location.href = url;
             // Optionally close the modal after opening mail client
             // closePurchaseModal();
        } else {
             // For standard/premium, redirect to Gumroad
             // You could potentially add parameters if Gumroad supports them, e.g., ?variant=premium
             console.log("Redirecting to Gumroad:", url);
             window.location.href = url; // Or use window.open(url, '_blank');
             // Optionally close the modal after redirecting
             // closePurchaseModal();
        }
    }

    // --- Open Portfolio Modal ---
    portfolioGrid.addEventListener('click', (event) => {
        const gridItem = event.target.closest('.grid-item');
        if (!gridItem) return; // Clicked outside an item

        // --- Get Data Attributes from Clicked Item ---
        const title = gridItem.dataset.title || 'Project Details';
        const type = gridItem.dataset.type;
        const videoId = gridItem.dataset.videoId;
        const embedUrl = gridItem.dataset.embedUrl;
        const videoHeight = gridItem.dataset.height;
        const link = gridItem.dataset.link;
        const linkText = gridItem.dataset.linkText || 'View Source';
        const isBeat = gridItem.dataset.isBeat === 'true';
        const description = gridItem.dataset.description || '';
        const meta = gridItem.dataset.meta || '';

        console.log('Clicked Item Data:', { title, type, videoId, embedUrl, videoHeight, link, isBeat });

        // --- Populate Modal Text Details ---
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalMeta.textContent = meta;
        modalLink.href = link || '#';
        modalLink.textContent = linkText;
        modalLink.style.display = (link && link !== '#') ? 'inline-block' : 'none';

        // --- Show/Hide License Buttons based on 'data-is-beat' ---
        if (isBeat) {
            applyLicenseBtnPortfolio.style.display = 'inline-block';
            purchaseLicenseBtnPortfolio.style.display = 'inline-block';
            // Store the beat title on the buttons for later use
            applyLicenseBtnPortfolio.dataset.beatTitle = title;
            purchaseLicenseBtnPortfolio.dataset.beatTitle = title;
        } else {
            applyLicenseBtnPortfolio.style.display = 'none';
            purchaseLicenseBtnPortfolio.style.display = 'none';
            delete applyLicenseBtnPortfolio.dataset.beatTitle;
            delete purchaseLicenseBtnPortfolio.dataset.beatTitle;
        }

        // --- Clear previous video/embed and reset container ---
        modalVideoContainer.innerHTML = '';
        modalVideoContainer.className = 'modal-video-container'; // Reset classes
        modalVideoContainer.style.height = ''; // Reset inline height
        modalVideoContainer.style.paddingBottom = ''; // Reset padding
        modalVideoContainer.style.display = 'none'; // Ensure hidden initially

        let embedHtml = '';
        let needsContainerDisplayBlock = false; // Flag to show container

        // --- Create Embed HTML Based on Type ---
         if (type === 'youtube' && videoId) {
            console.log('Creating YouTube embed');
            embedHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
            modalVideoContainer.classList.add('aspect-16-9'); // Use CSS for aspect ratio
            needsContainerDisplayBlock = true;
        } else if ((type === 'spotify' || type === 'soundcloud') && embedUrl) {
            console.log(`Creating ${type} embed`);
            let defaultHeight = type === 'spotify' ? (videoHeight || '152') : (videoHeight || '166'); // Use data-height or default
            embedHtml = `<iframe style="border-radius:12px;" src="${embedUrl}" width="100%" height="${defaultHeight}" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
            modalVideoContainer.classList.add('fixed-height');
            modalVideoContainer.style.height = `${defaultHeight}px`; // Set explicit height
            needsContainerDisplayBlock = true;
        } else if (type === 'instagram' && link) {
            console.log('Creating Instagram embed');
            // Basic Instagram embed via iframe (requires server-side proxy for reliable display usually)
            // Note: Instagram embedding can be unreliable due to their restrictions.
            try {
                let instagramEmbedUrl = link.trim().split('?')[0]; // Remove query params
                if (!instagramEmbedUrl.endsWith('/')) instagramEmbedUrl += '/';
                instagramEmbedUrl += 'embed/'; // Append /embed/
                embedHtml = `<iframe src="${instagramEmbedUrl}" style="border:none; overflow:hidden; border-radius: 12px;" scrolling="no" frameborder="0" allowTransparency="true" allowfullscreen="true" title="${title} Instagram Post"></iframe>`;
                modalVideoContainer.classList.add('aspect-1-1'); // Instagram posts are often square
                needsContainerDisplayBlock = true;
                console.log("Attempting Instagram Iframe URL:", instagramEmbedUrl);
            } catch (e) {
                console.error("Error constructing Instagram iframe URL:", e);
                embedHtml = `<p style="text-align:center; color: var(--text-secondary); padding: 20px;">Could not create Instagram embed. <a href="${link}" target="_blank" rel="noopener noreferrer" style="color: var(--brand-orange);">View on Instagram</a></p>`;
                needsContainerDisplayBlock = true;
            }
        } else {
             console.log(`No valid embed type found or data missing for type: ${type}`);
             // Optionally display the image from the grid item if no embed is possible
             // const imgSrc = gridItem.querySelector('img')?.src;
             // if (imgSrc) {
             //     embedHtml = `<img src="${imgSrc}" alt="${title}" style="display:block; max-width:100%; height:auto; border-radius: 12px;">`;
             //     needsContainerDisplayBlock = true;
             // }
        }

        // --- Display Embed Container Logic ---
        if (needsContainerDisplayBlock) {
            console.log('Setting video container display to block and injecting HTML');
            modalVideoContainer.style.display = 'block'; // Make container visible
            modalVideoContainer.innerHTML = embedHtml;   // Add the embed code
        } else {
            console.log('No embed content generated, keeping container hidden.');
            modalVideoContainer.style.display = 'none'; // Keep hidden
        }

        // --- Show Portfolio Modal ---
        portfolioModal.classList.add('is-visible');
        document.body.classList.add('modal-open');
        const content = portfolioModal.querySelector('.modal-content');
        if (content) content.scrollTop = 0; // Scroll modal to top
    });


    // --- Event Listeners for Modal Buttons ---
    // Apply Free License (from Portfolio Modal)
    applyLicenseBtnPortfolio.addEventListener('click', () => {
        const beatTitle = applyLicenseBtnPortfolio.dataset.beatTitle;
        if (beatTitle) {
            openLicenseModal(beatTitle); // Open free license modal with title
        }
    });
    // Purchase License (from Portfolio Modal)
    purchaseLicenseBtnPortfolio.addEventListener('click', () => {
        const beatTitle = purchaseLicenseBtnPortfolio.dataset.beatTitle;
        if (beatTitle) {
            openPurchaseModal(beatTitle); // Open purchase modal with title
        }
    });
    // Apply Free License (from Home Page)
    homeApplyLicenseBtn.addEventListener('click', () => {
        openLicenseModal(); // Open free license modal without specific title
    });
    // Purchase License (from Home Page)
    homePurchaseLicenseBtn.addEventListener('click', () => {
        openPurchaseModal(); // Open purchase modal without specific title
    });

    // --- Close Modals Functions ---
    const closePortfolioModal = () => {
        portfolioModal.classList.remove('is-visible');
        // Remove modal-open class only if no other modals are visible
        if (!licenseApplyModal.classList.contains('is-visible') && !purchaseOptionsModal.classList.contains('is-visible')) {
            document.body.classList.remove('modal-open');
        }
        // Stop video/audio playback by clearing the container
        modalVideoContainer.innerHTML = '';
        modalVideoContainer.style.display = 'none'; // Ensure hidden on close
    };

    const closeLicenseModal = () => {
        licenseApplyModal.classList.remove('is-visible');
        // Remove modal-open class only if no other modals are visible
        if (!portfolioModal.classList.contains('is-visible') && !purchaseOptionsModal.classList.contains('is-visible')) {
            document.body.classList.remove('modal-open');
        }
        // Reset button states and clear display area when closing manually
        generateLicenseBtn.style.display = 'inline-block';
        generateLicenseBtn.disabled = false;
        generateLicenseBtn.textContent = 'Generate License';
        downloadLicenseBtn.style.display = 'none';
        licenseDisplayArea.style.display = 'none'; // Hide display area
        licenseTextOutput.value = ''; // Clear text
    };

    const closePurchaseModal = () => {
        purchaseOptionsModal.classList.remove('is-visible');
        // Remove modal-open class only if no other modals are visible
        if (!portfolioModal.classList.contains('is-visible') && !licenseApplyModal.classList.contains('is-visible')) {
            document.body.classList.remove('modal-open');
        }
    };

    // --- Event Listeners for Closing Modals ---
    portfolioModalCloseBtn.addEventListener('click', closePortfolioModal);
    portfolioModalOverlay.addEventListener('click', closePortfolioModal);
    licenseModalCloseBtn.addEventListener('click', closeLicenseModal);
    licenseModalOverlay.addEventListener('click', closeLicenseModal);
    purchaseModalCloseBtn.addEventListener('click', closePurchaseModal);
    purchaseModalOverlay.addEventListener('click', closePurchaseModal);

    // --- Show/Hide Full Free License Terms ---
    viewTermsLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        const isVisible = fullTermsDiv.style.display === 'block';
        fullTermsDiv.style.display = isVisible ? 'none' : 'block'; // Toggle display
    });

    // --- Handle Free License Form Submission (Step 1: Validate & Prepare) ---
    licenseForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission
        licenseFormError.style.display = 'none'; // Hide previous errors
        licenseDisplayArea.style.display = 'none'; // Ensure display area is hidden

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
            return; // Stop if validation fails
        }
        // --- End Validation ---

        // --- Show "Generating" state and switch buttons ---
        generateLicenseBtn.textContent = 'Generating...';
        generateLicenseBtn.disabled = true;

        // Simulate generation time (e.g., 1 second)
        setTimeout(() => {
            generateLicenseBtn.style.display = 'none';    // Hide Generate button
            downloadLicenseBtn.style.display = 'inline-block'; // Show View & Download button
            // The actual generation happens when the user clicks the next button
        }, 1000); // Adjust delay as needed
    });

    // --- Handle "View & Download" Button Click (Step 2: Generate, Display, Attempt Download) ---
    downloadLicenseBtn.addEventListener('click', () => {
        // Get current form values
        const beatTitle = licenseBeatTitleInput.value.trim();
        const userName = licenseUserNameInput.value.trim();
        const signature = licenseSignatureInput.value.trim();
        const currentDate = new Date().toLocaleDateString(); // Format date based on locale

        // Basic check again just in case
        if (!beatTitle || !userName || !signature) {
            alert('Error: Form data seems to be missing. Please close and try again.');
             closeLicenseModal(); // Close and reset state
            return;
        }

        // --- Generate the license content ---
        let generatedLicense = licenseTemplate
            .replace('{{BEAT_TITLE}}', beatTitle)
            .replace(/\{\{USER_NAME\}\}/g, userName) // Use global replace for name
            .replace('{{SIGNATURE}}', signature)
            .replace('{{DATE}}', currentDate);

        // --- 1. Display the license text in the textarea ---
        licenseTextOutput.value = generatedLicense; // Set textarea content
        licenseDisplayArea.style.display = 'block'; // Show the display area

        // Scroll the modal content down slightly to help reveal the new area
        const modalContent = licenseApplyModal.querySelector('.modal-content');
        if(modalContent) {
            // Smooth scroll if supported, otherwise jump
             if ('scrollBehavior' in document.documentElement.style) {
                 modalContent.scrollTo({ top: modalContent.scrollHeight, behavior: 'smooth' });
             } else {
                 modalContent.scrollTop = modalContent.scrollHeight;
             }
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
            tempLink.click(); // Programmatically click the link to trigger download
            document.body.removeChild(tempLink); // Remove link from body
            URL.revokeObjectURL(url); // Release the object URL
             console.log("Download attempt initiated.");
        } catch (error) {
            console.error("Download failed:", error);
            // Optionally alert the user or log error, but the text is visible anyway.
            // alert("File download attempt failed. Please copy the text manually.");
        }

        // --- 3. Keep the modal open ---
        // User can now view/copy the text and close the modal manually when done.
    });


    // --- Global Escape Key Listener to Close Topmost Modal ---
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
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

}); // End of DOMContentLoaded listener