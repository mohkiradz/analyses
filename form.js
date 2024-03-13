document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        pre: document.getElementById('pre').value,
        num: document.getElementById('num').value, // Convert to integer
        selectedOptionsData: (function() {
            var selectedOptionsData = [];
            var tableBody = document.getElementById("selectedOptionsTable");
            for (var i = 0; i < tableBody.rows.length; i++) {
                var row = tableBody.rows[i];
                var optionText = row.cells[0].textContent.trim();
                selectedOptionsData.push(optionText);
            }
            return selectedOptionsData;
        })() // Get data from table
    };
    
    console.log(formData);

    // Make POST request to backend server
    fetch('submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Form data submitted successfully:', data);
        // Optionally, display success message to the user
    })
    .catch(error => {
        console.error('There was a problem submitting the form:', error);
        // Optionally, display error message to the user
    });
});
