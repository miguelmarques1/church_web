export function Footer() {
    return (
        < footer className="bg-gray-900 text-white py-12 px-4" >
            <div className="max-w-7xl mx-auto text-center">
                <div className="flex items-center justify-center space-x-3 mb-6">
                    <img
                        src="/images/dark-logo.png"
                        alt="Logo Geração Eleita"
                        className="h-10 object-contain"
                    />
                </div>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                    Uma comunidade cristã comprometida com a Palavra de Deus e o amor ao próximo.
                    Venha fazer parte da nossa família!
                </p>
                <div className="border-t border-gray-800 pt-6">
                    <p className="text-gray-500">
                        © 2024 Geração Eleita. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer >
    );
}