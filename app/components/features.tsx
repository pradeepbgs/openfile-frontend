import React from 'react'

function Feature() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-12">Why OpenFile?</h2>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
                        <h4 className="text-xl font-semibold mb-2">🔐 Private</h4>
                        <p className="text-gray-600">Your uploads are secure and only accessible by you.</p>
                    </div>
                    <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
                        <h4 className="text-xl font-semibold mb-2">🌐 Anonymous</h4>
                        <p className="text-gray-600">Share files without revealing identity. No account required for uploaders.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default React.memo(Feature)