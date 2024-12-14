var CsvToHtmlTable = CsvToHtmlTable || {};

CsvToHtmlTable = {

    init: function (options) {
        options = options || {};
        var csv_path = options.csv_path || "";
        var el = options.element || "table-container";
        var allow_download = options.allow_download || false;
        var csv_options = options.csv_options || {};
        var datatables_options = options.datatables_options || {};
        var custom_formatting = options.custom_formatting || "";

        // Map des fonctions de formatage personnalisé par colonne
        var customTemplates = {};
        $.each(custom_formatting, function (i, v) {
            var colIdx = v[0];
            var func = v[1];
            customTemplates[colIdx] = func;
        });

        var $table = $("<table class='table table-striped table-condensed' id='" + el + "-table'></table>");
        var $containerElement = $("#" + el);
        $containerElement.empty().append($table);

        // Chargement et traitement du fichier CSV
        $.when($.get(csv_path)).then(
            function (data) {
                var csvData = $.csv.toArrays(data, csv_options);
                // Création du header de la table
                var $tableHead = $("<thead></thead>");
                var csvHeaderRow = csvData[0];
                var $tableHeadRow = $("<tr></tr>");
                for (var headerIdx = 0; headerIdx < csvHeaderRow.length; headerIdx++) {
                    $tableHeadRow.append($("<th></th>").text(csvHeaderRow[headerIdx]));
                }
                $tableHead.append($tableHeadRow);
                $table.append($tableHead);
                
                // Création du corps de la table
                var $tableBody = $("<tbody></tbody>");
                for (var rowIdx = 1; rowIdx < csvData.length; rowIdx++) {
                    var $tableBodyRow = $("<tr></tr>");
                    for (var colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {

                        
                        var $tableBodyRowTd = $("<td></td>");

                        // Utilisation de templates personnalisés si disponibles
                        var cellTemplateFunc = customTemplates[colIdx];
                        if (cellTemplateFunc) {
                            $tableBodyRowTd.append($("<td></td>")).html(cellTemplateFunc(csvData[rowIdx][colIdx], rowIdx, colIdx));
                        } else {
                            $tableBodyRowTd.text(csvData[rowIdx][colIdx]);
                        }
                        $tableBodyRow.append($tableBodyRowTd);
                    }
                    $tableBody.append($tableBodyRow);
                }
                $table.append($tableBody);

                // Initialisation de DataTables
                $table.DataTable(datatables_options);
            });
    },

    // Fonction pour afficher des images si la cellule contient une URL
    imageFormatter: function (cellValue) {
        if (cellValue.split(";")[0]) {
            var img = $("<img>");
            img.attr("src", cellValue);
            img.attr("alt", "Image");
            img.css({
                width: "50px",
                height: "auto",
                borderRadius: "5px",
            });
            return img.prop("outerHTML"); // Retourne l'élément HTML sous forme de string
        }
        return ""; // Retourne une cellule vide si aucune URL
    }
   

};

// Exemple d'utilisation
/*CsvToHtmlTable.init({
    csv_path: "/data/test2.csv",
    element: "table-container",
    custom_formatting: [
        [0, CsvToHtmlTable.imageFormatter] // Applique l'affichage des images à la première colonne
    ],
    datatables_options: {
        paging: true,
        fixedHeader: true, // Pour un en-tête fixe
        scrollX: true, // Scrolling horizontal
    }
     // l'affichage des drapeaux ne fonctionne pas
      // https://datatables.net/extensions/fixedheader/examples/fixed_columns.html
});*/
