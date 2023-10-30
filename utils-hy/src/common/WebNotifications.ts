export interface IWebNotifications {
    isNotificationsSupported: boolean;
    isPermissionGranted: boolean;
    requestPermission: (notification?: Notification) => void;
    showNotification: (title: string, options?: WebNotificationOptions) => void;
}

export type WebNotificationOptions = NotificationOptions & { closeTimeout?: number };

export class WebNotifications implements IWebNotifications {
    private static _instance: WebNotifications;

    static get Instance() {
        if (!this._instance) {
            this._instance = new WebNotifications();
        }
        return this._instance;
    }

    public isNotificationsSupported: boolean;
    public isPermissionGranted: boolean;

    private constructor() {
        this.isNotificationsSupported = 'Notification' in window;
        this.isPermissionGranted = Notification.permission === 'granted';
    }
    public requestPermission(notification?: Notification) {
        if (!this.isNotificationsSupported) {
            return;
        }
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                this.isPermissionGranted = true;
            }
        });
    }

    public showNotification(title: string, options?: WebNotificationOptions) {
        if (!this.isNotificationsSupported) {
            return;
        }
        if (!this.isPermissionGranted) {
            return;
        }
        let notification = new Notification(title, { ...options });
        // notification.onshow = (ev) => {};
        notification.onclick = () => {
            notification.close();
        };
        setTimeout(notification.close.bind(notification), options?.closeTimeout ?? 5000);
    }
}
