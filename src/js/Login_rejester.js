const signUpButton = document.getElementById('signUpBtn');
        const signInButton = document.getElementById('signInBtn');
        const container = document.getElementById('container');

        // Switches the visual state to "Sign Up"
        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        // Switches the visual state back to "Sign In"
        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });

        // Handles the conditional visibility of the Company input
        function toggleCompanyField() {
            const accountType = document.getElementById('accountType').value;
            const companyDiv = document.getElementById('companyField');
            
            if (accountType === 'admin') {
                companyDiv.style.display = 'block';
            } else {
                companyDiv.style.display = 'none';
            }
        }

        ""