// START OF FILE: script.js
document.addEventListener('DOMContentLoaded', () => {
    const CONFIG_KEY = 'artchiveConfig'; // Ensure this matches admin.js
    const CONTENT_URL = 'content.json'; // Path to your content file

    // --- DOM Element Selectors ---
    // ... (keep all selectors from the previous version)
    const htmlTitle = document.getElementById('html-title');
    const siteTitleH1 = document.getElementById('site-title');
    const siteSubtitleP = document.getElementById('site-subtitle');
    const siteLogoImg = document.getElementById('site-logo');
    const backgroundVideoIframe = document.getElementById('background-video-iframe');
    const portfolioGridContainer = document.querySelector('.portfolio-grid'); // Select the container
    const swiperWrapper = document.querySelector('.swiper.preview-swiper .swiper-wrapper');
    const footerContentP = document.getElementById('footer-content');
    const kofiContainer = document.getElementById('kofi-widget-container');

    // Modals & Interactive elements
    const portfolioModal = document.getElementById('portfolio-modal');
    const portfolioModalOverlay = portfolioModal?.querySelector('.modal-overlay');
    const portfolioModalCloseBtn = portfolioModal?.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const modalDescription = document.getElementById('modal-description');
    const modalMeta = document.getElementById('modal-meta');
    const modalLink = document.getElementById('modal-link');
    // ***** FIXED Modal Button IDs *****
    const applyLicenseBtnPortfolio = document.getElementById('modal-apply-license-btn');
    const purchaseLicenseBtnPortfolio = document.getElementById('modal-purchase-license-btn');

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
    const downloadLicenseBtn = document.getElementById('download-license-btn');
    const licenseDisplayArea = document.getElementById('license-display-area');
    const licenseTextOutput = document.getElementById('license-text-output');
    const copyLicenseBtn = document.getElementById('copy-license-btn');

    const purchaseOptionsModal = document.getElementById('purchase-options-modal');
    const purchaseModalOverlay = purchaseOptionsModal?.querySelector('.modal-overlay');
    const purchaseModalCloseBtn = purchaseOptionsModal?.querySelector('.modal-close');
    const purchaseModalTitle = document.getElementById('purchase-modal-title');
    const purchaseBeatInfo = document.getElementById('purchase-beat-info');
    const purchaseLicenseContainer = purchaseOptionsModal?.querySelector('.license-container');

    const homeApplyLicenseBtn = document.getElementById('home-apply-license-btn');
    const homePurchaseLicenseBtn = document.getElementById('home-purchase-license-btn');


    // --- State ---
    let config = {}; // Will hold the final config (from storage or JSON)
    let currentLicenseTemplate = '';
    let previewSwiperInstance = null;

    // --- Initialization ---
    async function initializeApp() {
        console.log("Initializing application...");
        try {
            config = await loadConfiguration();

            if (!config || Object.keys(config).length === 0) {
                throw new Error("Failed to load any configuration.");
            }

            console.log("Configuration loaded:", config);

            // Validate essential config parts
            if (!config.siteSettings || !config.projects || !config.license) {
                 throw new Error("Site configuration is incomplete (missing siteSettings, projects, or license).");
            }

            currentLicenseTemplate = config.license?.freeLicenseTemplate || ''; // Safely access template

            // Check for essential DOM elements before proceeding
            if (!areEssentialElementsPresent()) {
                 throw new Error("Page structure is missing essential elements.");
            }
            console.log("Essential elements found. Proceeding with setup...");

            // Apply settings and render content
            applyGeneralSettings();
            renderProjects(); // Render projects first
            initializeSwiper(); // Then initialize Swiper (will be slightly delayed)
            initializeKofiWidget();
            setupEventListeners(); // Setup listeners after elements are potentially rendered
            console.log("Page initialization complete.");

        } catch (error) {
             console.error("CRITICAL INITIALIZATION ERROR:", error);
             displayFatalError(`Initialization failed: ${error.message}`);
        }
    }

    // --- Load Configuration (localStorage or content.json) ---
    async function loadConfiguration() {
        console.log("Attempting to load configuration...");
        let loadedConfig = null;

        // 1. Try localStorage
        try {
            const storedConfigString = localStorage.getItem(CONFIG_KEY);
            if (storedConfigString) {
                console.log("Found configuration in localStorage.");
                loadedConfig = JSON.parse(storedConfigString);
                // Basic validation
                if (typeof loadedConfig === 'object' && loadedConfig !== null && loadedConfig.siteSettings && loadedConfig.projects) {
                    console.log("localStorage configuration appears valid.");
                    // Ensure structure completeness by merging with a minimal default if needed
                    // (this handles cases where new keys were added later)
                    // loadedConfig = mergeDeep(JSON.parse(JSON.stringify(configStructure)), loadedConfig); // Optional deep merge
                } else {
                    console.warn("localStorage configuration is invalid or incomplete. Falling back.");
                    loadedConfig = null;
                    localStorage.removeItem(CONFIG_KEY);
                }
            } else {
                console.log("No configuration found in localStorage.");
            }
        } catch (error) {
            console.error("Error reading/parsing localStorage:", error);
            loadedConfig = null;
        }

        // 2. Fallback to content.json
        if (!loadedConfig) {
            console.log(`Fetching default configuration from ${CONTENT_URL}...`);
            try {
                const response = await fetch(CONTENT_URL + '?t=' + Date.now()); // Cache buster
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                loadedConfig = await response.json();
                console.log("Successfully fetched default configuration from content.json.");
                 // Basic validation of fetched JSON
                 if (typeof loadedConfig !== 'object' || loadedConfig === null || !loadedConfig.siteSettings || !loadedConfig.projects) {
                     console.error("Fetched content.json is invalid or incomplete.");
                     return {}; // Return empty object on structure error
                 }
            } catch (error) {
                console.error(`Failed to fetch or parse ${CONTENT_URL}:`, error);
                return {}; // Return empty object on fetch error
            }
        }

        // Ensure essential arrays/objects exist even if loaded from storage
        loadedConfig.siteSettings = loadedConfig.siteSettings || {};
        loadedConfig.integrations = loadedConfig.integrations || {};
        loadedConfig.license = loadedConfig.license || {};
        loadedConfig.projects = Array.isArray(loadedConfig.projects) ? loadedConfig.projects : [];

        return loadedConfig;
    }

    // --- Check for Essential DOM Elements ---
    function areEssentialElementsPresent() {
        const selectors = [
            '#html-title', '#site-title', '#site-subtitle', '#site-logo',
            '#background-video-iframe', '.portfolio-grid', '.swiper.preview-swiper .swiper-wrapper', '#footer-content',
            '#portfolio-modal', '#modal-title', '#modal-video-container', '#modal-description', '#modal-meta', '#modal-link',
            '#modal-apply-license-btn', '#modal-purchase-license-btn', // Corrected IDs
            '#license-apply-modal', '#purchase-options-modal',
            '#home-apply-license-btn', '#home-purchase-license-btn'
        ];
        const missing = selectors.filter(selector => !document.querySelector(selector));
        if (missing.length > 0) {
            console.error("Missing essential DOM elements:", missing);
            return false;
        }
        return true;
    }

    // --- Display Fatal Error ---
     function displayFatalError(message) {
         const container = document.querySelector('.dashboard-container');
         const errHtml = `<p class="fatal-error-message">${message}<br>Please check the console (F12) for details or contact support.</p>`;
         if (container) {
             container.innerHTML = errHtml;
         } else {
             document.body.innerHTML = errHtml;
         }
         const style = document.createElement('style');
         style.textContent = `
            .fatal-error-message { color: #ffcccc; background: #552222; border: 1px solid #ff8888; padding: 40px; text-align: center; font-size: 1.2em; margin: 50px auto; max-width: 600px; border-radius: 8px; }
         `;
         document.head.appendChild(style);
     }

    // --- Apply General Site Settings ---
    // ... (Keep the function from the previous version - it should be correct)
    function applyGeneralSettings() {
        console.log("Applying general settings...");
        const settings = config.siteSettings || {};

        if (htmlTitle) htmlTitle.textContent = settings.siteTitle || 'Artchive';
        if (siteTitleH1) siteTitleH1.textContent = settings.siteTitle || 'Artchive';
        if (siteSubtitleP) siteSubtitleP.textContent = settings.siteSubtitle || 'Creative Works';

        // Logo
        if (siteLogoImg) {
            if (settings.logoUrl) {
                const logoSrc = `img/${settings.logoUrl}`;
                siteLogoImg.src = logoSrc;
                siteLogoImg.alt = `${settings.siteTitle || 'Site'} Logo`;
                siteLogoImg.style.display = 'inline-block';
                siteLogoImg.onerror = () => { siteLogoImg.style.display = 'none'; console.warn(`Logo image not found: ${logoSrc}`); };
                console.log("Logo applied:", logoSrc);
            } else {
                siteLogoImg.style.display = 'none';
                console.log("No logo configured.");
            }
        }

        // Background Video
        const bgContainer = backgroundVideoIframe?.closest('.video-background-container');
        if (backgroundVideoIframe && bgContainer) {
            if (settings.backgroundVideoId) {
                const videoSrc = `https://www.youtube.com/embed/${settings.backgroundVideoId}?autoplay=1&mute=1&loop=1&playlist=${settings.backgroundVideoId}&controls=0&modestbranding=1&rel=0&playsinline=1&start=35&cc_load_policy=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`;
                backgroundVideoIframe.src = videoSrc;
                bgContainer.style.display = 'block';
                console.log("Background video applied:", videoSrc);
            } else {
                 bgContainer.style.display = 'none'; // Hide container if no video
                 backgroundVideoIframe.src = ''; // Clear src
                console.log("No background video configured.");
            }
        }

        // Footer
        if (footerContentP) {
            const currentYear = new Date().getFullYear();
            footerContentP.textContent = (settings.footerText || '© {YEAR}').replace('{YEAR}', currentYear);
            console.log("Footer text applied.");
        }

        // License Terms Preview
         if (fullTermsDiv) {
             if(currentLicenseTemplate) {
                 let displayTerms = currentLicenseTemplate
                     .replace(/\{\{BEAT_TITLE\}\}/g, '[Beat Title]')
                     .replace(/\{\{USER_NAME\}\}/g, '[Your Name]')
                     .replace(/\{\{SIGNATURE\}\}/g, '[Your Signature]')
                     .replace(/\{\{DATE\}\}/g, '[Date]');
                 fullTermsDiv.style.whiteSpace = 'pre-wrap';
                 fullTermsDiv.style.fontFamily = 'monospace';
                 fullTermsDiv.innerText = displayTerms;
             } else {
                  fullTermsDiv.innerText = "License terms not available.";
             }
         }
         console.log("General settings applied.");
    }


    // --- Render Projects into Grid and Swiper ---
    function renderProjects() {
        console.log("Rendering projects...");
        if (!portfolioGridContainer || !swiperWrapper) {
            console.error("Cannot render projects: Grid or Swiper wrapper not found.");
            return;
        }

        // Clear existing content
        portfolioGridContainer.innerHTML = ''; // Clear grid container
        swiperWrapper.innerHTML = ''; // Clear Swiper wrapper

        if (!config.projects || config.projects.length === 0) {
            console.log("No projects found in configuration to render.");
            const noWorksMsg = document.createElement('p');
            noWorksMsg.textContent = "No works available.";
            noWorksMsg.className = 'loading-message';
            portfolioGridContainer.appendChild(noWorksMsg);

            // Add a placeholder slide for Swiper
            const placeholderSlide = document.createElement('div');
            placeholderSlide.className = 'swiper-slide placeholder';
            placeholderSlide.innerHTML = '<h4>No previews available</h4>';
            swiperWrapper.appendChild(placeholderSlide);
            return;
        }

        console.log(`Found ${config.projects.length} projects. Rendering...`);

        // Sort projects by gridPosition
        const sortedProjects = [...config.projects].sort((a, b) => {
            const posA = (typeof a.gridPosition === 'number' && !isNaN(a.gridPosition)) ? a.gridPosition : Infinity;
            const posB = (typeof b.gridPosition === 'number' && !isNaN(b.gridPosition)) ? a.gridPosition : Infinity;
            return posA - posB;
        });

        let previewCount = 0;
        sortedProjects.forEach((project) => {
            if (!project || !project.id || !project.title) {
                console.warn("Skipping invalid project:", project);
                return;
            }

            const imageUrl = project.imageUrl ? `img/${project.imageUrl}` : 'img/placeholder.png';
            const imageAlt = project.imageAlt || project.title || 'Project thumbnail';

            // Create grid item
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item card-style';
            gridItem.dataset.id = project.id;
            gridItem.innerHTML = `
                <img src="${imageUrl}" alt="${imageAlt}" loading="lazy" onerror="this.onerror=null; this.src='img/placeholder.png';">
                <h4>${project.title}</h4>
            `;
            portfolioGridContainer.appendChild(gridItem);

            // Create Swiper slide if inPreview is true
            if (project.inPreview) {
                previewCount++;
                const swiperSlide = document.createElement('div');
                swiperSlide.className = 'swiper-slide';
                swiperSlide.dataset.id = project.id;
                swiperSlide.innerHTML = `
                    <div class="slide-content">
                        <img src="${imageUrl}" alt="${imageAlt}" loading="lazy" onerror="this.onerror=null; this.src='img/placeholder.png';">
                        <h4>${project.title}</h4>
                    </div>
                `;
                swiperWrapper.appendChild(swiperSlide);
            }
        });

        // Add a placeholder slide if no previews are available
        if (previewCount === 0) {
            const placeholderSlide = document.createElement('div');
            placeholderSlide.className = 'swiper-slide placeholder';
            placeholderSlide.innerHTML = '<h4>No items selected for preview</h4>';
            swiperWrapper.appendChild(placeholderSlide);
        }

        console.log(`Project rendering complete. ${previewCount} items in preview.`);
    }

    // Helper function to safely set dataset attributes
    function setSafeDataset(element, projData) {
         const relevantFields = ['id', 'title', 'meta', 'description', 'type', 'videoId', 'embedUrl', 'link', 'linkText', 'isBeat', 'imageUrl', 'imageAlt'];
         relevantFields.forEach(key => {
            if (projData.hasOwnProperty(key)) {
                 let value = projData[key];
                 if (typeof value === 'boolean') value = String(value);
                 if (value !== null && typeof value !== 'undefined' && value !== '') {
                      const datasetKey = key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
                      element.dataset[datasetKey] = value;
                 }
            }
         });
     }

    // --- Initialize Swiper ---
    function initializeSwiper() {
        // Delay initialization slightly to ensure DOM is fully updated
        setTimeout(() => {
            console.log("Initializing Swiper (delayed)...");
            if (previewSwiperInstance) {
                try { previewSwiperInstance.destroy(true, true); } catch (e) { /* ignore */ }
                previewSwiperInstance = null;
            }

            const swiperContainer = document.querySelector('.swiper.preview-swiper');
            if (!swiperContainer || typeof Swiper === 'undefined' || !swiperWrapper) {
                console.warn("Swiper container, library, or wrapper not available for init.");
                // Disable nav buttons if Swiper can't init
                document.getElementById('preview-swipe-next')?.classList.add('swiper-button-disabled');
                document.getElementById('preview-swipe-prev')?.classList.add('swiper-button-disabled');
                return;
            }

            try {
                 const slides = swiperWrapper.querySelectorAll('.swiper-slide:not(.placeholder)');
                 const slidesCount = slides.length;
                 console.log(`Found ${slidesCount} actual slides for Swiper init.`);

                 const swiperOptions = {
                     effect: 'cards',
                     grabCursor: true,
                     loop: slidesCount > 1,
                     loopedSlides: slidesCount > 1 ? slidesCount : undefined, // Important for loop + cards effect
                     cardsEffect: {
                         perSlideOffset: 8, perSlideRotate: 2, rotate: true, slideShadows: true,
                     },
                     navigation: {
                         nextEl: '#preview-swipe-next', prevEl: '#preview-swipe-prev',
                     },
                     watchOverflow: true,
                     observer: true, observeParents: true, observeSlideChildren: true,
                     runCallbacksOnInit: true, // Important to set initial state
                      on: {
                        init: function () {
                            console.log('Swiper initialized.');
                            this.update(); // Ensure internal state is correct
                            // Manually update nav button state after init
                            updateSwiperNavButtons(this);
                        },
                         slidesLengthChange: function() {
                             console.log("Swiper slidesLengthChange detected");
                             this.update(); // Update swiper state
                             updateSwiperNavButtons(this); // Update button state
                         },
                         update: function() {
                            // console.log("Swiper update called"); // Can be noisy
                            updateSwiperNavButtons(this);
                         },
                         reachEnd: function() { updateSwiperNavButtons(this); },
                         reachBeginning: function() { updateSwiperNavButtons(this); },
                         fromEdge: function() { updateSwiperNavButtons(this); }, // Handles coming back from edge
                     }
                 };

                 if (slidesCount > 0) {
                    previewSwiperInstance = new Swiper(swiperContainer, swiperOptions);
                 } else {
                    console.log("No slides, Swiper not initialized.");
                    updateSwiperNavButtons(null); // Disable buttons if no instance
                 }

            } catch (error) {
                console.error("Failed to initialize Swiper Card Stack:", error);
                updateSwiperNavButtons(null); // Disable buttons on error
                const previewContainer = swiperContainer.closest('.preview-container');
                if (previewContainer) {
                    previewContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Preview Carousel Error.</p>';
                }
            }
        }, 100); // 100ms delay - adjust if needed
    }

     // Helper to update Swiper navigation buttons state
     function updateSwiperNavButtons(swiperInstance) {
        const navNext = document.getElementById('preview-swipe-next');
        const navPrev = document.getElementById('preview-swipe-prev');
        if (!navNext || !navPrev) return;

        if (!swiperInstance || swiperInstance.destroyed || !swiperInstance.params || swiperInstance.slides.length <= 1) {
            // Disable if no instance, destroyed, or only one slide (or zero)
            navNext.classList.add('swiper-button-disabled');
            navPrev.classList.add('swiper-button-disabled');
        } else if (swiperInstance.params.loop) {
            // Enable if looping
            navNext.classList.remove('swiper-button-disabled');
            navPrev.classList.remove('swiper-button-disabled');
        } else {
            // Enable/disable based on position if not looping
            navNext.classList.toggle('swiper-button-disabled', swiperInstance.isEnd);
            navPrev.classList.toggle('swiper-button-disabled', swiperInstance.isBeginning);
        }
    }


    // --- Initialize Kofi Widget ---
    // ... (Keep the function from the previous version)
    function initializeKofiWidget() {
        console.log("Initializing Ko-fi widget...");
        const integrations = config.integrations || {};
        const kofiUsername = integrations.kofiUsername;

         if (typeof kofiWidgetOverlay !== 'undefined' && kofiUsername) {
             try {
                 try { // Try removing previous widget robustly
                    const existingWidget = document.querySelector('iframe[id^="kofi-widget-iframe-"]');
                    if (existingWidget && typeof kofiWidgetOverlay.remove === 'function') {
                        kofiWidgetOverlay.remove(); // Use official removal if possible
                        console.log("Attempted removal of previous Ko-fi widget via API.");
                    } else if (existingWidget) {
                        existingWidget.parentElement?.remove(); // Remove parent container if API unavailable
                        console.log("Removed previous Ko-fi widget element manually.");
                    }
                 } catch (removeError) {
                     console.warn("Could not definitively remove previous Ko-fi widget:", removeError);
                 }

                 // Draw the new widget
                 kofiWidgetOverlay.draw(kofiUsername, {
                     'type': 'floating-chat',
                     'floating-chat.donateButton.text': 'Support Me',
                     'floating-chat.donateButton.background-color': '#F2994A',
                     'floating-chat.donateButton.text-color': '#fff'
                 });
                 console.log("Kofi widget initialized for:", kofiUsername);
             } catch(error) {
                 console.error("Failed to initialize Kofi widget:", error);
             }
         } else if (kofiUsername) {
             console.warn("Kofi username configured, but widget script (kofiWidgetOverlay) not found/loaded yet.");
         } else {
             console.log("Kofi username not configured.");
             if(kofiContainer) kofiContainer.style.display = 'none';
         }
    }


    // --- Modal Logic & Event Listeners Setup ---
    function setupEventListeners() {
        console.log("Setting up event listeners...");

        // --- Event Delegation for Dynamic Content ---
        document.body.addEventListener('click', (event) => {
            // 1. Modal Overlays
            if (event.target.matches('.modal-overlay')) {
                if (portfolioModal?.classList.contains('is-visible')) closePortfolioModal();
                else if (licenseApplyModal?.classList.contains('is-visible')) closeLicenseModal();
                else if (purchaseOptionsModal?.classList.contains('is-visible')) closePurchaseModal();
                return;
            }
            // 2. Portfolio Items (Grid or Swiper)
             const clickableItem = event.target.closest('.grid-item[data-id], .swiper-slide[data-id]:not(.placeholder)');
             if (clickableItem && clickableItem.dataset.id) { // Check for data-id
                 console.log("Portfolio item clicked, ID:", clickableItem.dataset.id);
                 // Find the full project data from the config using the ID
                 const projectData = config.projects.find(p => p.id === clickableItem.dataset.id);
                 if (projectData) {
                    openPortfolioModalWithData(projectData); // Use a function that accepts data object
                 } else {
                    console.error("Could not find project data for ID:", clickableItem.dataset.id);
                 }
                 return;
             }
            // 3. Purchase License Cards
             const licenseCardButton = event.target.closest('.license-card .modal-button.purchase');
             if (licenseCardButton) {
                 const licenseCard = licenseCardButton.closest('.license-card[data-license-type]');
                 if(licenseCard && purchaseOptionsModal?.classList.contains('is-visible')) {
                     handlePurchaseOption(licenseCard.dataset.licenseType); return;
                 }
             }
             // 4. Instagram Play Button
              if (event.target.matches('.instagram-play-button')) {
                    const wrapper = event.target.closest('.instagram-embed-wrapper');
                    const iframe = wrapper?.querySelector('.instagram-iframe');
                    if (iframe) {
                        iframe.style.pointerEvents = 'auto'; iframe.focus();
                        event.target.style.display = 'none';
                    } return;
                }
              // 5. View License Terms Link
              if (event.target.closest('#view-license-terms-link')) {
                    event.preventDefault(); toggleLicenseTerms(); return;
              }
        });

        // --- Static Button Listeners ---
        // ** Modal buttons - Listeners attached here **
        if(applyLicenseBtnPortfolio) {
             applyLicenseBtnPortfolio.addEventListener('click', () => {
                 const beatTitle = applyLicenseBtnPortfolio.dataset.beatTitle; // Get title from button's dataset
                 console.log(`Modal 'Apply License' clicked for beat: ${beatTitle}`);
                 openLicenseModal(beatTitle || null);
             });
        } else { console.warn("#modal-apply-license-btn not found"); }

        if(purchaseLicenseBtnPortfolio) {
             purchaseLicenseBtnPortfolio.addEventListener('click', () => {
                 const beatTitle = purchaseLicenseBtnPortfolio.dataset.beatTitle; // Get title from button's dataset
                 console.log(`Modal 'Purchase License' clicked for beat: ${beatTitle}`);
                 openPurchaseModal(beatTitle || null);
             });
        } else { console.warn("#modal-purchase-license-btn not found"); }

        // Home Action Buttons
        if(homeApplyLicenseBtn) {
            homeApplyLicenseBtn.addEventListener('click', () => {
                console.log("Home 'Apply License' clicked");
                openLicenseModal();
            });
        } else { console.warn("#home-apply-license-btn not found"); }

        if(homePurchaseLicenseBtn) {
            homePurchaseLicenseBtn.addEventListener('click', () => {
                console.log("Home 'Purchase License' clicked");
                openPurchaseModal();
            });
        } else { console.warn("#home-purchase-license-btn not found"); }


        // --- Modal Close Buttons ---
        if(portfolioModalCloseBtn) portfolioModalCloseBtn.addEventListener('click', closePortfolioModal);
        if(licenseModalCloseBtn) licenseModalCloseBtn.addEventListener('click', closeLicenseModal);
        if(purchaseModalCloseBtn) purchaseModalCloseBtn.addEventListener('click', closePurchaseModal);

        // --- License Form Specifics ---
        if(licenseForm) licenseForm.addEventListener('submit', handleLicenseFormStep1);
        if(downloadLicenseBtn) downloadLicenseBtn.addEventListener('click', handleLicenseFormStep2);
        if(copyLicenseBtn) copyLicenseBtn.addEventListener('click', copyLicenseText);

        // --- Global Escape Key ---
        document.addEventListener('keydown', handleEscKey);
        console.log("Event listeners set up.");
    }

    // --- Fungsi untuk Memuat Instagram oEmbed ---
    async function loadInstagramOEmbed(postUrl, containerElement) {
        const FACEBOOK_ACCESS_TOKEN = 'MASUKKAN_ACCESS_TOKEN_ANDA_DISINI'; // <<< GANTI INI!

        if (FACEBOOK_ACCESS_TOKEN === 'MASUKKAN_ACCESS_TOKEN_ANDA_DISINI') {
            console.error("Instagram oEmbed Error: Access Token belum diatur!");
            containerElement.innerHTML = `
                <div class="oembed-status-message">
                    Instagram oEmbed tidak dapat dimuat.<br>(Konfigurasi Access Token diperlukan).
                    <br>
                    <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="oembed-error-link">
                        Lihat di Instagram
                    </a>
                </div>`;
            containerElement.classList.add('error');
            containerElement.classList.remove('loading');
            return;
        }

        const oEmbedEndpoint = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(postUrl)}&access_token=${FACEBOOK_ACCESS_TOKEN}`;
        containerElement.innerHTML = '<div class="oembed-status-message">Memuat Konten Instagram...</div>';
        containerElement.classList.add('loading');
        containerElement.classList.remove('error');
        containerElement.style.aspectRatio = '1 / 1';

        try {
            const response = await fetch(oEmbedEndpoint);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Instagram oEmbed API Error:", response.status, errorData);
                throw new Error(`API request failed: ${response.status} ${errorData.error?.message || ''}`);
            }

            const data = await response.json();

            if (data.html && data.width && data.height) {
                const aspectRatio = data.width / data.height;
                containerElement.style.aspectRatio = `${data.width} / ${data.height}`;
                containerElement.innerHTML = data.html;

                const scriptTag = containerElement.querySelector('script[src*="embed.js"]');
                if (scriptTag) {
                    const newScript = document.createElement('script');
                    newScript.src = scriptTag.src;
                    newScript.async = true;
                    document.body.appendChild(newScript);
                    newScript.setAttribute('data-oembed-script', 'true');
                }
            } else {
                console.error("Instagram oEmbed Error: Data tidak lengkap diterima.", data);
                throw new Error("Data oEmbed tidak lengkap.");
            }

            containerElement.classList.remove('loading');
        } catch (error) {
            console.error('Gagal memuat Instagram oEmbed:', error);
            containerElement.innerHTML = `
                <div class="oembed-status-message">
                    Gagal memuat konten Instagram.
                    <br>
                    <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="oembed-error-link">
                        Coba lihat di Instagram
                    </a>
                </div>`;
            containerElement.classList.add('error');
            containerElement.classList.remove('loading');
        }
    }

    // --- Open Portfolio Modal (New version accepting data object) ---
    function openPortfolioModalWithData(projectData) {
         if(!portfolioModal || !projectData) {
             console.error("Cannot open portfolio modal: Modal element or project data missing.");
             return;
         }
          // Check sub-elements needed
          if(!modalTitle || !modalDescription || !modalMeta || !modalLink || !applyLicenseBtnPortfolio || !purchaseLicenseBtnPortfolio || !modalVideoContainer) {
             console.error("Cannot open portfolio modal: One or more required sub-elements not found!");
             return;
         }

         console.log("Opening modal with project data:", projectData);

         modalTitle.textContent = projectData.title || 'Project Details';
         modalDescription.textContent = projectData.description || 'No description available.';
         modalMeta.innerHTML = (projectData.meta || '').replace(/\|/g, '<span class="meta-separator"> | </span>').replace(/\n/g, '<br>'); // Add spacing around separator

         modalLink.href = projectData.link || '#';
         modalLink.textContent = projectData.linkText || 'View Source';
         modalLink.style.display = (projectData.link && projectData.link !== '#') ? 'inline-block' : 'none';

         const isBeat = !!projectData.isBeat; // Ensure boolean
         applyLicenseBtnPortfolio.style.display = isBeat ? 'inline-block' : 'none';
         purchaseLicenseBtnPortfolio.style.display = isBeat ? 'inline-block' : 'none';
         // Store the beat title on the buttons
         if (isBeat) {
             applyLicenseBtnPortfolio.dataset.beatTitle = projectData.title || '';
             purchaseLicenseBtnPortfolio.dataset.beatTitle = projectData.title || '';
              console.log(`Set dataset beatTitle="${projectData.title}" for modal buttons.`);
         } else {
             delete applyLicenseBtnPortfolio.dataset.beatTitle;
             delete purchaseLicenseBtnPortfolio.dataset.beatTitle;
         }

         // --- Clear & Prepare Video Container ---
         modalVideoContainer.innerHTML = '';
         modalVideoContainer.className = 'modal-video-container'; // Reset classes
         modalVideoContainer.style.height = '';
         modalVideoContainer.style.paddingBottom = '';
         modalVideoContainer.style.display = 'none'; // Hide initially

         let embedHtml = '';
         let needsContainerDisplayBlock = false;
         const titleAttr = projectData.title ? `title="${projectData.title.replace(/"/g, '"')}"` : 'title="Embedded Content"';

          // --- Create Embed HTML (Use projectData directly) ---
         const { type, videoId, embedUrl, link } = projectData;

          // (Embed logic remains the same as previous version, using projectData.*)
        if (type === 'youtube' && videoId) {
             embedHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0" ${titleAttr} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
             modalVideoContainer.classList.add('aspect-16-9');
             needsContainerDisplayBlock = true;
         } else if (type === 'spotify' && embedUrl) {
             let defaultHeight = '152'; let spotifyUrl = embedUrl; try { let url = new URL(embedUrl); if (url.pathname.startsWith('/embed/')) { spotifyUrl = url.toString(); if (url.pathname.includes('/episode/') || url.pathname.includes('/track/')) defaultHeight = '152'; else defaultHeight = '380'; } else if (url.pathname.includes('/track/') || url.pathname.includes('/album/') || url.pathname.includes('/playlist/') || url.pathname.includes('/episode/') || url.pathname.includes('/artist/')) { spotifyUrl = `https://open.spotify.com/embed${url.pathname}${url.search}`; if (url.pathname.includes('/episode/') || url.pathname.includes('/track/')) defaultHeight = '152'; else defaultHeight = '380'; } let parsedUrl = new URL(spotifyUrl); parsedUrl.searchParams.set('utm_source', 'generator'); parsedUrl.searchParams.set('theme', '0'); spotifyUrl = parsedUrl.toString(); } catch(e){ console.warn("Spotify URL parse error:", e); }
             embedHtml = `<iframe style="border-radius: var(--modal-video-radius, 10px);" src="${spotifyUrl}" width="100%" height="${defaultHeight}" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" ${titleAttr}></iframe>`;
             modalVideoContainer.classList.add('fixed-height'); modalVideoContainer.style.height = `${defaultHeight}px`; needsContainerDisplayBlock = true;
         } else if (type === 'soundcloud' && embedUrl) {
             let scUrlString = embedUrl; let defaultHeight = '166'; try { let scUrl = new URL(embedUrl); if(scUrl.hostname.includes('w.soundcloud.com') && scUrl.pathname.includes('/player/')) { scUrl.searchParams.set('color', 'F2994A'); scUrl.searchParams.set('auto_play', 'true'); scUrl.searchParams.set('hide_related', 'true'); scUrl.searchParams.set('show_comments', 'false'); scUrl.searchParams.set('show_user', 'true'); scUrl.searchParams.set('show_reposts', 'false'); scUrl.searchParams.set('show_teaser', 'false'); const visual = scUrl.searchParams.get('visual') === 'true'; scUrl.searchParams.set('visual', visual ? 'true' : 'false'); defaultHeight = visual ? '300' : '166'; scUrlString = scUrl.toString(); modalVideoContainer.classList.add('fixed-height'); modalVideoContainer.style.height = `${defaultHeight}px`; embedHtml = `<iframe style="border-radius: var(--modal-video-radius, 10px);" src="${scUrlString}" width="100%" height="${defaultHeight}" frameBorder="0" allowfullscreen="" allow="autoplay" loading="lazy" ${titleAttr}></iframe>`; needsContainerDisplayBlock = true; } else { embedHtml = `<p class="embed-error">Invalid SoundCloud embed URL. <a href="${link || '#'}" target="_blank" rel="noopener noreferrer">View on SoundCloud</a></p>`; needsContainerDisplayBlock = true; } } catch(e) { embedHtml = `<p class="embed-error">Error loading SoundCloud embed. <a href="${link || '#'}" target="_blank" rel="noopener noreferrer">View on SoundCloud</a></p>`; needsContainerDisplayBlock = true; }
         } else if (type === 'instagram' && link) {
             modalVideoContainer.classList.add('instagram-embed-container'); needsContainerDisplayBlock = true; let instagramEmbedUrl = '#'; try { let cleanLink = link.split('?')[0]; let parts = cleanLink.match(/(?:p|reel)\/([a-zA-Z0-9_-]+)/); if (parts && parts[1]) { instagramEmbedUrl = `https://www.instagram.com/p/${parts[1]}/embed/captioned/`; } else { throw new Error("Invalid Instagram URL format"); } } catch (e) { console.error("Insta URL Error:", e); }
             embedHtml = `<div class="instagram-embed-wrapper">${instagramEmbedUrl !== '#' ? `<iframe src="${instagramEmbedUrl}" class="instagram-iframe" scrolling="no" frameborder="0" allowTransparency="true" allowfullscreen="true" ${titleAttr} loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe><button class="instagram-play-button" aria-label="Play Instagram Video">▶</button>` : ''}</div><p class="instagram-fallback">${instagramEmbedUrl !== '#' ? 'Loading Instagram...' : 'Cannot load preview.'} <a href="${link}" target="_blank" rel="noopener noreferrer" class="instagram-fallback-link">View on Instagram</a>.</p>`; if(instagramEmbedUrl === '#') embedHtml = embedHtml.replace(/<button.*?<\/button>/, '');
         } else if (type === 'other' && link) {
             embedHtml = `<p class="embed-info">No direct preview available. <a href="${link}" target="_blank" rel="noopener noreferrer">Visit Link</a></p>`;
             needsContainerDisplayBlock = true;
         }


         // --- Display Container & Content ---
          if (needsContainerDisplayBlock) {
             modalVideoContainer.style.display = modalVideoContainer.classList.contains('instagram-embed-container') ? 'flex' : 'block';
             modalVideoContainer.innerHTML = embedHtml;
             console.log("Embed HTML added to modal.");
         } else {
             modalVideoContainer.style.display = 'none';
             console.log("No embeddable content for type:", type);
         }

         // --- Show Modal ---
         portfolioModal.classList.add('is-visible');
         document.body.classList.add('modal-open');
         portfolioModal.querySelector('.modal-content')?.scrollTo({ top: 0, behavior: 'instant' });
         console.log(`Portfolio modal opened for: ${projectData.title}`);
    }

    // --- openLicenseModal ---
    // ... (Keep function from previous version - it should be correct)
    function openLicenseModal(beatTitle = null) {
        if (!licenseApplyModal || !licenseForm) { console.error("License modal elements missing!"); return; }
        console.log("Opening license modal", beatTitle ? `for "${beatTitle}"` : "(generic)");
        licenseForm.reset();
        if(licenseFormError) licenseFormError.style.display = 'none';
        if(fullTermsDiv) fullTermsDiv.style.display = 'none';
        if(licenseDisplayArea) licenseDisplayArea.style.display = 'none';
        if(licenseTextOutput) licenseTextOutput.value = '';
        if(generateLicenseBtn) { generateLicenseBtn.style.display = 'inline-block'; generateLicenseBtn.disabled = false; generateLicenseBtn.textContent = 'Validate & Prepare'; }
        if(downloadLicenseBtn) downloadLicenseBtn.style.display = 'none';
        if(copyLicenseBtn) { copyLicenseBtn.textContent = 'Copy License Text'; copyLicenseBtn.disabled = false;}
        if(licenseBeatTitleInput){
            licenseBeatTitleInput.value = beatTitle || '';
            licenseBeatTitleInput.readOnly = !!beatTitle;
            licenseBeatTitleInput.classList.toggle('readonly', !!beatTitle);
            licenseBeatTitleInput.placeholder = beatTitle ? "" : "Enter the exact beat title";
        }
        licenseApplyModal.classList.add('is-visible'); document.body.classList.add('modal-open');
        licenseApplyModal.querySelector('.modal-content')?.scrollTo({ top: 0, behavior: 'instant' });
    }

    // --- openPurchaseModal ---
    // ... (Keep function from previous version)
    function openPurchaseModal(beatTitle = null) {
         if (!purchaseOptionsModal || !purchaseModalTitle || !purchaseBeatInfo) { console.error("Purchase modal elements missing!"); return; }
         console.log("Opening purchase modal", beatTitle ? `for "${beatTitle}"` : "(generic)");
        if (beatTitle) {
            purchaseModalTitle.textContent = "Purchase License";
            purchaseBeatInfo.textContent = `Selected Beat: ${beatTitle}`;
            purchaseBeatInfo.style.display = 'block';
            purchaseOptionsModal.dataset.beatTitle = beatTitle;
        } else {
            purchaseModalTitle.textContent = "Choose Your Beat License";
            purchaseBeatInfo.style.display = 'none';
            delete purchaseOptionsModal.dataset.beatTitle;
        }
        purchaseOptionsModal.classList.add('is-visible'); document.body.classList.add('modal-open');
        purchaseOptionsModal.querySelector('.modal-content')?.scrollTo({ top: 0, behavior: 'instant' });
    }

    // --- handlePurchaseOption ---
    // ... (Keep function from previous version)
     function handlePurchaseOption(licenseType) {
         console.log(`Purchase option selected: ${licenseType}`);
         const beatTitle = purchaseOptionsModal?.dataset.beatTitle || "General Inquiry";
         const gumroadBaseUrl = config.integrations?.gumroadUrl || '';
         const contactEmail = config.integrations?.exclusiveContactEmail || '';

         let targetUrl = '#';
         if (licenseType === 'exclusive') {
              if (contactEmail && contactEmail.includes('@')) {
                 targetUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(`Exclusive License Inquiry: ${beatTitle}`)}&body=${encodeURIComponent(`Hi,\n\nI'm interested in purchasing an exclusive license for the beat "${beatTitle}".\n\nPlease provide more information regarding pricing and terms.\n\nThanks,\n[Your Name]`)}`;
                 console.log("Opening mailto for exclusive:", targetUrl);
                 window.location.href = targetUrl;
                 closePurchaseModal();
             } else { alert("Exclusive license contact information is not available."); }
         } else if (licenseType === 'standard' || licenseType === 'premium') {
              if (gumroadBaseUrl && gumroadBaseUrl.startsWith('http')) {
                 const separator = gumroadBaseUrl.includes('?') ? '&' : '?';
                 targetUrl = `${gumroadBaseUrl}${separator}wanted=true`;
                 console.log(`Opening Gumroad for ${licenseType}:`, targetUrl);
                 window.open(targetUrl, '_blank', 'noopener,noreferrer');
                  closePurchaseModal();
             } else { alert("The purchase link is currently unavailable."); }
         } else { console.warn("Unknown license type:", licenseType); }
     }

    // --- Close Modals Functions ---
    // ... (Keep functions from previous version)
    function closePortfolioModal() { if (!portfolioModal) return; console.log("Closing portfolio modal."); portfolioModal.classList.remove('is-visible'); if(modalVideoContainer) { const iframe = modalVideoContainer.querySelector('iframe'); if (iframe) iframe.src = ''; modalVideoContainer.innerHTML = ''; modalVideoContainer.style.display = 'none'; } checkAndRemoveBodyClass(); };
    function closeLicenseModal() { if (!licenseApplyModal) return; console.log("Closing license modal."); licenseApplyModal.classList.remove('is-visible'); checkAndRemoveBodyClass(); };
    function closePurchaseModal() { if (!purchaseOptionsModal) return; console.log("Closing purchase modal."); purchaseOptionsModal.classList.remove('is-visible'); checkAndRemoveBodyClass(); };
    function checkAndRemoveBodyClass() { const anyModalVisible = portfolioModal?.classList.contains('is-visible') || licenseApplyModal?.classList.contains('is-visible') || purchaseOptionsModal?.classList.contains('is-visible'); if (!anyModalVisible) { document.body.classList.remove('modal-open'); } }

    // --- toggleLicenseTerms ---
    // ... (Keep function from previous version)
     function toggleLicenseTerms() { if (!fullTermsDiv) return; const isVisible = fullTermsDiv.style.display === 'block'; fullTermsDiv.style.display = isVisible ? 'none' : 'block'; if (!isVisible) { fullTermsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } }

    // --- handleLicenseFormStep1 ---
    // ... (Keep function from previous version - should be correct)
    function handleLicenseFormStep1(event) {
        event.preventDefault();
        if (!licenseFormError || !generateLicenseBtn || !downloadLicenseBtn || !licenseBeatTitleInput || !licenseUserNameInput || !licenseSignatureInput || !licenseAgreementCheck || !licenseDisplayArea) return;
        licenseFormError.style.display = 'none'; licenseDisplayArea.style.display = 'none';
        const beatTitle = licenseBeatTitleInput.value.trim(); const userName = licenseUserNameInput.value.trim(); const signature = licenseSignatureInput.value.trim(); const agreed = licenseAgreementCheck.checked;
        let errors = []; if (!beatTitle) errors.push("Beat Title required."); if (!userName) errors.push("Full Name required."); if (!signature) errors.push("Signature required."); if (signature && signature.toLowerCase() !== userName.toLowerCase()) errors.push("Signature must match name."); if (!agreed) errors.push("Must agree to terms.");
        if (errors.length > 0) { licenseFormError.innerHTML = errors.join('<br>'); licenseFormError.style.display = 'block'; return; }
        generateLicenseBtn.textContent = 'Validated!'; generateLicenseBtn.disabled = true;
        if(downloadLicenseBtn) downloadLicenseBtn.style.display = 'inline-block'; downloadLicenseBtn.focus();
    }

    // --- handleLicenseFormStep2 ---
    // ... (Keep function from previous version - should be correct)
     function handleLicenseFormStep2() {
         if (!licenseFormError || !generateLicenseBtn || !downloadLicenseBtn || !licenseTextOutput || !licenseDisplayArea || !licenseBeatTitleInput || !licenseUserNameInput || !licenseSignatureInput) return;
         const beatTitle = licenseBeatTitleInput.value.trim(); const userName = licenseUserNameInput.value.trim(); const signature = licenseSignatureInput.value.trim(); const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
         if (!beatTitle || !userName || !signature) { licenseFormError.textContent = 'Error: Form data missing.'; licenseFormError.style.display = 'block'; generateLicenseBtn.style.display = 'inline-block'; generateLicenseBtn.disabled = false; generateLicenseBtn.textContent = 'Validate & Prepare'; downloadLicenseBtn.style.display = 'none'; return; }
         if (!currentLicenseTemplate) { licenseFormError.textContent = 'Error: License template missing.'; licenseFormError.style.display = 'block'; return; }
         let generatedLicense = currentLicenseTemplate .replace(/\{\{BEAT_TITLE\}\}/g, beatTitle) .replace(/\{\{USER_NAME\}\}/g, userName) .replace(/\{\{SIGNATURE\}\}/g, signature) .replace(/\{\{DATE\}\}/g, currentDate);
         licenseTextOutput.value = generatedLicense; licenseDisplayArea.style.display = 'block';
         const modalContent = licenseApplyModal?.querySelector('.modal-content'); if(modalContent) modalContent.scrollTo({ top: modalContent.scrollHeight, behavior: 'smooth' });
         try { const blob = new Blob([generatedLicense], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const tempLink = document.createElement('a'); const safeBeatTitle = beatTitle.replace(/[^a-z0-9_\-\.]/gi, '_').substring(0, 50); const safeUserName = userName.replace(/[^a-z0-9_\-]/gi, '_').substring(0, 30); tempLink.download = `Free_License_${safeBeatTitle}_${safeUserName}.txt`; tempLink.href = url; document.body.appendChild(tempLink); tempLink.click(); document.body.removeChild(tempLink); URL.revokeObjectURL(url); downloadLicenseBtn.textContent = 'Download Again'; licenseFormError.style.display = 'none'; } catch (error) { console.error("Download failed:", error); licenseFormError.textContent = "Download failed. Please copy text manually."; licenseFormError.style.display = 'block'; downloadLicenseBtn.textContent = 'Download Failed'; downloadLicenseBtn.disabled = true; }
    }


    // --- copyLicenseText ---
    // ... (Keep function from previous version - includes fallback)
    function copyLicenseText() {
         if (!licenseTextOutput || !copyLicenseBtn) return;
         const textToCopy = licenseTextOutput.value; if (!textToCopy) return;
         navigator.clipboard.writeText(textToCopy).then(() => { const originalText = copyLicenseBtn.textContent; copyLicenseBtn.textContent = 'Copied!'; copyLicenseBtn.disabled = true; setTimeout(() => { copyLicenseBtn.textContent = originalText; copyLicenseBtn.disabled = false; }, 1500); }).catch(err => { console.error('Clipboard API failed: ', err); try { licenseTextOutput.select(); licenseTextOutput.setSelectionRange(0, 99999); const successful = document.execCommand('copy'); window.getSelection()?.removeAllRanges(); if (successful) { const originalText = copyLicenseBtn.textContent; copyLicenseBtn.textContent = 'Copied! (Legacy)'; copyLicenseBtn.disabled = true; setTimeout(() => { copyLicenseBtn.textContent = originalText; copyLicenseBtn.disabled = false; }, 2000); } else { throw new Error('execCommand failed'); } } catch (legacyErr) { console.error('Legacy copy failed: ', legacyErr); alert('Could not copy text. Please select and copy manually.'); } });
     }

    // --- handleEscKey ---
    // ... (Keep function from previous version)
     function handleEscKey(event) { if (event.key === 'Escape' || event.key === 'Esc') { if (purchaseOptionsModal?.classList.contains('is-visible')) closePurchaseModal(); else if (licenseApplyModal?.classList.contains('is-visible')) closeLicenseModal(); else if (portfolioModal?.classList.contains('is-visible')) closePortfolioModal(); } }

    // --- Start the application ---
    initializeApp();

}); // End DOMContentLoaded
// END OF FILE: script.js