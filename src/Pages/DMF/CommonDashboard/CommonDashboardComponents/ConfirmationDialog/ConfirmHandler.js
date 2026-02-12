import { createRoot } from 'react-dom/client';
import ConfirmationDialog from ".";

export const openDialog = (title, message) => {
    return new Promise((resolve, reject) => {
        const dialogContainer = document.createElement('div');
        document.body.appendChild(dialogContainer);

        // const domNode = document.createElement('div');
        const root = createRoot(dialogContainer);

        const handleClose = (result) => {
            root.unmount();
            resolve(result);
        };

        root.render(
            <ConfirmationDialog title={title} message={message} handleClose={handleClose} isOpen={true} />
        );
    });
};