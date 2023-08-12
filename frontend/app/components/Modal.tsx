interface ModalSate {
    isOpen: boolean
}

function DeployingModal({ isOpen }: ModalSate) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-xl font-bold text-black">Creating Original...</p>
            </div>
        </div>
    );
}

export default DeployingModal;