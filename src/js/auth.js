const BASE_URL = window.BASE_URL || "127.0.0.1:8000"; // Fallback if not set

async function login(username, password) {
    try {

        const tokenResponse = await fetch(`http://${BASE_URL}/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!tokenResponse.ok) {
            throw new Error('Login failed: Invalid credentials or server error');
        }

        const tokenData = await tokenResponse.json();
        const { access, refresh } = tokenData;

        const payload = JSON.parse(atob(access.split('.')[1]));
        const userId = payload.user_id;


        const userResponse = await fetch(`http://${BASE_URL}/api/users/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to retrieve user information');
        }

        const userData = await userResponse.json();

        return {
            username: userData.username,
            is_admin: userData.is_admin,
            company: userData.company,
            accessToken: access,
            refreshToken: refresh
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}


async function register(username, email, password, password_confirm, is_admin, company) {
    try {
        const response = await fetch(`http://${BASE_URL}/api/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                password_confirm: password_confirm,
                is_admin: is_admin,
                company: company
            })
        });

        if (!response.ok) {
            throw new Error('Registration failed: ' + response.statusText);
        }

      
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}
