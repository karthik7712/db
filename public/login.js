// document.getElementById('loginForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;
//     console.log("hi")
//     const response = await fetch('/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//     });
//     console.log(response.body);
//     const data = await response.json();
//     if (data.token) {
//         localStorage.setItem('token', data.token);
//         alert('Login successful!');
//         window.location.href = 'search.html'; // Redirect to search page
//     } else {
//         alert('Login failed!');
//     }
// });
