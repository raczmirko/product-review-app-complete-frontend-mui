class NotificationUtil {
    static getCustomNotification = (code, message) => {
        let text = code + ": " + message;
        if(code === 400 && (message === undefined || message.length === 0 || message === null)) {
            text = code + ": BAD REQUEST. Something went wrong, please try again!";
        }
        if(code === 401 && (message === undefined || message.length === 0 || message === null)) {
            text = code + ": Authentication failed. Log in again!";
        }
        if(code === 403 && (message === undefined || message.length === 0 || message === null)) {
            text = code + ": Permission error. Your session might have expired or you might need admin privileges.";
        }
        if(code === 404 && (message === undefined || message.length === 0 || message === null)) {
            text = code + ": NOT FOUND.";
        }
        if(code === 409) {
            text = code + ": " + message;
        }
        return text;
    }
}

export default NotificationUtil;
