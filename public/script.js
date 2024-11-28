// Event listener for the search form
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('searchName').value;
    const type = document.getElementById('searchType').value;

    const response = await fetch(`/api/search?name=${name}&type=${type}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    const data = await response.json();
    const resultsDiv = document.getElementById('searchResults');
    if (data.length > 0) {
        resultsDiv.innerHTML = data
            .map(
                (item) =>
                    `<p>${type === 'doctor' ? 'Doctor' : 'Patient'}: ${JSON.stringify(item)}</p>`
            )
            .join('');
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
});

// Event listener for adding a doctor
document.getElementById('addDoctorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('doctorName').value;
    const specialization = document.getElementById('specialization').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const availability = document.getElementById('availability').value;

    const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, specialization, phone_number: phone, email, availability })
    });

    const result = await response.json();
    alert(result.message || 'Error adding doctor');
});

// Event listener for adding a patient
document.getElementById('addPatientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('patientName').value;
    const age = document.getElementById('age').value;
    const address = document.getElementById('address').value;
    const phone_number = document.getElementById('phoneNumber').value;
    const doctor_id = document.getElementById('doctorId').value;

    const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, age, address, phone_number, doctor_id })
    });

    const result = await response.json();
    alert(result.message || 'Error adding patient');
});

// Event listener for the search form
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('searchName').value;
    const type = document.getElementById('searchType').value;

    const response = await fetch(`/api/search?name=${name}&type=${type}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    const data = await response.text();  // Get HTML response
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = data;  // Insert HTML into results div

    // Attach event listeners to the update and delete buttons after results are rendered
    document.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', handleUpdate);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
});

// Handle update button click
async function handleUpdate(event) {
    const id = event.target.dataset.id;
    const type = event.target.dataset.type;

    // Redirect to update form or display modal (you can implement this part based on your need)
    alert(`Update clicked for ${type} with ID: ${id}`);
    // Example: you can open a modal or redirect to an update page like `/update/${type}/${id}`
}

// Handle delete button click
async function handleDelete(event) {
    const id = event.target.dataset.id;
    const type = event.target.dataset.type;

    const confirmation = confirm(`Are you sure you want to delete this ${type}?`);
    if (confirmation) {
        const response = await fetch(`/api/${type}s/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result = await response.json();
        if (result.message === `${type.charAt(0).toUpperCase() + type.slice(1)} deleted`) {
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
            // Remove the item from the UI or reload the page
            event.target.closest('.search-result').remove();
        } else {
            alert('Error deleting the item');
        }
    }
}
