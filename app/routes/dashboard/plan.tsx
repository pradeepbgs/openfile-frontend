import { useAuth } from '~/zustand/store';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for light and personal use.',
        features: [
            '3 upload links per day',
            '1 upload per link',
            'Files expire in 24 hr',
            'Basic support',
        ],
        planKey: 'free',
    },
    {
        name: 'Pro',
        price: '$2.99/month',
        description: 'For active users who need flexibility.',
        features: [
            '50 upload links per day',
            '10 uploads per link',
            'Files expire in 15 days',
            '24/7 support',
        ],
        planKey: 'pro',
    },
    {
        name: 'Enterprise',
        price: '$4.99/month',
        description: 'For teams and high-volume usage.',
        features: [
            'Unlimited upload links',
            '100 uploads per link',
            'Files expire in 30 days',
            '24/7 support',
        ],
        planKey: 'enterprise',
    },
];

export default function PlansPage() {
    const user = useAuth.getState().user;
    const currentPlan = user?.plan;

    const handleSelectPlan = (plan: string) => {
        // navigate to subscribe page with selected plan
        // Example: navigate(`/subscribe?plan=${plan}`);
        console.log("Selected plan:", plan);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`p-6 rounded-2xl shadow-xl transition duration-300 ${currentPlan === plan.planKey
                            ? "border border-purple-500 bg-white/5 backdrop-blur-md"
                            : "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500"
                            }`}
                    >
                        <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                        <p className="text-purple-400 text-2xl font-bold mb-4">{plan.price}</p>
                        <p className="text-gray-300 mb-4">{plan.description}</p>
                        <ul className="text-sm space-y-2 text-gray-200">
                            {plan.features.map((f, i) => (
                                <li className="text-green-400" key={i}>✓ {f}</li>
                            ))}
                        </ul>

                        {currentPlan === plan.planKey ? (
                            <button
                                disabled
                                className="mt-6 w-full bg-gray-700 text-white/70 py-2 rounded-md cursor-not-allowed"
                            >
                                Your Current Plan
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSelectPlan(plan.planKey)}
                                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 transition text-white py-2 rounded-md"
                            >
                                Choose {plan.name}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
