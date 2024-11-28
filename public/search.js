document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('searchName').value;
    const type = document.getElementById('searchType').value;

    const response = await fetch(`/api/search?name=${name}&type=${type}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Pass token for authentication
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
