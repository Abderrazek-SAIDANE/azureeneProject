// Fonction pour sélectionner un onglet via XPath
function getTabByIndex(index) {
    //div[contains(@class,'dataTables_paginate')]/span/a
    const xpath = `//div[contains(@class,'dataTables_paginate')]/span/a[${index + 1}]`; // XPath pour sélectionner l'onglet par index (1 basé)
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue; // Retourne l'élément correspondant
}

// Fonction pour afficher un onglet en utilisant XPath
function showTab(tabIndex) {
    // Masquer tous les contenus des onglets
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        tabContent.style.display = 'none';
    });

    // Afficher le contenu du nouvel onglet
    const activeTabContent = document.querySelector(`#tab${tabIndex + 1}`);
    if (activeTabContent) {
        activeTabContent.style.display = 'block';
    }
}

// Fonction pour faire défiler les onglets
function nextTab() {
    currentTab = (currentTab + 1) % 4; // Passer à l'onglet suivant en boucle (4 onglets dans l'exemple)
    const tabLink = getTabByIndex(currentTab); // Sélectionner l'onglet via XPath
    if (tabLink) {
        tabLink.click(); // Simuler un clic sur l'onglet suivant
        showTab(currentTab); // Afficher l'onglet
    }
}

