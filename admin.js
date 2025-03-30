// START OF FILE: admin.js
document.addEventListener('DOMContentLoaded', () => {
    const CONFIG_KEY = 'artchiveConfig';
    const CONTENT_URL = 'content.json'; // Path to default content

    // --- DOM Elements ---
    // Data Management
    const saveConfigBtn = document.getElementById('save-config-btn');
    const exportConfigBtn = document.getElementById('export-config-btn');
    const importConfigInput = document.getElementById('import-config-input');
    const resetConfigBtn = document.getElementById('reset-config-btn'); // Added Reset button
    const statusMessageDiv = document.getElementById('status-message');

    // Form Fields (Grouped by Section)
    const siteTitleInput = document.getElementById('admin-site-title');
    const siteSubtitleInput = document.getElementById('admin-site-subtitle');
    const logoUrlInput = document.getElementById('admin-logo-url');
    const backgroundVideoIdInput = document.getElementById('admin-background-video-id');
    const footerTextInput = document.getElementById('admin-footer-text');

    const kofiUsernameInput = document.getElementById('admin-kofi-username');
    const gumroadUrlInput = document.getElementById('admin-gumroad-url');
    const exclusiveContactEmailInput = document.getElementById('admin-exclusive-contact-email');

    const freeLicenseTemplateTextarea = document.getElementById('admin-free-license-template');

    // Projects Section
    const projectListDiv = document.getElementById('project-list');
    const addNewProjectBtn = document.getElementById('add-new-project-btn');
    const projectEditorDiv = document.getElementById('project-editor');
    const projectEditorTitle = document.getElementById('project-editor-title');
    const projectForm = document.getElementById('project-form');
    const cancelProjectEditBtn = document.getElementById('cancel-project-edit-btn');

    // Project Form Fields
    const projectIdInput = document.getElementById('project-id');
    const projectTitleInput = document.getElementById('project-title');
    const projectImageUrlInput = document.getElementById('project-image-url');
    const projectImageAltInput = document.getElementById('project-image-alt');
    const projectMetaTextarea = document.getElementById('project-meta');
    const projectDescriptionTextarea = document.getElementById('project-description');
    const projectTypeSelect = document.getElementById('project-type');
    const projectVideoIdInput = document.getElementById('project-video-id');
    const projectVideoIdGroup = document.getElementById('project-video-id-group');
    const projectEmbedUrlInput = document.getElementById('project-embed-url');
    const projectEmbedUrlGroup = document.getElementById('project-embed-url-group');
    const projectLinkInput = document.getElementById('project-link');
    const projectLinkTextInput = document.getElementById('project-link-text');
    const projectIsBeatCheckbox = document.getElementById('project-is-beat');
    const projectInPreviewCheckbox = document.getElementById('project-in-preview');
    const projectGridPositionInput = document.getElementById('project-grid-position');


    // --- State ---
    let currentConfig = {}; // Holds the configuration currently being edited
    let defaultContent = {}; // Holds the content fetched from content.json

     // --- Minimal Structure Definition (Ensures keys exist after loading/merging) ---
     const configStructure = {
        siteSettings: { siteTitle: '', siteSubtitle: '', logoUrl: '', backgroundVideoId: '', footerText: '' },
        integrations: { kofiUsername: '', gumroadUrl: '', exclusiveContactEmail: '' },
        license: { freeLicenseTemplate: '' },
        projects: []
     };

    // --- Initialization ---
    async function initializeAdmin() {
        console.log("Initializing admin panel...");
        await loadDefaultContent(); // Load defaults first
        await loadConfigFromStorageOrDefaults(); // Load user's saved data or use defaults
        populateAdminForm();
        renderProjectList();
        setupEventListeners();
        console.log("Admin panel initialized.");
    }

    // --- Load Default Content ---
    async function loadDefaultContent() {
         console.log(`Fetching default content from ${CONTENT_URL}...`);
         try {
             const response = await fetch(CONTENT_URL);
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
             defaultContent = await response.json();
             // Basic validation
             if (typeof defaultContent !== 'object' || !defaultContent.siteSettings || !defaultContent.projects) {
                  console.error("Fetched default content.json is invalid or incomplete.");
                  defaultContent = JSON.parse(JSON.stringify(configStructure)); // Use empty structure as fallback default
             } else {
                 console.log("Default content loaded successfully.");
             }
         } catch (error) {
             console.error(`Failed to fetch or parse ${CONTENT_URL}:`, error);
             showStatus(`Error loading default content: ${error.message}. Using minimal structure.`, true);
             // Use a minimal structure if fetching fails
             defaultContent = JSON.parse(JSON.stringify(configStructure));
         }
    }


    // --- Load Config (localStorage or defaultContent) ---
    async function loadConfigFromStorageOrDefaults() {
        console.log("Loading configuration for editing...");
        try {
            const storedConfigString = localStorage.getItem(CONFIG_KEY);
            if (storedConfigString) {
                console.log("Found configuration in localStorage.");
                let parsedConfig = JSON.parse(storedConfigString);

                // Basic validation
                if (typeof parsedConfig === 'object' && parsedConfig !== null && parsedConfig.siteSettings && parsedConfig.projects) {
                     // Merge with default structure to ensure all keys exist
                     currentConfig = mergeDeep(JSON.parse(JSON.stringify(configStructure)), parsedConfig);
                     console.log("Loaded and merged config from localStorage.");
                     return; // Successfully loaded from storage
                } else {
                    console.warn("localStorage configuration is invalid or incomplete. Using defaults.");
                     localStorage.removeItem(CONFIG_KEY); // Remove invalid data
                }
            } else {
                console.log("No configuration found in localStorage. Using defaults.");
            }
        } catch (error) {
            console.error("Error reading/parsing localStorage configuration:", error);
            showStatus("Error loading saved configuration. Using defaults.", true);
        }

         // Fallback: Use the loaded defaultContent if storage fails or is empty
         console.log("Using default content as current configuration.");
         // Deep copy defaultContent to prevent accidental modification
         currentConfig = JSON.parse(JSON.stringify(defaultContent));
         // Ensure the structure is complete even if defaultContent was flawed
         currentConfig = mergeDeep(JSON.parse(JSON.stringify(configStructure)), currentConfig);
    }

    // --- Save Config to localStorage ---
    function saveConfig() {
        console.log("Attempting to save configuration...");
        try {
            // Gather data from form fields into currentConfig object
            // Use a helper to avoid manually listing every field
            gatherFormData();

            localStorage.setItem(CONFIG_KEY, JSON.stringify(currentConfig));
            showStatus("Configuration saved successfully to browser!");
            console.log('Config saved:', currentConfig);
        } catch (error) {
            console.error("Error saving config:", error);
             let message = `Error saving configuration: ${error.message}`;
             // Check for quota exceeded error specifically
             if (error.name === 'QuotaExceededError' || (error.message && error.message.toLowerCase().includes('quota'))) {
                 message = "Error: LocalStorage quota exceeded. Cannot save configuration. Try removing large projects or clearing site data.";
             }
             showStatus(message, true);
        }
    }

    // --- Gather Form Data into currentConfig ---
    function gatherFormData() {
         console.log("Gathering form data...");
         // Site Settings
         currentConfig.siteSettings.siteTitle = siteTitleInput.value.trim();
         currentConfig.siteSettings.siteSubtitle = siteSubtitleInput.value.trim();
         currentConfig.siteSettings.logoUrl = logoUrlInput.value.trim();
         currentConfig.siteSettings.backgroundVideoId = backgroundVideoIdInput.value.trim();
         currentConfig.siteSettings.footerText = footerTextInput.value.trim();

         // Integrations
         currentConfig.integrations.kofiUsername = kofiUsernameInput.value.trim();
         currentConfig.integrations.gumroadUrl = gumroadUrlInput.value.trim();
         currentConfig.integrations.exclusiveContactEmail = exclusiveContactEmailInput.value.trim();

         // License
         currentConfig.license.freeLicenseTemplate = freeLicenseTemplateTextarea.value; // Keep whitespace

         // Projects array is managed separately by its own form submit/delete actions
         console.log("Form data gathered.");
    }


    // --- Populate Admin Form from currentConfig ---
    function populateAdminForm() {
        console.log("Populating admin form...");
         // Ensure config sections exist before accessing properties
         currentConfig.siteSettings = currentConfig.siteSettings || {};
         currentConfig.integrations = currentConfig.integrations || {};
         currentConfig.license = currentConfig.license || {};
         currentConfig.projects = Array.isArray(currentConfig.projects) ? currentConfig.projects : [];

         // Site Settings
        siteTitleInput.value = currentConfig.siteSettings.siteTitle || '';
        siteSubtitleInput.value = currentConfig.siteSettings.siteSubtitle || '';
        logoUrlInput.value = currentConfig.siteSettings.logoUrl || '';
        backgroundVideoIdInput.value = currentConfig.siteSettings.backgroundVideoId || '';
        footerTextInput.value = currentConfig.siteSettings.footerText || '';

        // Integrations
        kofiUsernameInput.value = currentConfig.integrations.kofiUsername || '';
        gumroadUrlInput.value = currentConfig.integrations.gumroadUrl || '';
        exclusiveContactEmailInput.value = currentConfig.integrations.exclusiveContactEmail || '';

        // License
        freeLicenseTemplateTextarea.value = currentConfig.license.freeLicenseTemplate || '';

        // Projects list is rendered separately by renderProjectList()
         console.log("Admin form populated.");
    }

    // --- Render Project List ---
    function renderProjectList() {
        if (!projectListDiv) return;
        console.log("Rendering project list...");
        projectListDiv.innerHTML = ''; // Clear existing list

        if (!currentConfig.projects || currentConfig.projects.length === 0) {
            projectListDiv.innerHTML = '<p>No projects added yet.</p>';
            console.log("No projects to render.");
            return;
        }

        // Sort projects by gridPosition (treat null/undefined/non-numeric as Infinity)
        const sortedProjects = [...currentConfig.projects].sort((a, b) => {
            const posA = (typeof a.gridPosition === 'number' && !isNaN(a.gridPosition)) ? a.gridPosition : Infinity;
            const posB = (typeof b.gridPosition === 'number' && !isNaN(b.gridPosition)) ? b.gridPosition : Infinity;
            if (posA !== posB) return posA - posB;
            // Fallback sort by title or ID for stability
            const titleA = a.title || a.id || '';
            const titleB = b.title || b.id || '';
            return titleA.localeCompare(titleB);
        });

        console.log(`Rendering ${sortedProjects.length} projects.`);
        sortedProjects.forEach(project => {
            if (!project || !project.id) {
                 console.warn("Skipping invalid project entry:", project);
                 return; // Skip invalid project entries
            }
            const item = document.createElement('div');
            item.className = 'project-list-item';
            item.dataset.projectId = project.id; // Add ID for easier access

             const displayOrder = (typeof project.gridPosition === 'number' && !isNaN(project.gridPosition)) ? project.gridPosition : 'Default';
             const previewStatus = project.inPreview ? 'Yes' : 'No';

            item.innerHTML = `
                <span>
                    <strong>${project.title || 'Untitled Project'}</strong> (ID: ${project.id})<br>
                    <small>Type: ${project.type || 'N/A'} | Order: ${displayOrder} | In Preview: ${previewStatus}</small>
                </span>
                <div>
                    <button type="button" class="admin-button secondary edit-project-btn" data-id="${project.id}">Edit</button>
                    <button type="button" class="admin-button danger delete-project-btn" data-id="${project.id}">Delete</button>
                </div>
            `;
            projectListDiv.appendChild(item);
        });
         // Remove loading message if it exists
         const loadingMsg = projectListDiv.querySelector('p.loading-message');
         if (loadingMsg) loadingMsg.remove();
    }

     // --- Show/Hide Project Editor ---
    function showProjectEditor(project = null) {
        if (!projectForm || !projectEditorDiv || !projectEditorTitle) return;
        console.log(project ? `Showing project editor for "${project.title}"` : "Showing project editor for new project");
        projectForm.reset(); // Clear form first

        if (project) {
            // Editing existing project
            projectEditorTitle.textContent = 'Edit Project';
            projectIdInput.value = project.id || ''; // Set hidden ID
            projectTitleInput.value = project.title || '';
            projectImageUrlInput.value = project.imageUrl || '';
            projectImageAltInput.value = project.imageAlt || '';
            projectMetaTextarea.value = project.meta || '';
            projectDescriptionTextarea.value = project.description || '';
            projectTypeSelect.value = project.type || 'youtube'; // Default to youtube if missing
            projectVideoIdInput.value = project.videoId || '';
            projectEmbedUrlInput.value = project.embedUrl || '';
            projectLinkInput.value = project.link || '';
            projectLinkTextInput.value = project.linkText || 'View Source';
            projectIsBeatCheckbox.checked = !!project.isBeat; // Convert to boolean
            projectInPreviewCheckbox.checked = !!project.inPreview; // Convert to boolean
            // Handle gridPosition carefully (empty string if null/undefined/NaN)
            projectGridPositionInput.value = (typeof project.gridPosition === 'number' && !isNaN(project.gridPosition)) ? project.gridPosition : '';
        } else {
            // Adding new project
            projectEditorTitle.textContent = 'Add New Project';
            projectIdInput.value = ''; // Ensure ID is empty
            projectTypeSelect.value = 'youtube'; // Default type
            projectLinkTextInput.value = 'View Source'; // Default link text
            projectIsBeatCheckbox.checked = false;
            projectInPreviewCheckbox.checked = false;
            projectGridPositionInput.value = '';
        }

        toggleProjectTypeFields(); // Update field visibility based on selected type
        projectEditorDiv.style.display = 'block';
        projectEditorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideProjectEditor() {
        if (!projectEditorDiv || !projectForm) return;
        projectEditorDiv.style.display = 'none';
        projectForm.reset();
        projectIdInput.value = ''; // Explicitly clear ID
        console.log("Project editor hidden.");
    }

     // --- Handle Project List Clicks (Edit/Delete) using Event Delegation ---
     function handleProjectListClick(event) {
         const target = event.target;
         const button = target.closest('button'); // Find the closest button clicked

         if (!button) return; // Exit if the click wasn't on or inside a button

         const projectId = button.dataset.id;
         if (!projectId) return; // Exit if the button doesn't have a project ID

         if (button.classList.contains('edit-project-btn')) {
             console.log("Edit button clicked for project ID:", projectId);
             const project = currentConfig.projects.find(p => p.id === projectId);
             if (project) {
                 showProjectEditor(project);
             } else {
                 console.error("Project not found for editing:", projectId);
                 showStatus("Could not find the project to edit.", true);
             }
         } else if (button.classList.contains('delete-project-btn')) {
             console.log("Delete button clicked for project ID:", projectId);
             const project = currentConfig.projects.find(p => p.id === projectId);
             const projectTitle = project ? project.title : projectId;

             // Confirmation dialog
             if (confirm(`Are you sure you want to delete project: "${projectTitle}"? This cannot be undone.`)) {
                 console.log("Deleting project:", projectId);
                 currentConfig.projects = currentConfig.projects.filter(p => p.id !== projectId);
                 renderProjectList(); // Update the displayed list
                 // If the deleted project was being edited, hide the editor
                 if(projectIdInput.value === projectId) {
                    hideProjectEditor();
                 }
                 showStatus(`Project "${projectTitle}" deleted. Remember to 'Save Configuration' to make it permanent.`, false);
             } else {
                  console.log("Project deletion cancelled.");
             }
         }
     }


    // --- Handle Project Form Submit (Add/Update) ---
    function handleProjectFormSubmit(event) {
        event.preventDefault();
        console.log("Project form submitted.");
        if(!projectForm) return;

        // Create project data object from form
        const projectData = {
            id: projectIdInput.value || null, // Get existing ID or null for new
            title: projectTitleInput.value.trim(),
            imageUrl: projectImageUrlInput.value.trim(),
            imageAlt: projectImageAltInput.value.trim(),
            meta: projectMetaTextarea.value.trim(),
            description: projectDescriptionTextarea.value.trim(),
            type: projectTypeSelect.value,
            videoId: projectVideoIdInput.value.trim(),
            embedUrl: projectEmbedUrlInput.value.trim(),
            link: projectLinkInput.value.trim(),
            linkText: projectLinkTextInput.value.trim() || 'View Source',
            isBeat: projectIsBeatCheckbox.checked,
            inPreview: projectInPreviewCheckbox.checked,
            gridPosition: null // Default to null
        };

        // Parse grid position carefully
        const gridPosValue = projectGridPositionInput.value.trim();
        if (gridPosValue !== '' && !isNaN(parseInt(gridPosValue, 10))) {
             projectData.gridPosition = parseInt(gridPosValue, 10);
         } else {
             projectData.gridPosition = null; // Ensure it's explicitly null if blank or invalid
         }

         // Clean up fields based on type (clear irrelevant ones)
        if (projectData.type !== 'youtube') projectData.videoId = '';
        if (projectData.type !== 'spotify' && projectData.type !== 'soundcloud') projectData.embedUrl = '';

         // --- Basic Validation ---
         let errors = [];
         if (!projectData.title) errors.push('Project Title is required.');
         if (!projectData.imageUrl) errors.push('Thumbnail Filename is required.');
         if (!projectData.link) errors.push('Source Link (URL) is required.');
         if (projectData.type === 'youtube' && !projectData.videoId) errors.push('YouTube Video ID is required for YouTube type.');
         if ((projectData.type === 'spotify' || projectData.type === 'soundcloud') && !projectData.embedUrl) errors.push('Embed URL is required for Spotify/SoundCloud type.');

         // Validate URL formats
         try { if(projectData.link) new URL(projectData.link); }
         catch(_) { errors.push('Source Link is not a valid URL.'); }
         try { if(projectData.embedUrl) new URL(projectData.embedUrl); } // Only validate if present
         catch(_) { errors.push('Embed URL is not a valid URL.'); }

         if (errors.length > 0) {
              alert(`Please fix the following errors:\n- ${errors.join('\n- ')}`);
              return;
         }

        // --- Save Project Data ---
        const existingProjectId = projectData.id;

        if (existingProjectId) {
            // Editing existing project
            const index = currentConfig.projects.findIndex(p => p.id === existingProjectId);
            if (index > -1) {
                currentConfig.projects[index] = projectData; // Overwrite existing
                 showStatus(`Project "${projectData.title}" updated. Remember to 'Save Configuration'.`, false);
                 console.log("Project updated:", projectData);
            } else {
                 // Should not happen if the form was populated correctly
                 console.error("Error: Could not find project to update with ID:", existingProjectId);
                 showStatus("Error: Could not find the project to update.", true);
                 return; // Stop execution
            }
        } else {
            // Adding new project
            // Generate a reasonably unique ID
            projectData.id = `proj_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
            currentConfig.projects.push(projectData);
             showStatus(`Project "${projectData.title}" added. Remember to 'Save Configuration'.`, false);
             console.log("Project added:", projectData);
        }

        renderProjectList(); // Update the list display immediately
        hideProjectEditor(); // Close the form
    }

    // --- Toggle Project Type Specific Fields ---
    function toggleProjectTypeFields() {
        if (!projectTypeSelect || !projectVideoIdGroup || !projectEmbedUrlGroup) return;
        const selectedType = projectTypeSelect.value;

        // Hide all type-specific groups first
        projectVideoIdGroup.style.display = 'none';
        projectEmbedUrlGroup.style.display = 'none';
        // Clear values of hidden fields
        projectVideoIdInput.value = (selectedType === 'youtube') ? projectVideoIdInput.value : '';
        projectEmbedUrlInput.value = (selectedType === 'spotify' || selectedType === 'soundcloud') ? projectEmbedUrlInput.value : '';


        // Show the relevant group
        if (selectedType === 'youtube') {
            projectVideoIdGroup.style.display = 'block';
        } else if (selectedType === 'spotify' || selectedType === 'soundcloud') {
            projectEmbedUrlGroup.style.display = 'block';
        }
        // No specific fields for 'instagram' or 'other' shown here
    }


    // --- Export Configuration ---
    function exportConfig() {
        console.log("Exporting configuration...");
        try {
            // Gather current form data into currentConfig BEFORE exporting
            // This ensures the export reflects the *current state* of the admin panel,
            // even if not saved to localStorage yet.
            gatherFormData();

            const configString = JSON.stringify(currentConfig, null, 2); // Pretty print JSON
            const blob = new Blob([configString], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            a.download = `artchive-config-${dateStr}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showStatus("Configuration JSON file download initiated.", false);
        } catch (error) {
             console.error("Error exporting config:", error);
             showStatus(`Error exporting configuration: ${error.message}`, true);
        }
    }

    // --- Import Configuration ---
    function importConfig(event) {
        console.log("Import configuration triggered.");
        const file = event.target.files[0];
        if (!file) {
             console.log("No file selected for import.");
             return; // No file selected
        }
        if (!file.type.match('application/json')) {
            showStatus("Import failed: Please select a valid JSON file (.json).", true);
            event.target.value = null; // Clear selection
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                console.log("Successfully parsed imported JSON.");

                // --- Validation ---
                if (!importedData || typeof importedData !== 'object') throw new Error("Invalid JSON structure (must be an object).");
                if (!importedData.siteSettings || typeof importedData.siteSettings !== 'object') throw new Error("Missing or invalid 'siteSettings' object.");
                if (!importedData.integrations || typeof importedData.integrations !== 'object') throw new Error("Missing or invalid 'integrations' object.");
                if (!importedData.license || typeof importedData.license !== 'object') throw new Error("Missing or invalid 'license' object.");
                if (!Array.isArray(importedData.projects)) throw new Error("Missing or invalid 'projects' array.");

                // Optional: Deeper project validation (e.g., check for title/id/type)
                 const invalidProject = importedData.projects.find(p => !p || typeof p !== 'object' || !p.id || !p.title || !p.type);
                 if (invalidProject) {
                     console.warn("Imported projects array contains invalid entries:", invalidProject);
                     throw new Error("Invalid project structure found in 'projects' array (missing id, title, or type?).");
                 }

                 console.log("Imported JSON structure validated.");

                 // If validation passes, replace currentConfig with imported data
                 // Merge with base structure first to ensure all keys exist
                 currentConfig = mergeDeep(JSON.parse(JSON.stringify(configStructure)), importedData);

                populateAdminForm(); // Update forms with imported data
                renderProjectList(); // Update project list display
                hideProjectEditor(); // Close editor if open
                showStatus("Configuration imported successfully. Review and 'Save Configuration' to persist.", false);

            } catch (error) {
                 console.error("Error importing config:", error);
                 showStatus(`Import Error: ${error.message}. Please ensure the file is valid JSON with the correct structure.`, true);
            } finally {
                 event.target.value = null; // Clear the file input
            }
        };
        reader.onerror = () => {
             showStatus("Error reading the configuration file.", true);
             event.target.value = null;
        };
        reader.readAsText(file);
    }

    // --- Reset Configuration to Defaults ---
     function resetConfig() {
         if (confirm("Are you sure you want to reset all settings in the admin panel to the default content.json values?\n\nThis will overwrite any unsaved changes. You still need to click 'Save Configuration' to persist the reset.")) {
             console.log("Resetting configuration to defaults...");
             // Use a deep copy of the loaded default content
             currentConfig = JSON.parse(JSON.stringify(defaultContent));
             // Ensure structure just in case defaultContent was flawed
             currentConfig = mergeDeep(JSON.parse(JSON.stringify(configStructure)), currentConfig);

             populateAdminForm();
             renderProjectList();
             hideProjectEditor();
             showStatus("Configuration reset to defaults. Click 'Save Configuration' to make it permanent.", false);
         } else {
             console.log("Configuration reset cancelled.");
         }
     }

    // --- Helper Functions ---
    function showStatus(message, isError = false) {
        if (!statusMessageDiv) return;
        statusMessageDiv.textContent = message;
        statusMessageDiv.className = `status-message ${isError ? 'status-error' : 'status-success'}`;
        statusMessageDiv.style.display = 'block';
        // Automatically hide after a few seconds
        setTimeout(() => {
            if (statusMessageDiv) statusMessageDiv.style.display = 'none';
        }, isError ? 6000 : 4000); // Longer display for errors
    }

     // Simple deep merge function (basic, handles objects and arrays)
     function mergeDeep(target, source) {
         const isObject = (obj) => obj && typeof obj === 'object';

         if (!isObject(target) || !isObject(source)) {
             return source; // If not objects, source overwrites target
         }

         Object.keys(source).forEach(key => {
             const targetValue = target[key];
             const sourceValue = source[key];

             if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                  // Simple array merge: source overwrites target array
                  // More complex merging (e.g., based on ID) could be done here if needed
                 target[key] = sourceValue;
             } else if (isObject(targetValue) && isObject(sourceValue)) {
                 target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue); // Recurse for nested objects
             } else {
                 target[key] = sourceValue; // Otherwise, source value overwrites target value
             }
         });

         return target;
     }

    // --- Setup Event Listeners ---
    function setupEventListeners() {
        if(saveConfigBtn) saveConfigBtn.addEventListener('click', saveConfig);
        if(exportConfigBtn) exportConfigBtn.addEventListener('click', exportConfig);
        if(importConfigInput) importConfigInput.addEventListener('change', importConfig);
        if(resetConfigBtn) resetConfigBtn.addEventListener('click', resetConfig); // Added listener

        if(addNewProjectBtn) addNewProjectBtn.addEventListener('click', () => showProjectEditor(null));
        if(cancelProjectEditBtn) cancelProjectEditBtn.addEventListener('click', hideProjectEditor);
        if(projectForm) projectForm.addEventListener('submit', handleProjectFormSubmit);
        if(projectTypeSelect) projectTypeSelect.addEventListener('change', toggleProjectTypeFields);

        // Use event delegation for project list edit/delete buttons
        if(projectListDiv) projectListDiv.addEventListener('click', handleProjectListClick);

         // Hide status message on click
         if (statusMessageDiv) statusMessageDiv.addEventListener('click', () => statusMessageDiv.style.display = 'none');

         console.log("Admin event listeners set up.");
    }


    // --- Initial Load ---
    initializeAdmin();

});
// END OF FILE: admin.js