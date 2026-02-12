import styles from './GoogleLoginComponent.module.css';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import GoogleLogo from "../Images/registration/GoogleLogo.svg"
import { GOOGLEAUTHCLIENTID } from '../../../constants';

function GoogleLoginBtnComponent({ handleEmail, setUserDetails }) {
    const loginWithGoogle = useGoogleLogin({
        onSuccess: tokenResponse => {
            const accessToken = tokenResponse.access_token;
            const userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';

            fetch(userInfoUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    handleEmail(data.email);
                    setUserDetails(prev => ({ ...prev, email: data.email }));
                })
                .catch((error) => {
                    showAlert('error', 'Something went wrong, please try again!');
                });

        },
        onError: () => {
            showAlert('error', 'Something went wrong, please try again!');
        }
    });

    return (
        <button onClick={() => loginWithGoogle()} className={styles.googleLoginBtn}>
            <img src={GoogleLogo} alt="Google Logo" className={styles.googleLogo} />
            Continue With Google
        </button>
    );
}

export default function GoogleLoginComponent({ handleEmail, setUserDetails }) {
    return (
        // old ID = 632343964150-fj36tpt6rj1cppss7u5490auf6pf023m.apps.googleusercontent.com
        // new ID = 305404601485-aoho4ale08t6dp087j079a7beit1l183.apps.googleusercontent.com
        <GoogleOAuthProvider clientId={GOOGLEAUTHCLIENTID}>
            <GoogleLoginBtnComponent handleEmail={handleEmail} setUserDetails={setUserDetails} />
        </GoogleOAuthProvider>
    );
}
