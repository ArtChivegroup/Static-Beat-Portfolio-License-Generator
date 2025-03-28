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
        !purchaseOptionsModal || !purchaseModalCloseBtn || !purchaseModalOverlay || !modalVideoContainer) { // Added modalVideoContainer check
        console.error("Essential modal, grid, button, or video container elements not found! Check IDs.");
        return;
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
    if (fullTermsDiv) {
         let displayTerms = licenseTemplate
            .replace('{{BEAT_TITLE}}', '[Beat Title]')
            .replace(/\{\{USER_NAME\}\}/g, '[Your Name]')
            .replace('{{SIGNATURE}}', '[Your Signature]')
            .replace('{{DATE}}', '[Date]');
        fullTermsDiv.innerText = displayTerms;
    }

    // --- Gumroad URL ---
    const GUMROAD_URL = "https://dimasalmactar.gumroad.com/l/utalaj?wanted=true";
    const EXCLUSIVE_CONTACT_EMAIL = "dimasalmactar12@gmail.com"; // Your contact email

    // --- Helper Function to Open Free License Modal ---
    const openLicenseModal = (beatTitle = null) => {
        licenseForm.reset();
        licenseFormError.style.display = 'none';
        fullTermsDiv.style.display = 'none';
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
        if (content) content.scrollTop = 0;
    };

    // --- Helper Function to Open Purchase Options Modal ---
    const openPurchaseModal = (beatTitle = null) => {
        if (beatTitle) {
            purchaseModalTitle.textContent = "Purchase License";
            purchaseBeatInfo.textContent = `Beat: ${beatTitle}`;
            purchaseBeatInfo.style.display = 'block';
            purchaseOptionsModal.dataset.beatTitle = beatTitle;
        } else {
            purchaseModalTitle.textContent = "Choose Your Beat License";
            purchaseBeatInfo.style.display = 'none';
             delete purchaseOptionsModal.dataset.beatTitle;
        }
        purchaseOptionsModal.classList.add('is-visible');
        document.body.classList.add('modal-open');
         const content = purchaseOptionsModal.querySelector('.modal-content');
        if (content) content.scrollTop = 0;
    };

    // --- Function to Open Gumroad Link / Contact ---
    window.openGumroad = function(licenseType) {
        console.log(`Gumroad/Contact selected: ${licenseType}`);
        let url = GUMROAD_URL; // Default to standard/premium link
        const beatTitle = purchaseOptionsModal.dataset.beatTitle || "General Inquiry"; // Get beat title if available

        if (licenseType === 'exclusive') {
            // Option 1: Mailto link
             url = `mailto:${EXCLUSIVE_CONTACT_EMAIL}?subject=Exclusive License Inquiry: ${encodeURIComponent(beatTitle)}`;
             console.log("Opening mailto for exclusive:", url);
             window.location.href = url;
             // Option 2: Just close modal and rely on user contacting via footer/other means
             // console.log("Exclusive selected. Please contact via email.");
             // closePurchaseModal();
             // return; // Stop execution if only closing modal
        } else {
             // For standard/premium, potentially add info to URL if Gumroad supports it
             // Example: Add license type as variant or query param (check Gumroad docs)
             // url += `?variant=${licenseType}`; // Or similar
             // url += `&beat=${encodeURIComponent(beatTitle)}` // If useful
             console.log("Redirecting to Gumroad:", url);
             window.location.href = url; // Redirect for standard/premium
             // Alternative: window.open(url, '_blank');
        }
    }

    // --- Open Portfolio Modal ---
    portfolioGrid.addEventListener('click', (event) => {
        const gridItem = event.target.closest('.grid-item');
        if (!gridItem) return;

        // Get data
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

        // Populate modal text details
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalMeta.textContent = meta;
        modalLink.href = link || '#'; // Ensure link has a value
        modalLink.textContent = linkText;
        modalLink.style.display = (link && link !== '#') ? 'inline-block' : 'none'; // Hide if no valid link

        // Show/Hide License Buttons
        if (isBeat) {
            applyLicenseBtnPortfolio.style.display = 'inline-block';
            purchaseLicenseBtnPortfolio.style.display = 'inline-block';
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
        modalVideoContainer.className = 'modal-video-container';
        modalVideoContainer.style.height = '';
        modalVideoContainer.style.paddingBottom = '';
        modalVideoContainer.style.display = 'none'; // Ensure hidden initially

        let embedHtml = '';
        let needsContainerDisplayBlock = false;

        // --- Create Embed Based on Type ---
         if (type === 'youtube' && videoId) {
            console.log('Creating YouTube embed');
            embedHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
            modalVideoContainer.classList.add('aspect-16-9');
            needsContainerDisplayBlock = true;
        } else if ((type === 'spotify' || type === 'soundcloud') && embedUrl) {
            console.log(`Creating ${type} embed`);
            let defaultHeight = type === 'spotify' ? (videoHeight || '152') : (videoHeight || '166');
            embedHtml = `<iframe style="border-radius:12px;" src="${embedUrl}" width="100%" height="${defaultHeight}" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
            modalVideoContainer.classList.add('fixed-height');
            modalVideoContainer.style.height = `${defaultHeight}px`; // Set explicit height
            needsContainerDisplayBlock = true;
        } else if (type === 'instagram' && link) {
            console.log('Creating Instagram embed');
            try {
                let instagramEmbedUrl = link.trim().split('?')[0];
                if (!instagramEmbedUrl.endsWith('/')) instagramEmbedUrl += '/';
                instagramEmbedUrl += 'embed/';
                embedHtml = `<iframe src="${instagramEmbedUrl}" style="border:none; overflow:hidden; border-radius: 12px;" scrolling="no" frameborder="0" allowTransparency="true" allowfullscreen="true" title="${title} Instagram Post"></iframe>`;
                modalVideoContainer.classList.add('aspect-1-1');
                needsContainerDisplayBlock = true;
                console.log("Instagram Iframe URL:", instagramEmbedUrl);
            } catch (e) {
                console.error("Error constructing Instagram iframe URL:", e);
                embedHtml = `<p style="text-align:center; color: var(--text-secondary); padding: 20px;">Could not create Instagram embed.</p>`;
                needsContainerDisplayBlock = true;
            }
        } else {
             console.log(`No valid embed type found or data missing for type: ${type}`);
        }

        // --- Display Container Logic ---
        if (needsContainerDisplayBlock) {
            console.log('Setting video container display to block and injecting HTML');
            modalVideoContainer.style.display = 'block'; // <<< KEY LINE TO SHOW CONTAINER
            modalVideoContainer.innerHTML = embedHtml;
        } else {
            console.log('No embed content generated, keeping container hidden.');
            modalVideoContainer.style.display = 'none'; // Keep hidden
        }

        // Show Portfolio Modal
        portfolioModal.classList.add('is-visible');
        document.body.classList.add('modal-open');
        const content = portfolioModal.querySelector('.modal-content');
        if (content) content.scrollTop = 0;
    });


    // --- Event Listeners for Buttons ---
    applyLicenseBtnPortfolio.addEventListener('click', () => { const beatTitle = applyLicenseBtnPortfolio.dataset.beatTitle; if (beatTitle) openLicenseModal(beatTitle); });
    purchaseLicenseBtnPortfolio.addEventListener('click', () => { const beatTitle = purchaseLicenseBtnPortfolio.dataset.beatTitle; if (beatTitle) openPurchaseModal(beatTitle); });
    homeApplyLicenseBtn.addEventListener('click', () => { openLicenseModal(); });
    homePurchaseLicenseBtn.addEventListener('click', () => { openPurchaseModal(); });

    // --- Close Modals Functions ---
    const closePortfolioModal = () => {
        portfolioModal.classList.remove('is-visible');
        if (!licenseApplyModal.classList.contains('is-visible') && !purchaseOptionsModal.classList.contains('is-visible')) { document.body.classList.remove('modal-open'); }
        modalVideoContainer.innerHTML = '';
        modalVideoContainer.style.height = ''; modalVideoContainer.style.paddingBottom = ''; modalVideoContainer.className = 'modal-video-container'; modalVideoContainer.style.display = 'none'; // Ensure hidden on close
    };
    const closeLicenseModal = () => {
        licenseApplyModal.classList.remove('is-visible');
        if (!portfolioModal.classList.contains('is-visible') && !purchaseOptionsModal.classList.contains('is-visible')) { document.body.classList.remove('modal-open'); }
    };
    const closePurchaseModal = () => {
        purchaseOptionsModal.classList.remove('is-visible');
         if (!portfolioModal.classList.contains('is-visible') && !licenseApplyModal.classList.contains('is-visible')) { document.body.classList.remove('modal-open'); }
    };

    // --- Event Listeners for Closing Modals ---
    portfolioModalCloseBtn.addEventListener('click', closePortfolioModal);
    portfolioModalOverlay.addEventListener('click', closePortfolioModal);
    licenseModalCloseBtn.addEventListener('click', closeLicenseModal);
    licenseModalOverlay.addEventListener('click', closeLicenseModal);
    purchaseModalCloseBtn.addEventListener('click', closePurchaseModal);
    purchaseModalOverlay.addEventListener('click', closePurchaseModal);

    // --- Show/Hide Full Free License Terms ---
    viewTermsLink.addEventListener('click', (e) => { e.preventDefault(); const isVisible = fullTermsDiv.style.display === 'block'; fullTermsDiv.style.display = isVisible ? 'none' : 'block'; });

    // --- Handle Free License Form Submission ---
    licenseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        licenseFormError.style.display = 'none';
        const beatTitle = licenseBeatTitleInput.value.trim();
        const userName = licenseUserNameInput.value.trim();
        const signature = licenseSignatureInput.value.trim();
        const agreed = licenseAgreementCheck.checked;

        if (!beatTitle || !userName || !signature) { licenseFormError.textContent = "Please fill in all fields."; licenseFormError.style.display = 'block'; return; }
        if (signature.toLowerCase() !== userName.toLowerCase()) { licenseFormError.textContent = "Signature must match your full name."; licenseFormError.style.display = 'block'; return; }
        if (!agreed) { licenseFormError.textContent = "You must agree to the license terms."; licenseFormError.style.display = 'block'; return; }

        const currentDate = new Date().toLocaleDateString();
        let generatedLicense = licenseTemplate.replace('{{BEAT_TITLE}}', beatTitle).replace(/\{\{USER_NAME\}\}/g, userName).replace('{{SIGNATURE}}', signature).replace('{{DATE}}', currentDate);
        const blob = new Blob([generatedLicense], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        const safeBeatTitle = beatTitle.replace(/[^a-z0-9_-]/gi, '_').replace(/_+/g, '_');
        const safeUserName = userName.replace(/[^a-z0-9_-]/gi, '_').replace(/_+/g, '_');
        tempLink.download = `Free_License_${safeBeatTitle}_${safeUserName}.txt`;
        tempLink.href = url; tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click(); document.body.removeChild(tempLink);
        URL.revokeObjectURL(url);
        closeLicenseModal();
    });

    // --- Global Escape Key Listener ---
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (purchaseOptionsModal.classList.contains('is-visible')) { closePurchaseModal(); }
            else if (licenseApplyModal.classList.contains('is-visible')) { closeLicenseModal(); }
            else if (portfolioModal.classList.contains('is-visible')) { closePortfolioModal(); }
        }
    });

}); // End of DOMContentLoaded listener