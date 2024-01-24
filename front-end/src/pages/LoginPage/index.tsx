import backend from '../../axios/backend';
import React, { useState } from 'react';
import axios from 'axios';
interface Credentials {
    username: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // up = sera mise a true grace a usestate plus bas



    // Utiliser le hook useState pour gérer l'état du formulaire
    const [credentials, setCredentials] = useState<Credentials>({
        username: '',
        password: '',
    });

    const handleLogin = async () => {
        try {
            const resp = await axios.post('API 42 !!!!!!!!!!!!!', {
                // username,
                // password,
            });

            setIsAuthenticated(true);
        }
        catch (error) {
            console.log("ERROR AUTHENTIFICATION")
        }
    }

    // Fonction de gestion du changement d'entrée dans le formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ajoutez ici la logique d'authentification en utilisant les informations d'identification
        console.log('Credentials submitted:', credentials);
    };

    return (
        
        <div>
            <h1>Page d'authentification</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom d'utilisateur:
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Mot de passe:
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default LoginPage;
