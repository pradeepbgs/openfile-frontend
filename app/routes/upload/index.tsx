import { useForm } from "react-hook-form"

function UploadPage() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm()

    return (
        <div className="max-w-2xl mx-auto mt-12 px-4">

            <h1 className="text-2xl font-semibold text-center mb-6">
                Upload Encrypted Files
            </h1>

            <form action="">

            </form>

        </div>
    )
}

export default UploadPage