import React, {useEffect} from 'react';
import crypto from "crypto";

const BotToken = "7253848762:AAG7ruAejfsBmai42943GNfimavGAJrVKlM";

const TelegramLogin = () => {
    useEffect(() => {
        // Function to handle Telegram authentication
        // @ts-ignore
        window.onTelegramAuth = (user) => {
            const hash = user.hash;
            console.log(JSON.stringify(user));
            delete user.hash;
            const keys = Object.keys(user);
            keys.sort();
            const sortedArray = keys.map(key => key + "=" + user[key]);
            const authString = sortedArray.join("\n");

            const secretKey = crypto.createHash("sha256").update(BotToken).digest();
            const expectedHash = crypto.createHmac("sha256", secretKey).update(authString).digest("hex");
            console.log(JSON.stringify(sortedArray));
            console.log({authString});
            console.log({expectedHash});
            console.log({secretKey});
            console.log({hash});
            alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
        };

        // Create the script element
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute('data-telegram-login', 'stevetest_bot');
        script.setAttribute('data-size', 'small');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');

        // Append the script to the document body
        document.body.appendChild(script);

        // Cleanup the script when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div id="telegram-login-container"></div>;
};

export default TelegramLogin;
