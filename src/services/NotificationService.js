class NotificationService {
    static getCustomNotification = (code, message) => {
        let text = code + ": An error occurred, please try again later!";
        if(code === 400) {
            text = code + ": A country with this name or country code might already exist.";
        }
        if(code === 401) {
            text = code + ": Authentication failed. Log in again!";
        }
        if(code === 403) {
            text = code + ": You cannot access this page. Your session might have expired or you might need admin privileges to view.";
        }
        if(code === 404) {
            text = code + ": NOT FOUND.";
        }
        if(code === 409) {
            text = code + ": " + message;
        }
        return text;
    }
}

export default NotificationService;
