// Function to check for duplicates in an array
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

document.addEventListener("DOMContentLoaded", function() {
    var optionsContainer = document.getElementById("optionsContainer");
    var selectedOptionsTable = document.getElementById("selectedOptionsTable");
    var selectedOptions = [];
    var manualOptions = []; // Initialize manualOptions array

    var searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function() {
        var searchTerm = this.value.trim().toLowerCase();
        if (searchTerm === "") {
            optionsContainer.innerHTML = ""; // Clear options when search field is empty
            return;
        }        

        optionsContainer.innerHTML = ""; // Clear previous options

        // Fetch options only when the user starts typing
        fetchOptions();

        // Clear optionsContainer
        optionsContainer.innerHTML = "";

        // Display manual options excluding already selected options
        manualOptions.forEach(function(option) {
            if (!selectedOptions.includes(option) && option.toLowerCase().includes(searchTerm)) {
                addOption(option);
            }
        });
    });

    // Function to fetch options from API endpoint
    function fetchOptions() {
        fetch('http://localhost:3000/options') // Assuming your API endpoint is at /options
            .then(response => response.json())
            .then(data => {
                // Save manualOptions
                manualOptions = data;
            })
            .catch(error => console.error('Error fetching options:', error));
    }

    function addOption(optionText) {
        var checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("form-check");

        var checkboxInput = document.createElement("input");
        checkboxInput.classList.add("form-check-input");
        checkboxInput.type = "checkbox";
        checkboxInput.id = optionText;
        checkboxInput.name = optionText;
        checkboxInput.addEventListener("change", function() {
            if (this.checked) {
                selectedOptions.push(optionText);
            } else {
                var index = selectedOptions.indexOf(optionText);
                if (index !== -1) {
                    selectedOptions.splice(index, 1);
                }
            }
            updateSelectedOptionsTable();
        });

        var checkboxLabel = document.createElement("label");
        checkboxLabel.classList.add("form-check-label");
        checkboxLabel.setAttribute("for", optionText);
        checkboxLabel.textContent = optionText;

        checkboxDiv.appendChild(checkboxInput);
        checkboxDiv.appendChild(checkboxLabel);

        optionsContainer.appendChild(checkboxDiv);
    }

    function updateSelectedOptionsTable() {
        selectedOptionsTable.innerHTML = "";
        if (selectedOptions.length === 0) {
            selectedOptionsTable.innerHTML = "<tr><td colspan='5'>No options selected</td></tr>";
        } else {
            selectedOptions.forEach(function(option) {
                var row = selectedOptionsTable.insertRow();
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                // Split option text by '(', ')', and '_'
                var parts = option.split(/[\(\)_]+/);
                // Construct the option with parentheses
                cell1.textContent = parts[0];
                cell2.textContent = `(${parts[1]})`; // Enclose abbreviation in parentheses
                cell3.textContent = `(${parts[2]})`; // Enclose prix_labo in parentheses
                cell4.textContent = `Vide`; // Enclose prix_labo in parentheses
                // Remove button with icon
            var removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.classList.add("btn", "btn-danger", "btn-sm");

            // Add icon
            var removeIcon = document.createElement("i");
            removeIcon.classList.add("fas", "fa-trash-alt"); // Assuming you're using Font Awesome icons

            removeButton.appendChild(removeIcon);
            removeButton.addEventListener("click", function() {
                removeOption(option);
            });

            // Center the button
            var buttonWrapper = document.createElement("div");
            buttonWrapper.classList.add("d-flex", "justify-content-center"); // Flexbox utility classes
            buttonWrapper.appendChild(removeButton);
            cell5.appendChild(buttonWrapper);
            });
        }
    }

    function removeOption(optionText) {
        var index = selectedOptions.indexOf(optionText);
        if (index !== -1) {
            selectedOptions.splice(index, 1);
            updateSelectedOptionsTable();
            var checkbox = document.getElementById(optionText);
            if (checkbox) {
                checkbox.checked = false;
                checkbox.parentElement.classList.remove("selected");
            }
        }
    }

});
